import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useWebSocketNotifications from "../../../utils/hook/useWebSocketNotifications";
import "./NotificationPopup.css";

const NotificationPopup = () => {
    const navigate = useNavigate();
    const { request } = useSelector((state) => state.user);
    const [showPopup, setShowPopup] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [closedRequests, setClosedRequests] = useState(() => {
        const savedClosedRequests = localStorage.getItem("closedRequests");
        return savedClosedRequests ? JSON.parse(savedClosedRequests) : [];
    });

    // Sử dụng custom hook để lắng nghe WebSocket
    useWebSocketNotifications();

    // Lưu closedRequests vào localStorage
    useEffect(() => {
        localStorage.setItem("closedRequests", JSON.stringify(closedRequests));
    }, [closedRequests]);

    // Hiển thị popup khi có đơn mới
    useEffect(() => {
        if (
            request &&
            !notifications.some((n) => n._id === request._id) &&
            !closedRequests.includes(request._id)
        ) {
            setNotifications((prev) => [...prev, request]);
            setShowPopup(true);
        }
    }, [request, notifications, closedRequests]);

    const handleViewDetails = (requestId) => {
        setShowPopup(false);
        navigate(`/repairman/detail-request/${requestId}`, {
            state: { requestData: request },
        });
    };

    const handleClosePopup = (requestId) => {
        setShowPopup(false);
        setClosedRequests((prev) => [...prev, requestId]);
    };

    return (
        <>
            {showPopup && request && (
                <motion.div
                    className="notification-popup"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <h3>Có đơn hàng mới!</h3>
                    <p>Có đơn hàng khách hàng cần sửa chữa!</p>
                    <p><strong>Mô tả:</strong> {request.description}</p>
                    <div className="popup-buttons">
                        <button
                            onClick={() => handleViewDetails(request._id)}
                            className="view-details-button"
                        >
                            Xem chi tiết đơn hàng
                        </button>
                        <button
                            onClick={() => handleClosePopup(request._id)}
                            className="close-button"
                        >
                            Đóng
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default NotificationPopup;