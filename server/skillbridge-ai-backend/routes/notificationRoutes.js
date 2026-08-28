const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notificationController");

// Get all notifications
router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

// Get unread count
router.get(
    "/unread-count",
    authMiddleware,
    getUnreadCount
);

// Mark all as read
router.put(
    "/read-all",
    authMiddleware,
    markAllAsRead
);

// Mark one as read
router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);

module.exports = router;