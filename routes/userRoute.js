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
  allUsers,
} = require("../controllers/UserController");
const { userValidator } = require("../middleware/userValidator");
const { protect } = require("../middleware/authMiddleware");
const { isVerified } = require('../middleware/isVerifiedMiddleware');
const { createUser, updateUser, createUserAccount, updateUserAccount, deleteUserAccount } = require('../controllers/accountCreationController');
const {authorizeRoles}=require("../middleware/accountCreationMiddleware");
const { checkBlockedStatus } = require('../middleware/checkBlockedStatusMiddleware');
const { assignAdminRole, blockUnblock } = require('../controllers/blockUserController');
const { superAdminAuthorization } = require('../middleware/superAdminAuthorization');
const { adminAuthorization } = require('../middleware/adminAuthorization');
const { verifyUser } = require('../controllers/verificationController');

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

// Assign admin role by super admin
router.put('/assign-admin/:userId',protect, superAdminAuthorization, assignAdminRole);



// User verification by Admin
router.put('/verification/:userId', protect, adminAuthorization, verifyUser);
// Get all users by Admin  and super Admin 
router.get("/allUsers", protect, checkBlockedStatus, (adminAuthorization,superAdminAuthorization), allUsers);
// Delete a user by Admin and super Admin
router.delete("/deleteUser/:id", protect, checkBlockedStatus, (adminAuthorization,superAdminAuthorization), deleteUser);
//update a user by Admin and super Admin
router.put("/updateUser/:id",protect, checkBlockedStatus, (adminAuthorization,superAdminAuthorization), updateUsers)

// Block or unblock user by Admin and super Admin
router.put("/block-unblock-user/:userId", protect, (adminAuthorization,superAdminAuthorization), blockUnblock);


//creating and managing user account  
//admin and super admin create user account
router.post('/createUser',protect, (adminAuthorization,superAdminAuthorization) , createUserAccount);    
//admin and super admin update user account
router.put('/updateUserAccount/:id',protect,(adminAuthorization,superAdminAuthorization), updateUserAccount);
//admin and super admin delete user account
router.delete('/deleteUserAccount/:id', protect,(adminAuthorization,superAdminAuthorization), deleteUserAccount);


module.exports = router;
