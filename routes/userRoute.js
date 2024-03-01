const express = require('express');
const router = express.Router();
const {register,login,Profile,allUsers,deleteUser}=require("../controllers/UserController")
const {userValidator}=require("../middleware/userValidator")
const {protect}=require("../middleware/authMiddleware")
const {adminValidator}=require("../middleware/adminValidator")


router.post("/",userValidator,register);
router.post("/login", login);
router.get("/profile",protect,Profile); 
router.get("/allUsers",protect,adminValidator,allUsers);
router.delete("/deleteUser",protect,adminValidator,deleteUser)
module.exports = router; 
 