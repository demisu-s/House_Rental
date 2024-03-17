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
router.post("/AminLogin",login); 
// Get user profile by currently logged account
router.get("/profile", protect,checkBlockedStatus, Profile);
router.put("/profile/:userId",protect,checkBlockedStatus,updateUsers)

// Forgot password
router.post('/forgot-password', forgotPassword); 
// Reset password
router.post('/reset-password', resetPassword);
//creating account for user by superAdmin and admin
router.post('/createUser', authorizeRoles('SuperAdmin', 'Admin'), createUser);
router.put('/updateUser/:id', authorizeRoles('SuperAdmin', 'Admin'), updateUser);
router.delete('/deleteUser/:id', authorizeRoles('SuperAdmin', 'Admin'), deleteUser);


module.exports = router;
