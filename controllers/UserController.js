const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
  const { firstName,lastName,location,phone, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    location,
    phone,
    email,
    password: hashedPassword,
    role
  });

  res.status(201).json(user);
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
