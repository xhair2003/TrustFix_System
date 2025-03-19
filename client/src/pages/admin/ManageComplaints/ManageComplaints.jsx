import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComplaints, replyToComplaint, resetError, resetSuccess } from "../../../store/actions/adminActions"; // Import reply action
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading, errorGetComplaints, successReplyComplaint, errorReplyComplaint } = useSelector((state) => state.admin);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (errorGetComplaints) {
      Swal.fire({
        title: "Lỗi",
        text: errorGetComplaints,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }

    if (errorReplyComplaint) {
      Swal.fire({
        title: "Lỗi",
        text: errorReplyComplaint,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }

    if (successReplyComplaint) {
      Swal.fire({
        title: "Thành công",
        text: successReplyComplaint,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });
      setReplyContent(""); // Reset reply content
      dispatch(resetSuccess());
      dispatch(fetchAllComplaints()); // Re-fetch complaints after reply
    }

    // Fetch complaints when the component mounts
    dispatch(fetchAllComplaints());
  }, [dispatch, errorGetComplaints, successReplyComplaint, errorReplyComplaint]);

  // Handle modal opening
  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Handle modal closing
  const closeModal = () => {
    setSelectedComplaint(null);
    setReplyContent("");
  };

  // Handle overlay click to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle reply content change
  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyContent) {
      Swal.fire("Vui lòng nhập nội dung phản hồi!");
      return;
    }

    dispatch(replyToComplaint(selectedComplaint._id, replyContent)); // Dispatch the reply action
    closeModal(); // Close the modal after submitting
  };

  // Filter complaints based on status and date range
  const filteredComplaints = complaints.filter((complaint) => {
    const complaintDate = new Date(complaint.createdAt);

    // Normalize the comparison date by removing the time portion (set to 00:00:00)
    const normalizedComplaintDate = new Date(complaintDate.getFullYear(), complaintDate.getMonth(), complaintDate.getDate());

    // Normalize the start and end dates
    const normalizedStartDate = startDate ? new Date(startDate) : null;
    const normalizedEndDate = endDate ? new Date(endDate) : null;

    // Set the endDate to 23:59:59 to ensure complaints on the last selected day are included
    if (normalizedEndDate) {
      normalizedEndDate.setHours(23, 59, 59, 999); // Set time to the end of the day
    }

    // Apply the filters
    const matchesStatus = filterStatus ? complaint.status === filterStatus : true;
    const matchesDate =
      (!normalizedStartDate || normalizedComplaintDate >= normalizedStartDate) &&
      (!normalizedEndDate || normalizedComplaintDate <= normalizedEndDate);

    return matchesStatus && matchesDate;
  });


  // Function to format date
  const formatDateTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">QUẢN LÝ KHIẾU NẠI</h2>

        {/* Filter section */}
        <div className="manage-complaints-filter">
          <div className="manage-complaints-filter-item">
            <label>Lọc theo trạng thái:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="pending">Đang chờ phản hồi</option>
              <option value="replied">Đã phản hồi</option>
            </select>
          </div>
          <div className="manage-complaints-filter-item">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="manage-complaints-filter-item">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Complaints list */}
        <div className="manage-complaints-list">
          {loading ? (
            <Loading />
          ) : filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="manage-complaints-item"
                onClick={() => openModal(complaint)}
              >
                <div className="manage-complaints-item-content">
                  <h3>Mã khiếu nại: {complaint._id}</h3>
                  <p>Loại: {complaint.complaintType}</p>
                  <p>Trạng thái: {complaint.status === "pending" ? "Đang chờ phản hồi" : "Đã phản hồi"}</p>
                  <p>Ngày: {formatDateTime(complaint.createdAt)}</p>
                </div>
                <button
                  className="manage-complaints-resolve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle action like marking as resolved
                  }}
                >
                  Đánh dấu đã giải quyết
                </button>
              </div>
            ))
          ) : (
            <p className="manage-complaints-no-data">Không có khiếu nại nào phù hợp.</p>
          )}
        </div>
      </div>

      {/* Modal for complaint details and replying */}
      {selectedComplaint && (
        <div className="manage-complaints-modal" onClick={handleOverlayClick}>
          <div className="manage-complaints-modal-content">
            <h2>Chi tiết khiếu nại</h2>

            {/* Chi tiết khiếu nại */}
            <div className="complaint-detail">
              <p><strong>Mã khiếu nại:</strong> {selectedComplaint._id}</p>
              <p><strong>Loại khiếu nại:</strong> {selectedComplaint.complaintType}</p>
              <p><strong>Nội dung khiếu nại:</strong> {selectedComplaint.complaintContent}</p>
              <p><strong>Yêu cầu giải quyết:</strong> {selectedComplaint.requestResolution}</p>
              {/* <p><strong>Số tiền yêu cầu:</strong> {selectedComplaint.request.toLocaleString()} VNĐ</p> */}
              <p><strong>Trạng thái:</strong> {selectedComplaint.status === "pending" ? "Đang chờ phản hồi" : "Đã phản hồi"}</p>
              <p><strong>Ngày:</strong> {formatDateTime(selectedComplaint.createdAt)}</p>
              {selectedComplaint.parentComplain && (
                <p><strong>Khiếu nại liên quan:</strong> {selectedComplaint.parentComplaint.complaintContent}</p>
              )}
            </div>

            {/* Hình ảnh chứng minh */}
            <div className="complaint-image">
              <h4>Hình ảnh minh chứng:</h4>
              <img src={selectedComplaint.image} alt="Hình ảnh khiếu nại" />
            </div>

            {/* Chi tiết đơn hàng khiếu nại (from request_id) */}
            <div className="order-detail">
              <h3>Thông tin đơn hàng khiếu nại:</h3>
              <p><strong>Mã đơn hàng khiếu nại:</strong> {selectedComplaint.request_id._id}</p>
              <p><strong>Mô tả đơn hàng:</strong> {selectedComplaint.request_id.description}</p>
              <p><strong>Trạng thái đơn hàng:</strong> {selectedComplaint.request_id.status}</p>
              <p><strong>Ngày tạo đơn hàng:</strong> {formatDateTime(selectedComplaint.request_id.createdAt)}</p>
              <p><strong>ID thợ sửa:</strong> {selectedComplaint.request_id.repairman_id}</p>
              <p><strong>Ảnh đơn hàng:</strong>
                <img src={selectedComplaint.request_id.image} alt="Hình ảnh khiếu nại" />
              </p>
            </div>

            {/* Chi tiết người khiếu nại (from request_id.user_id) */}
            <div className="user-detail">
              <h3>Thông tin người khiếu nại:</h3>
              <p><strong>Họ và tên:</strong> {selectedComplaint.request_id.user_id.firstName} {selectedComplaint.request_id.user_id.lastName}</p>
              <p><strong>Email:</strong> {selectedComplaint.request_id.user_id.email}</p>
              <p><strong>Số điện thoại:</strong> {selectedComplaint.request_id.user_id.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedComplaint.request_id.user_id.address}</p>
            </div>

            {/* Reply Section */}
            <div className="reply-section">
              <textarea
                value={replyContent}
                onChange={handleReplyChange}
                placeholder="Nhập phản hồi về khiếu nại..."
                rows="4"
                style={{ width: "100%" }}
              />
              <button
                className="manage-complaints-modal-reply-btn"
                onClick={handleReplySubmit}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Phản hồi"}
              </button>
            </div>

            <button className="manage-complaints-modal-close" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;
