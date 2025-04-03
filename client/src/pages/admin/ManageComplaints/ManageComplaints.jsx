// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllComplaints, replyToComplaint, resetError, resetSuccess } from "../../../store/actions/adminActions"; // Import reply action
// import Loading from "../../../component/Loading/Loading";
// import Swal from "sweetalert2";
// import "./ManageComplaints.css";

// const ManageComplaints = () => {
//   const dispatch = useDispatch();
//   const { complaints, loading, errorGetComplaints, successReplyComplaint, errorReplyComplaint } = useSelector((state) => state.admin);

//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [replyContent, setReplyContent] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     if (errorGetComplaints) {
//       Swal.fire({
//         title: "Lỗi",
//         text: errorGetComplaints,
//         icon: "error",
//         timer: 5000,
//         showConfirmButton: false,
//       });
//       dispatch(resetError());
//     }

//     if (errorReplyComplaint) {
//       Swal.fire({
//         title: "Lỗi",
//         text: errorReplyComplaint,
//         icon: "error",
//         timer: 5000,
//         showConfirmButton: false,
//       });
//       dispatch(resetError());
//     }

//     if (successReplyComplaint) {
//       Swal.fire({
//         title: "Thành công",
//         text: successReplyComplaint,
//         icon: "success",
//         timer: 5000,
//         showConfirmButton: false,
//       });
//       setReplyContent(""); // Reset reply content
//       dispatch(resetSuccess());
//       dispatch(fetchAllComplaints()); // Re-fetch complaints after reply
//     }

//     // Fetch complaints when the component mounts
//     dispatch(fetchAllComplaints());
//   }, [dispatch, errorGetComplaints, successReplyComplaint, errorReplyComplaint]);

//   // Handle modal opening
//   const openModal = (complaint) => {
//     setSelectedComplaint(complaint);
//   };

//   // Handle modal closing
//   const closeModal = () => {
//     setSelectedComplaint(null);
//     setReplyContent("");
//   };

//   // Handle overlay click to close modal
//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeModal();
//     }
//   };

//   // Handle reply content change
//   const handleReplyChange = (e) => {
//     setReplyContent(e.target.value);
//   };

//   // Handle reply submission
//   const handleReplySubmit = () => {
//     if (!replyContent) {
//       Swal.fire("Vui lòng nhập nội dung phản hồi!");
//       return;
//     }

//     dispatch(replyToComplaint(selectedComplaint._id, replyContent)); // Dispatch the reply action
//     closeModal(); // Close the modal after submitting
//   };

//   // Filter complaints based on status and date range
//   const filteredComplaints = complaints.filter((complaint) => {
//     const complaintDate = new Date(complaint.createdAt);

//     // Normalize the comparison date by removing the time portion (set to 00:00:00)
//     const normalizedComplaintDate = new Date(complaintDate.getFullYear(), complaintDate.getMonth(), complaintDate.getDate());

//     // Normalize the start and end dates
//     const normalizedStartDate = startDate ? new Date(startDate) : null;
//     const normalizedEndDate = endDate ? new Date(endDate) : null;

//     // Set the endDate to 23:59:59 to ensure complaints on the last selected day are included
//     if (normalizedEndDate) {
//       normalizedEndDate.setHours(23, 59, 59, 999); // Set time to the end of the day
//     }

//     // Apply the filters
//     const matchesStatus = filterStatus ? complaint.status === filterStatus : true;
//     const matchesDate =
//       (!normalizedStartDate || normalizedComplaintDate >= normalizedStartDate) &&
//       (!normalizedEndDate || normalizedComplaintDate <= normalizedEndDate);

//     return matchesStatus && matchesDate;
//   });


//   // Function to format date
//   const formatDateTime = (date) => {
//     const d = new Date(date);
//     const hours = d.getHours().toString().padStart(2, '0');
//     const minutes = d.getMinutes().toString().padStart(2, '0');
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear();
//     return `${hours}:${minutes} ${day}/${month}/${year}`;
//   };

