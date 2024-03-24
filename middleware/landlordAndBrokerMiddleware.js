const landlordAndBrokerMiddleware = (req, res, next) => {
  if (req.user.role === "Broker" || req.user.role === "Landlord") {
    next();
  } else {
    res.status(403).json({ error: "Available for Broker or Landlord Only" });
  }
};

module.exports = {
  landlordAndBrokerMiddleware,
};
