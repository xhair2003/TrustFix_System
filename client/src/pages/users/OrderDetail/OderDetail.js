import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingModal from "../../../component/users/RatingModal/RatingModal";
import "./OrderDetail.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestStatus,
  confirmRequest,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import { getChatHistory, sendMessage, resetErrorMessage } from "../../../store/actions/messageActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import socket from "../../../socket";

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { repairman, request } = location.state || {};

  //console.log("repairman", repairman);

  const { loading, successConfirmRequest, errorConfirmRequest, requestStatus, errorRequestStatus } = useSelector(
    (state) => state.user
  );
  const { loading: loadingMessage, error: errorMessage, messages } = useSelector((state) => state.message);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State cho form chat
  const [newMessage, setNewMessage] = useState(''); // State cho tin nhắn nhập
  const [hasNewMessage, setHasNewMessage] = useState(false); // State cho tin nhắn mới
  const user_id = localStorage.getItem("user_id"); // ID của khách hàng

  useEffect(() => {
    if (!request) {
      console.warn("No request data available.");
      return;
    }

    // Fetch trạng thái request khi component mount
    dispatch(fetchRequestStatus(request.parentRequest));

    const handleRepairmanConfirmedCompletion = (data) => {
      //console.log('Received repairmanConfirmedCompletion:', data);
      if (data.requestId === request.parentRequest) {
        Swal.fire({
          title: "Thông báo",
          icon: "info",
          text: "Thợ sửa chữa đã xác nhận hoàn thành. Vui lòng xác nhận để hoàn tất.",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        dispatch(fetchRequestStatus(data.requestId));
      } else {
        console.warn('Received event for wrong requestId:', data.requestId, 'Expected:', request.parentRequest);
      }
    };

    const handleReceiveMessage = (message) => {
      // Kiểm tra tin nhắn từ thợ và không phải từ khách
      if (message.senderId === repairman.realRepairmanId && message.senderId !== user_id) {
        setHasNewMessage(true);
      }
      dispatch(getChatHistory(repairman.realRepairmanId, null));
    };

    if (socket.connected) {
      //console.log('Socket connected, setting up listeners');
      socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
      socket.on("receiveMessage", handleReceiveMessage);
    } else {
      console.warn('Socket not connected yet. Waiting...');
      const onConnect = () => {
        //console.log('Socket connected, joining room and setting up listeners');
        //socket.emit('joinRoom', user_id);
        socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
        socket.on("receiveMessage", handleReceiveMessage);
      };
      socket.on('connect', onConnect);
      return () => {
        socket.off('connect', onConnect);
      };
    }

    return () => {
      socket.off("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [request, dispatch, repairman, user_id]);

  // Xử lý lỗi request status
  useEffect(() => {
    if (errorRequestStatus) {
      Swal.fire({
        title: "Lỗi",
        icon: "error",
        text: errorRequestStatus,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      }).then(() => {
        dispatch(resetError());
      });
    }
  }, [errorRequestStatus, dispatch]);

  // Xử lý thành công xác nhận
  useEffect(() => {
    if (successConfirmRequest) {
      Swal.fire({
        title: "Thành công",
        icon: "success",
        text: successConfirmRequest,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      }).then(() => {
        dispatch(resetSuccess());
        dispatch(fetchRequestStatus(request.parentRequest));
      });
    }
  }, [successConfirmRequest, dispatch, request]);

  // Xử lý lỗi xác nhận
  useEffect(() => {
    if (errorConfirmRequest) {
      Swal.fire({
        title: "Lỗi",
        icon: "error",
        text: errorConfirmRequest,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      }).then(() => {
        dispatch(resetError());
      });
    }
  }, [errorConfirmRequest, dispatch]);

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

  const handleComplain = () => {
    navigate("/complain", { state: { request, repairman } });
  };

  const handleConfirmCompletion = () => {
    dispatch(confirmRequest("Completed")).then(() => {
      dispatch(fetchRequestStatus(request.parentRequest));
    });
  };

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setHasNewMessage(false); // Xóa chấm đỏ khi mở chat
    dispatch(getChatHistory(repairman.realRepairmanId, null));
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
    dispatch(sendMessage(repairman.realRepairmanId, newMessage, user_id, request.requestId));
    setNewMessage('');
  };

  if (!repairman || !request) {
    return <div>Không tìm thấy thông tin đơn hàng hoặc thợ sửa chữa.</div>;
  }

  if (loading) return <Loading />;

  return (
    <div className="order-detail-container">
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat với thợ #{repairman.repairmanId.slice(-6)}</h3>
            <button onClick={handleCloseChat} className="chat-close-button">✖</button>
          </div>
          <div className="chat-messages">
            {loadingMessage && <p>Đang tải tin nhắn...</p>}
            {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.senderId === user_id || msg.senderId?.id === user_id ? 'chat-message-self' : 'chat-message-opponent'}`}
              >
                <p>
                  <strong>{msg.senderId === user_id || msg.senderId?.id === user_id ? 'Bạn' : 'Thợ'}:</strong> {msg.message}
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
          Thợ <strong>{repairman.fullName}</strong> đã tiếp nhận đầy đủ thông
          tin của bạn và đơn hàng. Họ sẽ tới địa chỉ{" "}
          <strong>{request.address}</strong> để sửa nhanh thôi!
        </p>
      </div>

      <div className="order-detail-content">
        <div className="section customer-info">
          <h2 className="section-title">Thông tin thợ sửa chữa</h2>
          <div className="customer-header">
            {repairman.profileImage && (
              <img src={repairman.profileImage} alt={repairman.fullName} className="customer-avatar" />
            )}
            <div className="customer-details">
              <h3 className="customer-name">{repairman.fullName}</h3>
              <p className="customer-email">Email: {repairman.email || "Không có"}</p>
              <p className="customer-phone">Số điện thoại: {repairman.phone || "Không có"}</p>
            </div>
          </div>
        </div>

        <div className="section order-info">
          <h2 className="section-title">Thông tin đơn hàng</h2>
          <div className="info-item">
            <span className="info-label">Mã đơn hàng:</span>
            <span className="info-value">{request.requestId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Địa chỉ:</span>
            <span className="info-value">{request.address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Mô tả:</span>
            <span className="info-value">{request.descriptions}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trạng thái:</span>
            <span className="info-value">
              {
                requestStatus === "Completed" ? "Đã hoàn thành" :
                  requestStatus === "Confirmed" ? "Đã xác nhận" :
                    requestStatus === "Pending" ? "Đang chờ xử lý" :
                      requestStatus === "Cancelled" ? "Đã hủy" :
                        requestStatus === "Requesting Details" ? "Yêu cầu chi tiết" :
                          requestStatus === "Deal price" ? "Thỏa thuận giá" :
                            requestStatus === "Done deal price" ? "Đã chốt giá" :
                              requestStatus === "Make payment" ? "Chờ thanh toán" :
                                requestStatus === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                                  requestStatus === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                    "Trạng thái không xác định"
              }
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Ngày tạo:</span>
            <span className="info-value">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          {request.image && Array.isArray(request.image) && request.image.length > 0 && (
            <div className="info-item">
              <span className="info-label">Hình ảnh:</span>
              <div className="order-images-container">
                {request.image.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Order ${index + 1}`}
                    className="order-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="complain-btn"
          onClick={handleComplain}
          disabled={loading}
        >
          Khiếu nại
        </button>
        {requestStatus !== "Repairman confirmed completion" && requestStatus !== "Completed" && (
          <button
            className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}
            onClick={handleOpenChat}
            disabled={loading}
          >
            <span role="img" aria-label="chat">💬</span> Nhắn tin với thợ
          </button>
        )}
        {requestStatus === "Completed" ? (
          <button
            className="rate-btn"
            onClick={handleOpenRatingModal}
            disabled={loading}
          >
            Đánh giá thợ
          </button>
        ) : requestStatus === "Repairman confirmed completion" ? (
          <button
            className="confirm-button active"
            onClick={handleConfirmCompletion}
            disabled={loading}
          >
            Xác nhận thợ đã sửa xong
          </button>
        ) : null}
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        repairmanName={repairman.fullName}
        requestId={request.parentRequest}
      />
    </div>
  );
};

export default OrderDetail;