//   return (
//     <div className="history-container">
//       <div className="history-form">
//         <h2 className="complaint-title">QUẢN LÝ KHIẾU NẠI</h2>

//         {/* Filter section */}
//         <div className="manage-complaints-filter">
//           <div className="manage-complaints-filter-item">
//             <label>Lọc theo trạng thái:</label>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               <option value="pending">Đang chờ phản hồi</option>
//               <option value="replied">Đã phản hồi</option>
//             </select>
//           </div>
//           <div className="manage-complaints-filter-item">
//             <label>Từ ngày:</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>
//           <div className="manage-complaints-filter-item">
//             <label>Đến ngày:</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Complaints list */}
//         <div className="manage-complaints-list">
//           {loading ? (
//             <Loading />
//           ) : filteredComplaints.length > 0 ? (
//             filteredComplaints.map((complaint) => (
//               <div
//                 key={complaint._id}
//                 className="manage-complaints-item"
//                 onClick={() => openModal(complaint)}
//               >
//                 <div className="manage-complaints-item-content">
//                   <h3>Mã khiếu nại: {complaint._id}</h3>
//                   <p>Loại khiếu nại: {complaint.complaintType}</p>
//                   <p>Trạng thái: {complaint.status === "pending" ? "Đang chờ phản hồi" : "Đã phản hồi"}</p>
//                   <p>Ngày: {formatDateTime(complaint.createdAt)}</p>
//                 </div>
//                 <button
//                   className="manage-complaints-resolve-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Handle action like marking as resolved
//                   }}
//                 >
//                   Đánh dấu đã giải quyết
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="manage-complaints-no-data">Không có khiếu nại nào phù hợp.</p>
//           )}
//         </div>
//       </div>

//       {/* Modal for complaint details and replying */}
//       {selectedComplaint && (
//         <div className="manage-complaints-modal" onClick={handleOverlayClick}>
//           <div className="manage-complaints-modal-content">
//             <h2>Chi tiết khiếu nại</h2>

//             {/* Chi tiết khiếu nại */}
//             <div className="complaint-detail">
//               <p><strong>Mã khiếu nại:</strong> {selectedComplaint._id || "Không có dữ liệu"}</p>
//               <p><strong>Loại khiếu nại:</strong> {selectedComplaint.complaintType || "Không xác định"}</p>
//               <p><strong>Nội dung khiếu nại:</strong> {selectedComplaint.complaintContent || "Không có nội dung"}</p>
//               <p><strong>Yêu cầu giải quyết:</strong> {selectedComplaint.requestResolution || "Không có yêu cầu"}</p>
//               <p><strong>Trạng thái:</strong> {selectedComplaint.status === "pending" ? "Đang chờ phản hồi" : selectedComplaint.status === "resolved" ? "Đã phản hồi" : "Không xác định"}</p>
//               <p><strong>Ngày:</strong> {selectedComplaint.createdAt ? formatDateTime(selectedComplaint.createdAt) : "Không có ngày"}</p>
//               {selectedComplaint.parentComplain && selectedComplaint.parentComplain.complaintContent ? (
//                 <p><strong>Khiếu nại liên quan:</strong> {selectedComplaint.parentComplain.complaintContent}</p>
//               ) : (
//                 <p><strong>Khiếu nại liên quan:</strong> Không có</p>
//               )}
//             </div>

//             {/* Hình ảnh chứng minh */}
//             <div className="complaint-image">
//               <h4>Hình ảnh minh chứng:</h4>
//               {selectedComplaint.image && Array.isArray(selectedComplaint.image) && selectedComplaint.image.length > 0 ? (
//                 selectedComplaint.image.map((img, index) => (
//                   <img key={index} src={img} alt={`Hình ảnh khiếu nại ${index + 1}`} style={{ maxWidth: "200px", margin: "5px" }} />
//                 ))
//               ) : selectedComplaint.image && typeof selectedComplaint.image === "string" ? (
//                 <img src={selectedComplaint.image} alt="Hình ảnh khiếu nại" style={{ maxWidth: "200px" }} />
//               ) : (
//                 <p>Không có hình ảnh</p>
//               )}
//             </div>

