const express = require('express');
const router = express.Router();
const {}=require("../controllers/AdminController")
const {verifyUser}=require("../controllers/verificationController")
const {adminAuthorization}=require("../middleware/adminAuthorization")
const {protect}=require("../middleware/authMiddleware")
const {checkBlockedStatus}=require("../middleware/checkBlockedStatusMiddleware")
const {allUsers,deleteUser,updateUsers}=require("../controllers/UserController");
const { blockUnblock } = require('../controllers/blockUserController');
const { createUserAccount, updateUserAccount,deleteUserAccount } = require('../controllers/accountCreationController');

// User verification
router.put('/verification/:userId', protect, adminAuthorization, verifyUser);

// Get all users by Admin    
router.get("/allUsers", protect, checkBlockedStatus, adminAuthorization, allUsers);
// Delete a user by Admin 
router.delete("/deleteUser/:id", protect, checkBlockedStatus, adminAuthorization, deleteUser);
//update a user by Admin
router.put("/update/updateUser/:id",protect, checkBlockedStatus, adminAuthorization, updateUsers)
// Block or unblock user by Admin 
router.put("/block-unblock-user/:userId", protect, adminAuthorization, blockUnblock);

//creating and managing user account  
//admin create user account
router.post('/createUser',protect, adminAuthorization , createUserAccount);    
//admin update user account
router.put('/updateUserAccount/:id',protect,adminAuthorization, updateUserAccount);
//admin delete user account
router.delete('/deleteUserAccount/:id', protect,adminAuthorization, deleteUserAccount);

module.exports = router;  
   