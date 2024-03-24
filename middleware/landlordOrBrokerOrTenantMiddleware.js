const landlordOrBrokerOrTenantMiddleware = (req, res, next) => {
  if (
    req.user.role === "Tenant" ||
    req.user.role === "Broker" ||
    req.user.role === "Landlord"
  ) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Available for Tenant, Broker or Landlord Only" });
  }
};

module.exports = {
  landlordOrBrokerOrTenantMiddleware,
};
