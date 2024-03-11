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
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
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

    const { firstName, lastName, location, phone, email, password, role } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Profile image is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,    
      location,
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
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
  deleteUser
};
   