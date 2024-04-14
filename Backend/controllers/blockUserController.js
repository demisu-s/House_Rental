const User = require("../models/userModel");

const blockUnblock = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming userId is passed as a parameter
        const { blocked } = req.body; // The value to block/unblock the user
  
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate the 'blocked' field
        if (typeof blocked !== 'boolean') {
            return res.status(400).json({ error: "Invalid value for 'blocked'. Must be a boolean." });
        }

        // Update the 'blocked' field of the user
        user.blocked = blocked;
        await user.save();

        res.json({ message: blocked ? "User blocked successfully" : "User unblocked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const assignAdminRole = async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find the user by ID
      const user = await User.findById(userId);
  
      // If the user does not exist, return a 404 error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update the user's role to Admin
      user.role = 'Admin'; 
      await user.save();
  
      res.json({ message: `User with ID ${userId} is now assigned the Admin role` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = {
    blockUnblock,
    assignAdminRole
};
