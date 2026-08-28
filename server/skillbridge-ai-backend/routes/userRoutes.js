const express = require("express");

const router = express.Router();

const {
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    changeUserRole
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// Logged-in user's profile
router.get(
    "/profile",
    verifyToken,
    getProfile
);


// Admin - Get all users
router.get(
    "/users",
    verifyToken,
    // adminMiddleware,
    getAllUsers
);


// Admin - Update user
router.put(
    "/users/:id",
    verifyToken,
    // adminMiddleware,
    updateUser
);


// Admin - Change role
router.patch(
    "/users/:id/role",
    verifyToken,
    // adminMiddleware,
    changeUserRole
);


// Admin - Delete user
router.delete(
    "/users/:id",
    verifyToken,
    // adminMiddleware,
    deleteUser
);


module.exports = router;