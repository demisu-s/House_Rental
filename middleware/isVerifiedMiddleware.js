
const isVerified = (req, res, next) => {
    if (!req.user.verified) {
      return res.status(403).json({ message: 'Access denied. User is not verified.' });
    }
    next();
  };
  
  module.exports = { isVerified };
  