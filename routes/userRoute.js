const express = require('express');
const router = express.Router();
const {
  register,
  login,
  Profile,
  deleteUser,
  updateUsers,
  forgotPassword,
  resetPassword,
  searchUser,
} = require("../controllers/UserController");
const { userValidator } = require("../middleware/userValidator");
const { protect } = require("../middleware/authMiddleware");
const { isVerified } = require('../middleware/isVerifiedMiddleware');
const { createUser, updateUser } = require('../controllers/accountCreationController');
const {authorizeRoles}=require("../middleware/accountCreationMiddleware");
const { checkBlockedStatus } = require('../middleware/checkBlockedStatusMiddleware');

// Register a new user
router.post("/", userValidator, register);   
// User login
router.post("/login",protect,isVerified,login);
router.post("/AdminLogin",protect,login); 
//search user by role name and email
router.get("/search",protect,authorizeRoles('SuperAdmin','Admin'),searchUser)
// Get user profile by currently logged account
router.get("/profile", protect,checkBlockedStatus, Profile);
router.put("/profile/:userId",protect,checkBlockedStatus,updateUsers)

// Forgot password 
router.post('/forgot-password', forgotPassword); 
// Reset password
router.post('/reset-password', resetPassword);





module.exports = router;
