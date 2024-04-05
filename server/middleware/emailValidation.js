const validateEmail = (req, res, next) => {
  const email = req.body.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address format." });
  }

  next();
};

module.exports = validateEmail;
