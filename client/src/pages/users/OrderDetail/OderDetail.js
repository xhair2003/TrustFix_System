// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import RatingModal from "../../../component/users/RatingModal/RatingModal";
// import "./OrderDetail.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchRequestStatus,
//   confirmRequest,
//   resetError,
//   resetSuccess,
// } from "../../../store/actions/userActions";
// import Loading from "../../../component/Loading/Loading";
// import Swal from "sweetalert2";
// import socket from "../../../socket";

// const OrderDetail = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { repairman, request } = location.state || {};

//   const { loading, successConfirmRequest, errorConfirmRequest, requestStatus } = useSelector(
//     (state) => state.user
//   );

//   //console.log("requestStatus", requestStatus);

//   const [isCompleted, setIsCompleted] = useState(false);
//   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
//   const [canConfirm, setCanConfirm] = useState(false);

//   useEffect(() => {
//     if (!request) {
//       console.warn("No request data available.");
//       return;
//     }

//     dispatch(fetchRequestStatus(request.parentRequest));

//     // Lắng nghe sự kiện từ server
//     const handleRepairmanConfirmedCompletion = (data) => {
//       //console.log('Received repairmanConfirmedCompletion event:', data);
//       if (data.requestId === request.parentRequest) {
//         setCanConfirm(true);
//         Swal.fire({
//           title: "Thông báo",
//           icon: "info",
//           text: "Thợ sửa chữa đã xác nhận hoàn thành. Vui lòng xác nhận để hoàn tất.",
//           showConfirmButton: false,
//           timer: 5000,
//           timerProgressBar: true,
//         });
//       }
//       else {
//         console.warn('Received event for wrong requestId:', data.requestId);
//       }
//     };

//     // Đảm bảo socket đã kết nối
//     if (socket.connected) {
//       socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
//     } else {
//       console.warn('Socket not connected yet. Waiting...');
//       const onConnect = () => {
//         socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
//       };
//       socket.on('connect', onConnect);

//       // Cleanup nếu socket kết nối sau khi component unmount
//       return () => {
//         if (socket.connected) {
//           socket.off("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
//         }
//         socket.off('connect', onConnect);
//       };
//     }

//     // Cleanup khi component unmount
//     return () => {
//       socket.off("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
//     };
//   }, [request, dispatch]);

//   // Check initial status 
//   useEffect(() => {
//     console.log("Current requestStatus:", requestStatus);
//     if (requestStatus === 'Repairman confirmed completion') {
//       setCanConfirm(true);
//       Swal.fire({
//         title: "Thông báo",
//         icon: "info",
//         text: "Thợ sửa chữa đã xác nhận hoàn thành. Vui lòng xác nhận để hoàn tất.",
//         showConfirmButton: false,
//         timer: 5000,
//         timerProgressBar: true,
//       });
//     }
//   }, [requestStatus]);

//   // Handle success/error from API
//   useEffect(() => {
//     if (successConfirmRequest) {
//       setIsCompleted(true);
//       setCanConfirm(false);
//       Swal.fire({
//         title: "Thành công",
//         icon: "success",
//         text: successConfirmRequest,
//         showConfirmButton: false,
//         timer: 5000,
//         timerProgressBar: true,
//       }).then(() => {
//         dispatch(resetSuccess());
//         dispatch(fetchRequestStatus(request.parentRequest));
//       });
//     }
//   }, [successConfirmRequest, dispatch, request]);

//   useEffect(() => {
//     if (errorConfirmRequest) {
//       Swal.fire({
//         title: "Lỗi",
//         icon: "error",
//         text: errorConfirmRequest,
//         showConfirmButton: false,
//         timer: 5000,
//         timerProgressBar: true,
//       }).then(() => {
//         dispatch(resetError());
//       });
//     }
//   }, [errorConfirmRequest, dispatch]);

//   const handleComplain = () => {
//     navigate("/complain", { state: { request, repairman } });
//   };

