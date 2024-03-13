const adminAuthorization = (req, res, next) => {
    if (req.user.role === "Admin") {
        next();
    } else {
        res.status(403).json({ error: "Available for Admin Only" });
    }
};

module.exports = {
    adminAuthorization,
};
