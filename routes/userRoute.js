const express = require('express');
const router = express.Router();
const {
  register,
  login,
  Profile,
  allUsers,
  deleteUser,
  forgotPassword,
  resetPassword
} = require("../controllers/UserController");
const { userValidator } = require("../middleware/userValidator");
const { protect } = require("../middleware/authMiddleware");
const { adminAuthorization } = require("../middleware/adminAuthorization");
const { superAdminAuthorization } = require("../middleware/superAdminAuthorization");
const { blockUnblock, assignAdminRole } = require("../controllers/superAdminController");
const { checkBlockedStatus } = require("../middleware/checkBlockedStatusMiddleware");
const {verifyUser}=require("../controllers/verificationController");
const { isVerified } = require('../middleware/isVerifiedMiddleware');
const { createUser, updateUser } = require('../controllers/accountCreationController');
const {authorizeRoles}=require("../middleware/accountCreationMiddleware")

// Register a new user
router.post("/", userValidator, register);

// Assign admin role by super admin
router.put('/:userId/assign-admin', superAdminAuthorization, assignAdminRole);
// User verification
router.put('/verify/:userId', protect, adminAuthorization, verifyUser);

// User login
router.post("/login",isVerified,login);

// Get user profile
router.get("/profile", protect, Profile);

// Get all users (Admin or Super Admin only)
router.get("/allUsers", protect, checkBlockedStatus, [adminAuthorization, superAdminAuthorization], allUsers);

// Delete a user (Admin or Super Admin only)
router.delete("/deleteUser/:id", protect, checkBlockedStatus, [adminAuthorization, superAdminAuthorization], deleteUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Block or unblock user (Super Admin only)
router.put("/block-unblock-user", protect, superAdminAuthorization, blockUnblock);


//creating account for user by superAdmin and admin
router.post('/createUser', authorizeRoles('SuperAdmin', 'Admin'), createUser);
router.put('/updateUser/:id', authorizeRoles('SuperAdmin', 'Admin'), updateUser);
router.delete('/deleteUser/:id', authorizeRoles('SuperAdmin', 'Admin'), deleteUser);


module.exports = router;
