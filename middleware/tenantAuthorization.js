const tenantAuthorization = (req, res, next) => {
  if (req.user && req.user.role === "Tenant") {
    next();
  } else {
    res.status(403).json({ error: "Available for Tenant Only" });
  }
};
module.exports = {
  tenantAuthorization,
};
