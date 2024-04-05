function membershipMiddleware(req, res, next) {
  const membershipType = req.user.membershipType;

  if (membershipType === "free") {
    return res.status(403).json({
      error: "Forbidden: Free users are not allowed to access this resource.",
    });
  }

  next();
}

module.exports = membershipMiddleware;
