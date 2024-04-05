const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user_model.js"); // User modelini import ettik.
const bcrypt = require("bcrypt");
const passwordValidation = require("../middleware/passwordValidation");
const validateMembership = require("../middleware/membershipValidation.js");
const validateEmail = require("../middleware/emailValidation.js");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "E-posta adresi veya şifre hatalı." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "E-posta adresi veya şifre hatalı." });
    }

    const token = generateToken(user._id, user.membershipType);

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    const newAccessToken = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    ); // Örnek süre, uygulamanıza göre ayarlayın
    const newRefreshToken = generateRefreshToken(userId);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid refresh token" });
  }
});
router.post(
  "/register",
  validateEmail,
  passwordValidation,
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      let user = await UserModel.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (user) {
        return res
          .status(400)
          .json({ error: "Bu kullanıcı adı zaten kullanılıyor." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
      });
      await user.save();

      const token = generateToken(user._id, user.membershipType);

      const refreshToken = generateRefreshToken(user._id);
      user.refreshToken = refreshToken;
      await user.save();

      res.json({ token, refreshToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.post("/subscribe", validateMembership, async (req, res) => {
  const { userId, plan } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (user.subscriptionUsed) {
      return res
        .status(400)
        .json({ message: "Bu abonelik türü zaten kullanıldı." });
    }

    user.membershipType = plan;
    user.subscriptionUsed = true;

    await user.save();

    res.json({ message: "Abonelik başarıyla oluşturuldu." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/subscriptions/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const subscription = {
      userId: user._id,
      plan: user.membershipType,
      startDate: user.createdAt,
      endDate: calculateEndDate(user.membershipType),
    };

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function calculateEndDate(plan) {
  const today = new Date();
  let endDate = new Date(today);

  if (plan === "basic") {
    endDate.setDate(today.getDate() + 30);
  } else if (plan === "premium") {
    endDate.setDate(today.getDate() + 365);
  }

  return endDate;
}

function generateToken(userID, membershipType) {
  return jwt.sign({ userID, role: membershipType }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

module.exports = router;
