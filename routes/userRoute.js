const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminValidator } = require("../middleware/adminValidator");
const {
  register,
  login,
  logout,
  getProfile,
  getAllProfile,
} = require("../controllers/userController");

router.post("/", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.get("/allprofiles", protect, adminValidator, getAllProfile);

// routes for admin


module.exports = router;
