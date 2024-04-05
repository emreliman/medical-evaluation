function passwordValidation(req, res, next) {
  const { password } = req.body;

  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!regex.test(password)) {
    return res.status(400).json({
      error:
        "Şifre en az 8 karakter içermeli ve en az bir büyük ve bir küçük harf içermelidir.",
    });
  }

  next();
}

module.exports = passwordValidation;