//   const handleConfirmCompletion = () => {
//     // Không cần kiểm tra canConfirm nữa vì nút chỉ hiển thị khi canConfirm = true
//     dispatch(confirmRequest("Completed")).then(() => {
//       dispatch(fetchRequestStatus(request.parentRequest)); // Cập nhật requestStatus
//     });
//   };

//   const handleOpenRatingModal = () => {
//     setIsRatingModalOpen(true);
//   };

//   if (!repairman || !request) {
//     return <div>Không tìm thấy thông tin đơn hàng hoặc thợ sửa chữa.</div>;
//   }

//   if (loading) return <Loading />;

//   return (
//     <div className="order-detail-container">
//       <div className="notification-banner">
//         <p>
//           Thợ <strong>{repairman.fullName}</strong> đã tiếp nhận đầy đủ thông
//           tin của bạn và đơn hàng. Họ sẽ tới địa chỉ{" "}
//           <strong>{request.address}</strong> để sửa nhanh thôi!
//         </p>
//       </div>

//       <div className="order-detail-content">
//         <div className="section order-info">
//           <h2 className="section-title">Thông tin đơn hàng</h2>
//           <div className="info-item">
//             <span className="info-label">Mã đơn hàng:</span>
//             <span className="info-value">{request.requestId}</span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Địa chỉ:</span>
//             <span className="info-value">{request.address}</span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Mô tả:</span>
//             <span className="info-value">{request.descriptions}</span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Trạng thái:</span>
//             <span className="info-value">
//               {
//                 request.status === "Completed" ? "Đã hoàn thành" :
//                   request.status === "Confirmed" ? "Đã xác nhận" :
//                     request.status === "Pending" ? "Đang chờ xử lý" :
//                       request.status === "Cancelled" ? "Đã hủy" :
//                         request.status === "Requesting Details" ? "Yêu cầu chi tiết" :
//                           request.status === "Deal price" ? "Thỏa thuận giá" :
//                             request.status === "Done deal price" ? "Đã chốt giá" :
//                               request.status === "Make payment" ? "Chờ thanh toán" :
//                                 request.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
//                                   request.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
//                                     "Trạng thái không xác định"
//               }
//             </span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Ngày tạo:</span>
//             <span className="info-value">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
//           </div>
//           {request.image && Array.isArray(request.image) && request.image.length > 0 && (
//             <div className="info-item">
//               <span className="info-label">Hình ảnh:</span>
//               <div className="order-images-container">
//                 {request.image.map((imageUrl, index) => (
//                   <img
//                     key={index}
//                     src={imageUrl}
//                     alt={`Order ${index + 1}`}
//                     className="order-image"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="section repairman-info">
//           <h2 className="section-title">Thông tin thợ sửa chữa</h2>
//           <div className="repairman-header">
//             {repairman.profileImage && (
//               <img
//                 src={repairman.profileImage}
//                 alt={repairman.fullName}
//                 className="repairman-avatar"
//               />
//             )}
//             <div className="repairman-details">
//               <h3 className="repairman-name">{repairman.fullName}</h3>
//               <p className="repairman-description">{repairman.description}</p>
//             </div>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Email:</span>
//             <span className="info-value">
//               {repairman.email || "Không có thông tin"}
//             </span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Số điện thoại:</span>
//             <span className="info-value">
//               {repairman.phone || "Không có thông tin"}
//             </span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Số tiền thanh toán:</span>
//             <span className="info-value">
//               {repairman.dealPrice?.toLocaleString("vi-VN") || "Chưa có"} VNĐ
//             </span>
//           </div>
//           <div className="info-item">
//             <span className="info-label">Số đơn đã nhận:</span>
//             <span className="info-value">{repairman.bookingCount || 0}</span>
//           </div>
//           {repairman.certificationImages?.length > 0 && (
//             <div className="info-item">
//               <span className="info-label">Chứng chỉ:</span>
//               <div className="certification-gallery">
//                 {repairman.certificationImages.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Certification ${index + 1}`}
//                     className="certification-image"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {repairman.reviews?.length > 0 && (
//           <div className="section reviews-section">
//             <h2 className="section-title">Đánh giá từ khách hàng</h2>
//             {repairman.reviews.map((review, index) => (
//               <div key={index} className="review-item">
//                 <div className="review-header">
//                   <span className="reviewer-name">{review.reviewerName}</span>
//                   <span className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
//                 </div>
//                 <div className="review-rating">
//                   {[...Array(5)].map((_, i) => (
//                     <span
//                       key={i}
//                       className={`star ${i < review.rating ? "filled" : ""}`}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>
//                 <p className="review-comment">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="action-buttons">
//         <button
//           className="complain-btn"
//           onClick={handleComplain}
//           disabled={loading}
//         >
//           Khiếu nại
//         </button>
//         {isCompleted ? (
//           <button
//             className="rate-btn"
//             onClick={handleOpenRatingModal}
//             disabled={loading}
//           >
//             Đánh giá thợ
//           </button>
//         )
//           : (
//             <button
//               className={canConfirm ? "confirm-button active" : "confirm-button disabled"}
//               onClick={handleConfirmCompletion}
//               disabled={loading || !canConfirm}
//             >
//               Xác nhận thợ đã sửa xong
//             </button>
//           )}
//       </div>

