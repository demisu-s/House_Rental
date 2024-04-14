const landlordAuthorization = (req, res, next) => {
    if (req.user.role === "Landlord") {
        next();
    } else {
        res.status(403).json({ error: "Available for Admin Only" });
    }
};

module.exports = {
    landlordAuthorization,
};
