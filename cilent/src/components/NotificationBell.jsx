import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] =
        useState(false);

    // ======================================
    // FETCH NOTIFICATIONS
    // ======================================

    const fetchNotifications = async () => {

        try {

            const response =
                await API.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.error(
                "Fetch Notifications Error:",
                error
            );

        }

    };

    // ======================================
    // FETCH UNREAD COUNT
    // ======================================

    const fetchUnreadCount = async () => {

        try {

            const response =
                await API.get(
                    "/notifications/unread-count"
                );

            setUnreadCount(
                response.data.count || 0
            );

        } catch (error) {

            console.error(
                "Unread Count Error:",
                error
            );

        }

    };

    // ======================================
    // LOAD DATA
    // ======================================

    useEffect(() => {

        fetchNotifications();

        fetchUnreadCount();

    }, []);

    // ======================================
    // OPEN NOTIFICATIONS
    // ======================================

    const handleToggle = () => {

        setShowNotifications(
            !showNotifications
        );

        if (!showNotifications) {

            fetchNotifications();

        }

    };

    // ======================================
    // MARK ONE AS READ
    // ======================================

    const markAsRead = async (id) => {

        try {

            await API.put(
                `/notifications/${id}/read`
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id
                        ? {
                              ...notification,
                              isRead: true
                          }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                prev > 0 ? prev - 1 : 0
            );

        } catch (error) {

            console.error(
                "Mark As Read Error:",
                error
            );

        }

    };

    // ======================================
    // MARK ALL AS READ
    // ======================================

    const markAllAsRead = async () => {

        try {

            await API.put(
                "/notifications/read-all"
            );

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

            setUnreadCount(0);

        } catch (error) {

            console.error(
                "Mark All Read Error:",
                error
            );

        }

    };

    // ======================================
    // TIME FORMAT
    // ======================================

    const formatTime = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleString(
            [],
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );

    };

    return (

        <div className="dropdown">

            {/* ==================================
                NOTIFICATION BUTTON
            ================================== */}

            <button
                type="button"
                className="btn btn-light position-relative"
                onClick={handleToggle}
            >

                <span className="fs-5">
                    🔔
                </span>

                {unreadCount > 0 && (

                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    >
                        {unreadCount}

                        <span className="visually-hidden">
                            unread notifications
                        </span>

                    </span>

                )}

            </button>

            {/* ==================================
                NOTIFICATION DROPDOWN
            ================================== */}

            {showNotifications && (

                <div
                    className="dropdown-menu dropdown-menu-end show p-0 shadow"
                    style={{
                        width: "360px",
                        maxHeight: "450px",
                        overflowY: "auto"
                    }}
                >

                    {/* HEADER */}

                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center">

                        <h6 className="mb-0">
                            Notifications
                        </h6>

                        {unreadCount > 0 && (

                            <button
                                className="btn btn-sm btn-link text-decoration-none"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>

                        )}

                    </div>

                    {/* NOTIFICATIONS */}

                    {notifications.length === 0 ? (

                        <div className="text-center p-4 text-muted">

                            <div className="fs-2 mb-2">
                                🔔
                            </div>

                            <p className="mb-0">
                                No notifications
                            </p>

                        </div>

                    ) : (

                        notifications.map(
                            (notification) => (

                                <button
                                    key={
                                        notification._id
                                    }
                                    type="button"
                                    className={`dropdown-item text-wrap p-3 border-bottom ${
                                        !notification.isRead
                                            ? "bg-light"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        !notification.isRead &&
                                        markAsRead(
                                            notification._id
                                        )
                                    }
                                >

                                    <div className="d-flex">

                                        <div className="me-3">

                                            <span
                                                className={`rounded-circle d-inline-block ${
                                                    notification.isRead
                                                        ? "bg-secondary"
                                                        : "bg-primary"
                                                }`}
                                                style={{
                                                    width:
                                                        "10px",
                                                    height:
                                                        "10px"
                                                }}
                                            ></span>

                                        </div>

                                        <div>

                                            <div
                                                className={`small ${
                                                    !notification.isRead
                                                        ? "fw-bold"
                                                        : ""
                                                }`}
                                            >
                                                {
                                                    notification.message
                                                }
                                            </div>

                                            <div className="text-muted small mt-1">

                                                {formatTime(
                                                    notification.createdAt
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </button>

                            )
                        )

                    )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;