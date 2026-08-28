const Notification = require("../models/Notification");

// ===============================
// GET MY NOTIFICATIONS
// ===============================
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id,
        })
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications,
        });
    } catch (error) {
        console.error(
            "Get Notifications Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch notifications",
        });
    }
};

// ===============================
// GET UNREAD COUNT
// ===============================
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            user: req.user.id,
            isRead: false,
        });

        res.status(200).json({
            count,
        });
    } catch (error) {
        console.error(
            "Unread Count Error:",
            error
        );

        res.status(500).json({
            message: "Failed to get unread count",
        });
    }
};

// ===============================
// MARK ONE AS READ
// ===============================
const markAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.id,
                },
                {
                    isRead: true,
                },
                {
                    new: true,
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error(
            "Mark Notification Read Error:",
            error
        );

        res.status(500).json({
            message: "Failed to mark notification as read",
        });
    }
};

// ===============================
// MARK ALL AS READ
// ===============================
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.user.id,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(
            "Mark All Read Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to mark all notifications as read",
        });
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};