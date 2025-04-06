// import React, { useState } from "react";
// import "./RatingModal.css";

// const RatingModal = ({ isOpen, onClose, onSubmit, repairmanName, requestId }) => {
//     const [rating, setRating] = useState(0); // Chỉ giữ một giá trị sao tổng thể
//     const [criteria, setCriteria] = useState([]); // Lưu các tiêu chí được chọn
//     const [comment, setComment] = useState("");

//     // Danh sách tiêu chí tùy chọn
//     const availableCriteria = [
//         "Chất lượng sửa chữa",
//         "Đúng giờ",
//         "Thái độ phục vụ",
//         "Giá cả hợp lý",
//     ];

//     // Xử lý khi người dùng chọn số sao
//     const handleRatingChange = (value) => {
//         setRating(value);
//     };

//     // Xử lý khi người dùng chọn tiêu chí
//     const handleCriteriaChange = (criterion) => {
//         setCriteria((prev) =>
//             prev.includes(criterion)
//                 ? prev.filter((item) => item !== criterion)
//                 : [...prev, criterion]
//         );
//     };

//     // Xử lý gửi đánh giá
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (rating === 0) {
//             alert("Vui lòng chọn số sao để đánh giá!");
//             return;
//         }

//         // Gửi dữ liệu đánh giá
//         onSubmit({ rating, criteria, comment });
//         // Reset form và đóng modal
//         setRating(0);
//         setCriteria([]);
//         setComment("");
//         onClose();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-container">
//                 <div className="modal-header">
//                     <h2 className="modal-title">Đánh giá thợ sửa chữa</h2>
//                     <button className="modal-close-btn" onClick={onClose}>
//                         ×
//                     </button>
//                 </div>

//                 <div className="modal-body">
//                     <p className="modal-subtitle">
//                         Đánh giá thợ: <strong>{repairmanName}</strong>
//                     </p>

//                     {/* Đánh giá sao tổng thể */}
//                     <div className="rating-section">
//                         <label className="rating-label">Đánh giá tổng thể:</label>
//                         <div className="stars">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <span
//                                     key={star}
//                                     className={`star ${rating >= star ? "filled" : ""} `}
//                                     onClick={() => handleRatingChange(star)}
//                                 >
//                                     ★
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Tiêu chí tùy chọn */}
//                     <div className="criteria-section">
//                         <label className="criteria-label">
//                             Chọn các tiêu chí bạn muốn đề cập (sẽ được đưa vào bình luận):
//                         </label>
//                         <div className="criteria-options">
//                             {availableCriteria.map((criterion) => (
//                                 <label key={criterion} className="criteria-option">
//                                     <input
//                                         type="checkbox"
//                                         checked={criteria.includes(criterion)}
//                                         onChange={() => handleCriteriaChange(criterion)}
//                                     />
//                                     <span>{criterion}</span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Input nhận xét chi tiết */}
//                     <div className="comment-section">
//                         <label className="comment-label">Nhận xét chi tiết:</label>
//                         <textarea
//                             value={comment}
//                             onChange={(e) => setComment(e.target.value)}
//                             placeholder="Nhập nhận xét của bạn về thợ sửa chữa..."
//                             className="comment-input"
//                         />
//                     </div>
//                 </div>

//                 <div className="modal-footer">
//                     <button className="submit-btn" onClick={handleSubmit}>
//                         Gửi đánh giá
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RatingModal;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRating,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import Swal from "sweetalert2";
import "./RatingModal.css";
import Loading from "../../Loading/Loading";
import { useNavigate } from "react-router-dom";

const RatingModal = ({ isOpen, onClose, repairmanName, requestId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successRating, errorRating } = useSelector(
    (state) => state.user
  );

  const [rating, setRating] = useState(0); // Chỉ giữ một giá trị sao tổng thể
  const [criteria, setCriteria] = useState([]); // Lưu các tiêu chí được chọn
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách tiêu chí tùy chọn
  const availableCriteria = [
    "Chất lượng sửa chữa",
    "Đúng giờ",
    "Thái độ phục vụ",
    "Giá cả hợp lý",
  ];

  // Handle successRating with Swal
  useEffect(() => {
    if (successRating) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: successRating,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      }).then(() => {
        dispatch(resetSuccess()); // Reset rating state
        onClose(); // Close the modal
        navigate("/view-repair-booking-history");
      });
    }
  }, [successRating, dispatch, onClose, navigate]);

  // Handle errorRating with Swal
  useEffect(() => {
    if (errorRating) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorRating,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      }).then(() => {
        dispatch(resetError()); // Reset rating state
      });
    }
  }, [errorRating, dispatch]);

  // Xử lý khi người dùng chọn số sao
  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Xử lý khi người dùng chọn tiêu chí
  const handleCriteriaChange = (criterion) => {
    setCriteria((prev) =>
      prev.includes(criterion)
        ? prev.filter((item) => item !== criterion)
        : [...prev, criterion]
    );
  };

  // Xử lý gửi đánh giá
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn số sao để đánh giá!",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      });
      return;
    }

    if (!comment || comment.trim().length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng nhập bình luận!",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine criteria into the comment
      const finalComment =
        criteria.length > 0 ? `${criteria.join(", ")}. ${comment}` : comment;

      // Dispatch the addRating action
      await dispatch(addRating(requestId, rating, finalComment));

      // Reset form (already handled in useEffect after success)
      setRating(0);
      setCriteria([]);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Đánh giá thợ sửa chữa</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting || loading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Đánh giá thợ: <strong>{repairmanName}</strong>
          </p>

          {/* Đánh giá sao tổng thể */}
          <div className="rating-section">
            <label className="rating-label">Đánh giá tổng thể:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "filled" : ""}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Tiêu chí tùy chọn */}
          <div className="criteria-section">
            <label className="criteria-label">
              Chọn các tiêu chí bạn muốn đề cập (sẽ được đưa vào bình luận):
            </label>
            <div className="criteria-options">
              {availableCriteria.map((criterion) => (
                <label key={criterion} className="criteria-option">
                  <input
                    type="checkbox"
                    checked={criteria.includes(criterion)}
                    onChange={() => handleCriteriaChange(criterion)}
                    disabled={isSubmitting || loading}
                  />
                  <span>{criterion}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Input nhận xét chi tiết */}
          <div className="comment-section">
            <label className="comment-label">Nhận xét chi tiết:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập nhận xét của bạn về thợ sửa chữa..."
              className="comment-input"
              disabled={isSubmitting || loading}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
