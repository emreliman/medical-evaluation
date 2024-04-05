function validateMembership(req, res, next) {
  const allowedMemberships = ["monthly", "annual", "free", "singleUse"];
  const userMembership = req.body.plan;

  if (!allowedMemberships.includes(userMembership)) {
    return res.status(400).json({ error: "Geçersiz abonelik türü." });
  }

  next();
}

module.exports = validateMembership;
