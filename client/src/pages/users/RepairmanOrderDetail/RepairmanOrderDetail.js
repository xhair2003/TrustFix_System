import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../component/Loading/Loading";
import "./RepairmanOrderDetail.css";
import { confirmRequestRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import { getChatHistory, sendMessage, resetErrorMessage } from "../../../store/actions/messageActions";
import socket from "../../../socket";

const RepairmanOrderDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { customerRequest } = location.state || {};
    const { loading, successConfirmRequestRepairman, errorConfirmRequestRepairman } = useSelector(state => state.user);
    const { loading: loadingMessage, error: errorMessage, messages } = useSelector(state => state.message);
    const [isCompleted, setIsCompleted] = useState(
        customerRequest?.status === "Repairman confirmed completion" ||
        customerRequest?.status === "Completed" ||
        localStorage.getItem(`completed_${customerRequest._id}`) === 'true'
    );
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        if (successConfirmRequestRepairman) {
            Swal.fire({
                title: "Thành công",
                text: successConfirmRequestRepairman,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            setIsCompleted(true);
            localStorage.setItem(`completed_${customerRequest._id}`, 'true');
            dispatch(resetSuccess());
        }

        if (errorConfirmRequestRepairman) {
            Swal.fire({
                title: "Lỗi",
                text: errorConfirmRequestRepairman,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            dispatch(resetError());
        }
    }, [successConfirmRequestRepairman, errorConfirmRequestRepairman, dispatch, customerRequest._id]);

    useEffect(() => {
        if (errorMessage) {
            Swal.fire({
                title: "Lỗi",
                text: errorMessage,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetErrorMessage());
        }
    }, [errorMessage, dispatch]);

    useEffect(() => {
        if (!customerRequest?._id) {
            console.warn("No request ID available for WebSocket listening.");
            return;
        }

        const handleReceiveMessage = (message) => {
            if (message.senderId === customerRequest.user_id?._id && message.senderId !== user_id) {
                setHasNewMessage(true);
            }
            dispatch(getChatHistory(customerRequest.user_id?._id, null));
        };

        if (socket.connected) {
            socket.on('receiveMessage', handleReceiveMessage);
        } else {
            console.warn('Socket not connected yet. Waiting...');
            const onConnect = () => {
                socket.on('receiveMessage', handleReceiveMessage);
            };
            socket.on('connect', onConnect);

            return () => {
                if (socket.connected) {
                    socket.off('receiveMessage', handleReceiveMessage);
                }
                socket.off('connect', onConnect);
            };
        }

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [customerRequest, dispatch, user_id]);

    const handleConfirmCompletion = () => {
        dispatch(confirmRequestRepairman());
    };

    const handleBackToRequests = () => {
        navigate("/repairman/view-requests");
    };

    const handleOpenChat = () => {
        setIsChatOpen(true);
        setHasNewMessage(false);
        dispatch(getChatHistory(customerRequest.user_id?._id, null));
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setNewMessage('');
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Tin nhắn không được để trống!',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }
        dispatch(sendMessage(customerRequest.user_id?._id, newMessage, user_id, customerRequest.parentRequest));
        setNewMessage('');
    };

    if (!customerRequest) {
        return <div>Không tìm thấy thông tin đơn hàng hoặc khách hàng.</div>;
    }

    if (loading) {
        return <Loading />;
    }

    const customer = customerRequest.user_id || {};
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || "Khách hàng ẩn danh";

    return (
        <div className="repairman-order-detail-container">
            {isChatOpen && (
                <div className="repairman-order-detail-chat-window">
                    <div className="repairman-order-detail-chat-header">
                        <h3>Chat với khách hàng #{customerRequest.user_id?._id.slice(-6)}</h3>
                        <button onClick={handleCloseChat} className="repairman-order-detail-chat-close-button">✖</button>
                    </div>
                    <div className="repairman-order-detail-chat-messages">
                        {loadingMessage && <p>Đang tải tin nhắn...</p>}
                        {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`repairman-order-detail-chat-message ${msg.senderId === user_id || msg.senderId?.id === user_id ? 'repairman-order-detail-chat-message-self' : 'repairman-order-detail-chat-message-opponent'}`}
                            >
                                <p>
                                    <strong>{msg.senderId === user_id || msg.senderId?.id === user_id ? 'Bạn' : 'Khách hàng'}:</strong> {msg.message}
                                </p>
                                <span className="repairman-order-detail-chat-timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="repairman-order-detail-chat-input-group">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="repairman-order-detail-chat-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="repairman-order-detail-chat-send-button">
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            <div className="repairman-order-detail-notification-banner">
                <p>
                    Khách hàng <strong>{fullName}</strong> đã chốt giá của bạn. Hãy tới địa chỉ{" "}
                    <strong>{customerRequest.address}</strong> để sửa chữa ngay!
                </p>
            </div>

            <div className="repairman-order-detail-order-detail-content">
                <div className="repairman-order-detail-section repairman-order-detail-customer-info">
                    <h2 className="repairman-order-detail-section-title">Thông tin khách hàng</h2>
                    <div className="repairman-order-detail-customer-header">
                        {customer.imgAvt && (
                            <img src={customer.imgAvt} alt={fullName} className="repairman-order-detail-customer-avatar" />
                        )}
                        <div className="repairman-order-detail-customer-details">
                            <h3 className="repairman-order-detail-customer-name">{fullName}</h3>
                            <p className="repairman-order-detail-customer-email">Email: {customer.email || "Không có"}</p>
                            <p className="repairman-order-detail-customer-phone">Số điện thoại: {customer.phone || "Không có"}</p>
                        </div>
                    </div>
                </div>

                <div className="repairman-order-detail-section repairman-order-detail-request-info">
                    <h2 className="repairman-order-detail-section-title">Thông tin đơn hàng</h2>
                    <div className="repairman-order-detail-info-item">
                        <span className="repairman-order-detail-info-label">Mã đơn hàng:</span>
                        <span className="repairman-order-detail-info-value">{customerRequest._id}</span>
                    </div>
                    <div className="repairman-order-detail-info-item">
                        <span className="repairman-order-detail-info-label">Địa chỉ:</span>
                        <span className="repairman-order-detail-info-value">{customerRequest.address}</span>
                    </div>
                    <div className="repairman-order-detail-info-item">
                        <span className="repairman-order-detail-info-label">Mô tả:</span>
                        <span className="repairman-order-detail-info-value">{customerRequest.description || "Không có mô tả"}</span>
                    </div>
                    <div className="repairman-order-detail-info-item">
                        <span className="repairman-order-detail-info-label">Trạng thái:</span>
                        <span className="repairman-order-detail-info-value">
                            {customerRequest.status === "Completed" ? "Đã hoàn thành" :
                                customerRequest.status === "Confirmed" ? "Đã xác nhận" :
                                    customerRequest.status === "Pending" ? "Đang chờ xử lý" :
                                        customerRequest.status === "Cancelled" ? "Đã hủy" :
                                            customerRequest.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                                                customerRequest.status === "Deal price" ? "Thỏa thuận giá" :
                                                    customerRequest.status === "Done deal price" ? "Đã chốt giá" :
                                                        customerRequest.status === "Make payment" ? "Chờ thanh toán" :
                                                            customerRequest.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                                                                customerRequest.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                                                    "Trạng thái không xác định"}
                        </span>
                    </div>
                    <div className="repairman-order-detail-info-item">
                        <span className="repairman-order-detail-info-label">Ngày tạo:</span>
                        <span className="repairman-order-detail-info-value">{new Date(customerRequest.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {customerRequest.image && Array.isArray(customerRequest.image) && customerRequest.image.length > 0 && (
                        <div className="repairman-order-detail-info-item">
                            <span className="repairman-order-detail-info-label">Hình ảnh:</span>
                            <div className="repairman-order-detail-request-images-container">
                                {customerRequest.image.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Request ${index + 1}`}
                                        className="repairman-order-detail-request-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="repairman-order-detail-action-buttons">
                <button className="repairman-order-detail-back-btn" onClick={handleBackToRequests}>
                    Quay lại
                </button>
                {!isCompleted && customerRequest.status !== "Repairman confirmed completion" && customerRequest.status !== "Completed" && (
                    <>
                        <button
                            className={`repairman-order-detail-chat-button ${hasNewMessage ? 'has-new-message' : ''}`}
                            onClick={handleOpenChat}
                        >
                            <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
                        </button>
                        <button
                            className="repairman-order-detail-confirm-btn"
                            onClick={handleConfirmCompletion}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận hoàn tất sửa chữa"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RepairmanOrderDetail;