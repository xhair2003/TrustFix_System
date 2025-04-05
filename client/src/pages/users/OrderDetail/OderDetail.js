import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingModal from "../../../component/users/RatingModal/RatingModal";
import "./OrderDetail.css";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmRequest,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import socket from "../../../socket";

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { repairman, request } = location.state || {};

  // Redux state
  const { loading, successConfirmRequest, errorConfirmRequest } = useSelector(
    (state) => state.user
  );

  const [isCompleted, setIsCompleted] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    // Lắng nghe sự kiện từ server
    socket.on("repairmanConfirmedCompletion", () => {
      //console.log('Received repairmanConfirmedCompletion event');
      setCanConfirm(true); // Kích hoạt nút xác nhận khi nhận được thông báo
    });

    // Cleanup khi component unmount
    return () => {
      socket.off("repairmanConfirmedCompletion");
    };
  }, []);

  // Check initial status
  useEffect(() => {
    if (request?.status === "Completed") {
      setIsCompleted(true);
    }
  }, [request]);

  // Handle success/error from API with Swal
  useEffect(() => {
    if (successConfirmRequest) {
      setIsCompleted(true);
      Swal.fire({
        title: "Thành công",
        icon: "success",
        text: successConfirmRequest,
        showConfirmButton: false,
        showCloseButton: false,
        timer: 5000,
        timerProgressBar: true,
      }).then(() => {
        dispatch(resetSuccess());
      });
    }
  }, [successConfirmRequest, dispatch]);

  useEffect(() => {
    if (errorConfirmRequest) {
      Swal.fire({
        title: "Lỗi",
        icon: "error",
        text: errorConfirmRequest,
        showConfirmButton: false,
        showCloseButton: false,
        timer: 5000,
        timerProgressBar: true,
      }).then(() => {
        dispatch(resetError());
      });
    }
  }, [errorConfirmRequest, dispatch]);

  const handleComplain = () => {
    navigate("/complain", { state: { request, repairman } });
  };

  const handleConfirmCompletion = () => {
    if (canConfirm) {
      dispatch(confirmRequest("Completed"));
    }
  };

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  if (!repairman || !request) {
    return <div>Không tìm thấy thông tin đơn hàng hoặc thợ sửa chữa.</div>;
  }

  if (loading) return <Loading />;

  return (
    <div className="order-detail-container">
      {/* Notification Message */}
      <div className="notification-banner">
        <p>
          Thợ <strong>{repairman.fullName}</strong> đã tiếp nhận đầy đủ thông
          tin của bạn và đơn hàng. Họ sẽ tới địa chỉ{" "}
          <strong>{request.address}</strong> để sửa nhanh thôi!
        </p>
      </div>

      {/* Order and Repairman Details */}
      <div className="order-detail-content">
        {/* Order Information */}
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
            <span className="info-value">{request.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Ngày tạo:</span>
            <span className="info-value">{request.createdAt}</span>
          </div>
          {request.image &&
            Array.isArray(request.image) &&
            request.image.length > 0 && (
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

        {/* Repairman Information */}
        <div className="section repairman-info">
          <h2 className="section-title">Thông tin thợ sửa chữa</h2>
          <div className="repairman-header">
            {repairman.profileImage && (
              <img
                src={repairman.profileImage}
                alt={repairman.fullName}
                className="repairman-avatar"
              />
            )}
            <div className="repairman-details">
              <h3 className="repairman-name">{repairman.fullName}</h3>
              <p className="repairman-description">{repairman.description}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">
              {repairman.email || "Không có thông tin"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Số điện thoại:</span>
            <span className="info-value">
              {repairman.phone || "Không có thông tin"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Số tiền thanh toán:</span>
            <span className="info-value">
              {repairman.dealPrice.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Số đơn đã nhận:</span>
            <span className="info-value">{repairman.bookingCount}</span>
          </div>
          {repairman.certificationImages.length > 0 && (
            <div className="info-item">
              <span className="info-label">Chứng chỉ:</span>
              <div className="certification-gallery">
                {repairman.certificationImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Certification ${index + 1}`}
                    className="certification-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {repairman.reviews.length > 0 && (
          <div className="section reviews-section">
            <h2 className="section-title">Đánh giá từ khách hàng</h2>
            {repairman.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.reviewerName}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < review.rating ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="complain-btn"
          onClick={handleComplain}
          disabled={loading}
        >
          Khiếu nại
        </button>
        {isCompleted ? (
          <button
            className="rate-btn"
            onClick={handleOpenRatingModal}
            disabled={loading}
          >
            Đánh giá thợ
          </button>
        ) : (
          <button
            //className="confirm-btn"
            className={
              canConfirm ? "confirm-button active" : "confirm-button disabled"
            }
            onClick={handleConfirmCompletion}
            disabled={loading || !canConfirm}
          >
            Xác nhận thợ đã sửa xong
          </button>
        )}
      </div>

      {/* Rating Modal */}
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