//       <RatingModal
//         isOpen={isRatingModalOpen}
//         onClose={() => setIsRatingModalOpen(false)}
//         repairmanName={repairman.fullName}
//         requestId={request.parentRequest}
//       />
//     </div>
//   );
// };

// export default OrderDetail;


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
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import socket from "../../../socket";

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { repairman, request } = location.state || {};

  const { loading, successConfirmRequest, errorConfirmRequest, requestStatus, errorRequestStatus } = useSelector(
    (state) => state.user
  );

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    if (!request) {
      console.warn("No request data available.");
      return;
    }

    // Fetch trạng thái request khi component mount
    dispatch(fetchRequestStatus(request.parentRequest));

    const handleRepairmanConfirmedCompletion = (data) => {
      if (data.requestId === request.parentRequest) {
        Swal.fire({
          title: "Thông báo",
          icon: "info",
          text: "Thợ sửa chữa đã xác nhận hoàn thành. Vui lòng xác nhận để hoàn tất.",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        dispatch(fetchRequestStatus(request.parentRequest)); // Cập nhật lại requestStatus
      } else {
        console.warn('Received event for wrong requestId:', data.requestId);
      }
    };

    if (socket.connected) {
      socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
    } else {
      console.warn('Socket not connected yet. Waiting...');
      const onConnect = () => {
        socket.on("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
      };
      socket.on('connect', onConnect);
      return () => {
        socket.off('connect', onConnect);
      };
    }

    return () => {
      socket.off("repairmanConfirmedCompletion", handleRepairmanConfirmedCompletion);
    };
  }, [request, dispatch]);

  // Handle success/error from API
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

  // Handle success/error from API
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
        dispatch(fetchRequestStatus(request.parentRequest)); // Cập nhật lại trạng thái
      });
    }
  }, [successConfirmRequest, dispatch, request]);

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

  // useEffect(() => {
  //   console.log("Current requestStatus:", requestStatus);
  //   console.log("request:", request);
  // }, [requestStatus, request]);

  const handleComplain = () => {
    navigate("/complain", { state: { request, repairman } });
  };

  const handleConfirmCompletion = () => {
    dispatch(confirmRequest("Completed")).then(() => {
      dispatch(fetchRequestStatus(request.parentRequest)); // Cập nhật requestStatus
    });
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
      <div className="notification-banner">
        <p>
          Thợ <strong>{repairman.fullName}</strong> đã tiếp nhận đầy đủ thông
          tin của bạn và đơn hàng. Họ sẽ tới địa chỉ{" "}
          <strong>{request.address}</strong> để sửa nhanh thôi!
        </p>
      </div>

      <div className="order-detail-content">
        {/* Các section thông tin giữ nguyên */}
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

        {/* Các section khác giữ nguyên */}
      </div>

      <div className="action-buttons">
        <button
          className="complain-btn"
          onClick={handleComplain}
          disabled={loading}
        >
          Khiếu nại
        </button>
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