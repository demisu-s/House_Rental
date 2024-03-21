const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 8 }, // 5 MB limit
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false); 
    } 
  }
}).single('profileImage'); 
 
 
 
const register = async (req, res) => {  
  upload(req, res, async (err) => {
    console.log(req.file); 
    console.log(req.body);
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { firstName, lastName, address, phone, email, password, role } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Profile image is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,    
      address, 
      phone,
      email,
      password: hashedPassword, 
      role,
      profileImagePath: req.file.path
    });
    res.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImagePath: user.profileImagePath, 
      token: generateToken(user._id) 
    });
  });    
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id);
    res.json({
      _id: user.id,
      firstName: user.firstName,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

const Profile = (req, res) => {
  res.json(req.user);
};

const allUsers = async (req, res) => {   
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const searchUser = async (req, res) => {   
  try {
    let filter = {};

    // Extract query parameters for filtering
    const { role, name, email } = req.query;

    // Build the filter object based on provided query parameters
    if (role) {
      filter.role = role;
    }
    if (name) {
      filter.$or = [
        { firstName: { $regex: name, $options: 'i' } }, // Case-insensitive search
        { lastName: { $regex: name, $options: 'i' } }
      ];
    }
    if (email) {
      filter.email = { $regex: email, $options: 'i' }; // Case-insensitive search
    }

    // Find users based on the filter
    const users = await User.find(filter);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const updateUsers = async (req, res) => {
  try {
    const userId = req.params._id;
    const updateData = req.body; // Assuming you pass update data in the request body

    // Check if update data is provided
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Update data is required" });
    }

    // Find user by ID and update with provided data
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
   
    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const deleteUser = async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const forgotPassword=async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: 'This email is not registered' });
      }

      // Generate reset token
      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 



const resetPassword=async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find user by id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Reset token has expired' });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  register,
  login,
  Profile,
  allUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateUsers,
  searchUser
};
   