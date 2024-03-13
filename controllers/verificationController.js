const User = require('../models/userModel');

const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query; // Role to verify (landlord, broker, renter)

    // Validate the role parameter
    if (!['Landlord', 'Broker', 'Tenant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's role matches the role to verify
    if (user.role !== role) {
      return res.status(400).json({ error: 'User role does not match the specified role for verification' });
    }

    // Assume a verified field exists on the user model
    // Perform verification logic here (e.g., update user's status to verified)
    user.verified = true;
    await user.save();

    res.json({ message: `${role} verified successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { verifyUser };
