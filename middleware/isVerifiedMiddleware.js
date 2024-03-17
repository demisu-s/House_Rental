const isVerified = (req, res, next) => {
    console.log('req.user:', req.user); // Debug logging

    // Check if user is authenticated and verified
    if (!req.user || !req.user.verified) {
        return res.status(403).json({ message: 'Access denied. User is not verified.' });
    }

    // Allow access for verified users
    next();
};

module.exports = { isVerified };
