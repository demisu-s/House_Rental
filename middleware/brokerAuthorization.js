const brokerAuthorization = (req, res, next) => {
  if (req.user && req.user.role === "Broker") {
    next();
  } else {
    res.status(403).json({ error: "Available for broker" });
  }
};
module.exports = {
  brokerAuthorization,
};
