const tenantValidator = (req, res, next) => {
  if (req.user && req.user.role === "tenant") {
    next();
  } else {
    res.status(403).json({ error: "Protected only for tenants" });
  }
};
module.exports = {
  tenantValidator,
};
