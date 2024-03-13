const User = require('../models/userModel');

// Function to create user accounts
const createUser = async (req, res) => {
  try {
    const { role } = req.user; // Assuming  middleware that sets req.user to the authenticated user

    if (role !== 'SuperAdmin' && role !== 'Admin') {
      return res.status(403).json({ error: 'You do not have permission to create accounts' });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { role, _id } = req.user;
  
      const userToUpdate = await User.findById(id);
  
      if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (role !== 'SuperAdmin' && role !== 'Admin' && _id.toString() !== id) {
        return res.status(403).json({ error: 'You do not have permission to update this account' });
      }
  
      // Update user information
      Object.assign(userToUpdate, req.body);
      await userToUpdate.save();
  
      res.json({ message: 'User updated successfully', user: userToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { role, _id } = req.user;
  
      if (role !== 'SuperAdmin' && role !== 'Admin') {
        return res.status(403).json({ error: 'You do not have permission to delete accounts' });
      }
  
      if (_id.toString() === id) {
        return res.status(403).json({ error: 'You cannot delete your own account' });
      }
  
      // Optional: Implement account deactivation instead of deletion
      // await User.findByIdAndUpdate(id, { active: false });
  
      await User.findByIdAndDelete(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports={
    
    createUser,
    updateUser,
    updateUser

  }
