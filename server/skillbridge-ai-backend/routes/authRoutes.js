const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getAllUsers,
    forgotPassword,
    verifyOtp,
    resetPassword
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");


// Register
router.post("/register", registerUser);


// Login (email or mobile)
router.post("/login", loginUser);

// Forgot Password - send OTP to email or mobile
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);


// Get Profile
router.get("/profile", verifyToken, getProfile);


// Update Profile
router.put("/profile", verifyToken, updateProfile);


module.exports = router;