//             {/* Chi tiết đơn hàng khiếu nại (from request_id) */}
//             <div className="order-detail">
//               <h3>Thông tin đơn hàng khiếu nại:</h3>
//               {selectedComplaint.request_id ? (
//                 <>
//                   <p><strong>Mã đơn hàng khiếu nại:</strong> {selectedComplaint.request_id._id || "Không có mã"}</p>
//                   <p><strong>Mô tả đơn hàng:</strong> {selectedComplaint.request_id.description || "Không có mô tả"}</p>
//                   <p><strong>Trạng thái đơn hàng:</strong> {selectedComplaint.request_id.status || "Không xác định"}</p>
//                   <p><strong>Ngày tạo đơn hàng:</strong> {selectedComplaint.request_id.createdAt ? formatDateTime(selectedComplaint.request_id.createdAt) : "Không có ngày"}</p>
//                   <p><strong>ID thợ sửa:</strong> {selectedComplaint.request_id.repairman_id || "Không có thông tin"}</p>
//                   <p><strong>Ảnh đơn hàng:</strong>
//                     {selectedComplaint.request_id.image && Array.isArray(selectedComplaint.request_id.image) && selectedComplaint.request_id.image.length > 0 ? (
//                       selectedComplaint.request_id.image.map((img, index) => (
//                         <img key={index} src={img} alt={`Hình ảnh đơn hàng ${index + 1}`} style={{ maxWidth: "200px", margin: "5px" }} />
//                       ))
//                     ) : selectedComplaint.request_id.image && typeof selectedComplaint.request_id.image === "string" ? (
//                       <img src={selectedComplaint.request_id.image} alt="Hình ảnh đơn hàng" style={{ maxWidth: "200px" }} />
//                     ) : (
//                       "Không có hình ảnh"
//                     )}
//                   </p>
//                 </>
//               ) : (
//                 <p>Không có thông tin đơn hàng</p>
//               )}
//             </div>

//             {/* Chi tiết người khiếu nại (from request_id.user_id) */}
//             <div className="user-detail">
//               <h3>Thông tin người khiếu nại:</h3>
//               {selectedComplaint.request_id && selectedComplaint.request_id.user_id ? (
//                 <>
//                   <p><strong>Họ và tên:</strong> {selectedComplaint.request_id.user_id.firstName && selectedComplaint.request_id.user_id.lastName
//                     ? `${selectedComplaint.request_id.user_id.firstName} ${selectedComplaint.request_id.user_id.lastName}`
//                     : "Không có tên"}</p>
//                   <p><strong>Email:</strong> {selectedComplaint.request_id.user_id.email || "Không có email"}</p>
//                   <p><strong>Số điện thoại:</strong> {selectedComplaint.request_id.user_id.phone || "Không có số điện thoại"}</p>
//                   <p><strong>Địa chỉ:</strong> {selectedComplaint.request_id.user_id.address || "Không có địa chỉ"}</p>
//                 </>
//               ) : (
//                 <p>Không có thông tin người khiếu nại</p>
//               )}
//             </div>

//             {/* Reply Section */}
//             <div className="reply-section">
//               <textarea
//                 value={replyContent}
//                 onChange={handleReplyChange}
//                 placeholder="Nhập phản hồi về khiếu nại..."
//                 rows="4"
//                 style={{ width: "100%" }}
//               />
//               <button
//                 className="manage-complaints-modal-reply-btn"
//                 onClick={handleReplySubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Đang xử lý..." : "Phản hồi"}
//               </button>
//             </div>

