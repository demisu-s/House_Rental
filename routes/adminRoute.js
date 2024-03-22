const express = require('express');
const router = express.Router();


// User verification by Admin
// router.put('/verification/:userId', protect, adminAuthorization, verifyUser);

 // Get all users by Admin  and super Admin 
// router.get("/allUsers", protect, checkBlockedStatus, (adminAuthorization,superAdminAuthorization), allUsers);
// Delete a user by Admin and super Admin
// router.delete("/deleteUser/:id", protect, checkBlockedStatus, adminAuthorization, deleteUser); //update a user by Admin
// router.put("/update/updateUser/:id",protect, checkBlockedStatus, adminAuthorization, updateUsers)
 // Block or unblock user by Admin 
// router.put("/block-unblock-user/:userId", protect, (adminAuthorization,superAdminAuthorization), blockUnblock);

module.exports = router;  
   