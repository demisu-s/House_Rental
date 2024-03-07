const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

// user registration
const register = async (req, res) => {
  try {
    // check if all fields are added
    const { firstName, lastName, email, password, address, role } = req.body;
    if (!firstName || !lastName || !email || !password || !address || !role) {
      res.status(400).json({ error: "Please include all fields" });
    }
    // check if user already exists or not
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "User already exists!" });
    }
    // hash password
    const salt = await bcrypt.genSalt(10); //generates random 10 strings
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    // save the new user
    await newUser.save();

    // send a success message
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Registration failed!", error: error.message });
  }
};

// user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }
    // compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
  res.json({ message: "User logged in successfully" });
};
// get profile
const getProfile = (req, res) => {
  res.json(req.user);
};
// get all profiles
const getAllProfile = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// user logout
const logout = (req, res) => {
  res.json({ message: "User logged out successfully" });
};

module.exports = {
  register,
  login,
  getProfile,
  getAllProfile,
  address,
  logout,
};