//             <button className="manage-complaints-modal-close" onClick={closeModal}>
//               Đóng
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageComplaints;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComplaints, replyToComplaint, resetError, resetSuccess } from "../../../store/actions/adminActions";
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
      setReplyContent("");
      dispatch(resetSuccess());
      dispatch(fetchAllComplaints());
    }

    dispatch(fetchAllComplaints());
  }, [dispatch, errorGetComplaints, successReplyComplaint, errorReplyComplaint]);

  const openModal = (complaint) => setSelectedComplaint(complaint);
  const closeModal = () => {
    setSelectedComplaint(null);
    setReplyContent("");
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };
  const handleReplyChange = (e) => setReplyContent(e.target.value);
  const handleReplySubmit = () => {
    if (!replyContent) {
      Swal.fire("Vui lòng nhập nội dung phản hồi!");
      return;
    }
    dispatch(replyToComplaint(selectedComplaint._id, replyContent));
    closeModal();
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const complaintDate = new Date(complaint.createdAt);
    const normalizedComplaintDate = new Date(complaintDate.getFullYear(), complaintDate.getMonth(), complaintDate.getDate());
    const normalizedStartDate = startDate ? new Date(startDate) : null;
    const normalizedEndDate = endDate ? new Date(endDate) : null;
    if (normalizedEndDate) normalizedEndDate.setHours(23, 59, 59, 999);

    const matchesStatus = filterStatus ? complaint.status === filterStatus : true;
    const matchesDate =
      (!normalizedStartDate || normalizedComplaintDate >= normalizedStartDate) &&
      (!normalizedEndDate || normalizedComplaintDate <= normalizedEndDate);

    return matchesStatus && matchesDate;
  });

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

        <div className="manage-complaints-filter">
          <div className="manage-complaints-filter-item">
            <label>Lọc theo trạng thái:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="pending">Đang chờ phản hồi</option>
              <option value="replied">Đã phản hồi</option>
            </select>
          </div>
          <div className="manage-complaints-filter-item">
            <label>Từ ngày:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="manage-complaints-filter-item">
            <label>Đến ngày:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="manage-complaints-list">
          {loading ? (
            <Loading />
          ) : filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="manage-complaints-item" onClick={() => openModal(complaint)}>
                <div className="manage-complaints-item-content">
                  <h3>Mã khiếu nại: {complaint._id}</h3>
                  <p>Loại khiếu nại: {complaint.complaintType}</p>
                  <p>Ngày: {formatDateTime(complaint.createdAt)}</p>
                </div>
                <span
                  className={`complaint-status ${complaint.status === "pending" ? "status-pending" : "status-replied"
                    }`}
                >
                  {complaint.status === "pending" ? "Đang chờ phản hồi" : "Đã phản hồi"}
                </span>
              </div>
            ))
          ) : (
            <p className="manage-complaints-no-data">Không có khiếu nại nào phù hợp.</p>
          )}
        </div>
      </div>

      {selectedComplaint && (
        <div className="manage-complaints-modal" onClick={handleOverlayClick}>
          <div className="manage-complaints-modal-content">
            <h2>Chi tiết khiếu nại</h2>
            <div className="complaint-detail">
              <p><strong>Mã khiếu nại:</strong> {selectedComplaint._id || "Không có dữ liệu"}</p>
              <p><strong>Loại khiếu nại:</strong> {selectedComplaint.complaintType || "Không xác định"}</p>
              <p><strong>Nội dung khiếu nại:</strong> {selectedComplaint.complaintContent || "Không có nội dung"}</p>
              <p><strong>Yêu cầu giải quyết:</strong> {selectedComplaint.requestResolution || "Không có yêu cầu"}</p>
              <p><strong>Trạng thái:</strong> {selectedComplaint.status === "pending" ? "Đang chờ phản hồi" : selectedComplaint.status === "resolved" ? "Đã phản hồi" : "Không xác định"}</p>
              <p><strong>Ngày:</strong> {selectedComplaint.createdAt ? formatDateTime(selectedComplaint.createdAt) : "Không có ngày"}</p>
              {selectedComplaint.parentComplain && selectedComplaint.parentComplain.complaintContent ? (
                <p><strong>Khiếu nại liên quan:</strong> {selectedComplaint.parentComplain.complaintContent}</p>
              ) : (
                <p><strong>Khiếu nại liên quan:</strong> Không có</p>
              )}
            </div>

            <div className="complaint-image">
              <h4>Hình ảnh minh chứng:</h4>
              {selectedComplaint.image && Array.isArray(selectedComplaint.image) && selectedComplaint.image.length > 0 ? (
                selectedComplaint.image.map((img, index) => (
                  <img key={index} src={img} alt={`Hình ảnh khiếu nại ${index + 1}`} style={{ maxWidth: "200px", margin: "5px" }} />
                ))
              ) : selectedComplaint.image && typeof selectedComplaint.image === "string" ? (
                <img src={selectedComplaint.image} alt="Hình ảnh khiếu nại" style={{ maxWidth: "200px" }} />
              ) : (
                <p>Không có hình ảnh</p>
              )}
            </div>

            <div className="order-detail">
              <h3>Thông tin đơn hàng khiếu nại:</h3>
              {selectedComplaint.request_id ? (
                <>
                  <p><strong>Mã đơn hàng khiếu nại:</strong> {selectedComplaint.request_id._id || "Không có mã"}</p>
                  <p><strong>Mô tả đơn hàng:</strong> {selectedComplaint.request_id.description || "Không có mô tả"}</p>
                  <p><strong>Trạng thái đơn hàng:</strong> {selectedComplaint.request_id.status || "Không xác định"}</p>
                  <p><strong>Ngày tạo đơn hàng:</strong> {selectedComplaint.request_id.createdAt ? formatDateTime(selectedComplaint.request_id.createdAt) : "Không có ngày"}</p>
                  <p><strong>ID thợ sửa:</strong> {selectedComplaint.request_id.repairman_id || "Không có thông tin"}</p>
                  <p><strong>Ảnh đơn hàng:</strong>
                    {selectedComplaint.request_id.image && Array.isArray(selectedComplaint.request_id.image) && selectedComplaint.request_id.image.length > 0 ? (
                      selectedComplaint.request_id.image.map((img, index) => (
                        <img key={index} src={img} alt={`Hình ảnh đơn hàng ${index + 1}`} style={{ maxWidth: "200px", margin: "5px" }} />
                      ))
                    ) : selectedComplaint.request_id.image && typeof selectedComplaint.request_id.image === "string" ? (
                      <img src={selectedComplaint.request_id.image} alt="Hình ảnh đơn hàng" style={{ maxWidth: "200px" }} />
                    ) : (
                      "Không có hình ảnh"
                    )}
                  </p>
                </>
              ) : (
                <p>Không có thông tin đơn hàng</p>
              )}
            </div>

            <div className="user-detail">
              <h3>Thông tin người khiếu nại:</h3>
              {selectedComplaint.request_id && selectedComplaint.request_id.user_id ? (
                <>
                  <p><strong>Họ và tên:</strong> {selectedComplaint.request_id.user_id.firstName && selectedComplaint.request_id.user_id.lastName
                    ? `${selectedComplaint.request_id.user_id.firstName} ${selectedComplaint.request_id.user_id.lastName}`
                    : "Không có tên"}</p>
                  <p><strong>Email:</strong> {selectedComplaint.request_id.user_id.email || "Không có email"}</p>
                  <p><strong>Số điện thoại:</strong> {selectedComplaint.request_id.user_id.phone || "Không có số điện thoại"}</p>
                  <p><strong>Địa chỉ:</strong> {selectedComplaint.request_id.user_id.address || "Không có địa chỉ"}</p>
                </>
              ) : (
                <p>Không có thông tin người khiếu nại</p>
              )}
            </div>

            <div className="reply-section">
              <textarea
                value={replyContent}
                onChange={handleReplyChange}
                placeholder="Nhập phản hồi về khiếu nại..."
                rows="4"
                style={{ width: "100%" }}
              />
              <button className="manage-complaints-modal-reply-btn" onClick={handleReplySubmit} disabled={loading}>
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