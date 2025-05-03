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
            setIsCompleted(true); // Cập nhật state khi xác nhận thành công
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

    // Xử lý lỗi tin nhắn
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

    // Lắng nghe WebSocket cho tin nhắn mới
    useEffect(() => {
        if (!customerRequest?._id) {
            console.warn("No request ID available for WebSocket listening.");
            return;
        }

        const handleReceiveMessage = (message) => {
            // Kiểm tra tin nhắn từ khách và không phải từ thợ
            if (message.senderId === customerRequest.user_id?._id && message.senderId !== user_id) {
                setHasNewMessage(true);
            }
            // Cập nhật lịch sử chat
            dispatch(getChatHistory(customerRequest.user_id?._id));
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
        dispatch(getChatHistory(customerRequest.user_id?._id));
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
        dispatch(sendMessage(customerRequest.user_id?._id, newMessage, user_id));
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
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Chat với khách hàng #{customerRequest.user_id?._id.slice(-6)}</h3>
                        <button onClick={handleCloseChat} className="chat-close-button">✖</button>
                    </div>
                    <div className="chat-messages">
                        {loadingMessage && <p>Đang tải tin nhắn...</p>}
                        {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.senderId?.id === user_id ? 'chat-message-self' : 'chat-message-opponent'}`}
                            >
                                <p>
                                    <strong>{msg.senderId?.id === user_id ? 'Bạn' : 'Khách hàng'}:</strong> {msg.message}
                                </p>
                                <span className="chat-timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-group">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="chat-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="chat-send-button">
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            <div className="notification-banner">
                <p>
                    Khách hàng <strong>{fullName}</strong> đã chốt giá của bạn. Hãy tới địa chỉ{" "}
                    <strong>{customerRequest.address}</strong> để sửa chữa ngay!
                </p>
            </div>

            <div className="order-detail-content">
                <div className="section customer-info">
                    <h2 className="section-title">Thông tin khách hàng</h2>
                    <div className="customer-header">
                        {customer.imgAvt && (
                            <img src={customer.imgAvt} alt={fullName} className="customer-avatar" />
                        )}
                        <div className="customer-details">
                            <h3 className="customer-name">{fullName}</h3>
                            <p className="customer-email">Email: {customer.email || "Không có"}</p>
                            <p className="customer-phone">Số điện thoại: {customer.phone || "Không có"}</p>
                        </div>
                    </div>
                </div>

                <div className="section request-info">
                    <h2 className="section-title">Thông tin đơn hàng</h2>
                    <div className="info-item">
                        <span className="info-label">Mã đơn hàng:</span>
                        <span className="info-value">{customerRequest._id}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Địa chỉ:</span>
                        <span className="info-value">{customerRequest.address}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mô tả:</span>
                        <span className="info-value">{customerRequest.description || "Không có mô tả"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">
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
                    <div className="info-item">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">{new Date(customerRequest.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {customerRequest.image && Array.isArray(customerRequest.image) && customerRequest.image.length > 0 && (
                        <div className="info-item">
                            <span className="info-label">Hình ảnh:</span>
                            <div className="request-images-container">
                                {customerRequest.image.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Request ${index + 1}`}
                                        className="request-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="action-buttons">
                <button className="back-btn" onClick={handleBackToRequests}>
                    Quay lại
                </button>
                {!isCompleted && customerRequest.status !== "Repairman confirmed completion" && customerRequest.status !== "Completed" && (
                    <>
                        <button
                            className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}
                            onClick={handleOpenChat}
                        >
                            <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
                        </button>
                        <button
                            className="confirm-btn"
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