const express = require('express');
const router = express.Router();
const {protect}=require("../middleware/authMiddleware")
const {superAdminAuthorization}=require("../middleware/superAdminAuthorization");
const { blockUnblock, assignAdminRole } = require('../controllers/blockUserController');
const { checkBlockedStatus } = require('../middleware/checkBlockedStatusMiddleware');
const { allUsers, deleteUser, updateUsers } = require('../controllers/UserController');


// Block or unblock user by Super Admin  including admin
router.put("/block-unblock-user", protect, superAdminAuthorization, blockUnblock);

// Assign admin role by super admin
router.put('/:userId/assign-admin', superAdminAuthorization, assignAdminRole);
// Get all users by super Admin    
router.get("/allUsers", protect, checkBlockedStatus, superAdminAuthorization, allUsers);
// Delete a user by super Admin 
router.delete("/deleteUser/:id", protect, checkBlockedStatus, superAdminAuthorization, deleteUser);
//update a user by super Admin
router.put("/updateUser/:id",protect, checkBlockedStatus, superAdminAuthorization,updateUsers)

module.exports=router