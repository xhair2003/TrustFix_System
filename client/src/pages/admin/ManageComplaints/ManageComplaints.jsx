import React, { useState } from "react";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  // Dữ liệu mẫu cho danh sách khiếu nại
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      request_id: 101,
      complainType: "Dịch vụ",
      complainContent: "Giao hàng trễ, sản phẩm bị hỏng.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Hoàn tiền",
      parentComplain: null,
      request: 100000,
      status: "Đang xử lý",
      date: "2025-03-10",
    },
    {
      id: 2,
      request_id: 102,
      complainType: "Sản phẩm",
      complainContent: "Sản phẩm không đúng mô tả.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Đổi sản phẩm",
      parentComplain: 1,
      request: 50000,
      status: "Đã giải quyết",
      date: "2025-03-12",
    },
    {
      id: 3,
      request_id: 103,
      complainType: "Dịch vụ",
      complainContent: "Hỗ trợ khách hàng chậm trễ.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Hỗ trợ trực tiếp",
      parentComplain: null,
      request: 20000,
      status: "Đang xử lý",
      date: "2025-03-15",
    },
    {
      id: 4,
      request_id: 101,
      complainType: "Dịch vụ",
      complainContent: "Giao hàng trễ, sản phẩm bị hỏng.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Hoàn tiền",
      parentComplain: null,
      request: 100000,
      status: "Đang xử lý",
      date: "2025-03-10",
    },
    {
      id: 5,
      request_id: 101,
      complainType: "Dịch vụ",
      complainContent: "Giao hàng trễ, sản phẩm bị hỏng.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Hoàn tiền",
      parentComplain: null,
      request: 100000,
      status: "Đang xử lý",
      date: "2025-03-10",
    },
    {
      id: 6,
      request_id: 101,
      complainType: "Dịch vụ",
      complainContent: "Giao hàng trễ, sản phẩm bị hỏng.",
      image: "https://thanhnien.mediacdn.vn/uploaded/letan/2017_01_10/_mg_8217_STCW.jpg?width=500",
      requestResolution: "Hoàn tiền",
      parentComplain: null,
      request: 100000,
      status: "Đang xử lý",
      date: "2025-03-10",
    },
  ]);

  // State cho modal và bộ lọc
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hàm mở modal
  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedComplaint(null);
  };

  // Hàm xử lý click trên overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Hàm lọc danh sách khiếu nại
  const filteredComplaints = complaints.filter((complaint) => {
    const complaintDate = new Date(complaint.date);
    const matchesStatus = filterStatus ? complaint.status === filterStatus : true;
    const matchesDate =
      (!startDate || complaintDate >= new Date(startDate)) &&
      (!endDate || complaintDate <= new Date(endDate));
    return matchesStatus && matchesDate;
  });

  // Hàm xử lý hành động "Đánh dấu đã giải quyết"
  const markAsResolved = (id) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === id ? { ...complaint, status: "Đã giải quyết" } : complaint
      )
    );
  };

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">QUẢN LÝ KHIẾU NẠI</h2>

        {/* Bộ lọc */}
        <div className="manage-complaints-filter">
          <div className="manage-complaints-filter-item">
            <label>Lọc theo trạng thái:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã giải quyết">Đã giải quyết</option>
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

        {/* Danh sách khiếu nại */}
        <div className="manage-complaints-list">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="manage-complaints-item"
                onClick={() => openModal(complaint)}
              >
                <div className="manage-complaints-item-content">
                  <h3>Mã khiếu nại: {complaint.request_id}</h3>
                  <p>Loại: {complaint.complainType}</p>
                  <p>Trạng thái: {complaint.status}</p>
                  <p>Ngày: {complaint.date}</p>
                </div>
                <button
                  className="manage-complaints-resolve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsResolved(complaint.id);
                  }}
                  disabled={complaint.status === "Đã giải quyết"}
                >
                  {complaint.status === "Đã giải quyết" ? "Đã giải quyết" : "Đánh dấu đã giải quyết"}
                </button>
              </div>
            ))
          ) : (
            <p className="manage-complaints-no-data">Không có khiếu nại nào phù hợp.</p>
          )}
        </div>
      </div>

      {/* Modal chi tiết */}
      {selectedComplaint && (
        <div className="manage-complaints-modal" onClick={handleOverlayClick}>
          <div className="manage-complaints-modal-content">
            <h2>Chi tiết khiếu nại</h2>
            <p><strong>Mã khiếu nại:</strong> {selectedComplaint.request_id}</p>
            <p><strong>Loại khiếu nại:</strong> {selectedComplaint.complainType}</p>
            <p><strong>Nội dung:</strong> {selectedComplaint.complainContent}</p>
            <p><strong>Yêu cầu giải quyết:</strong> {selectedComplaint.requestResolution}</p>
            <p><strong>Số tiền yêu cầu:</strong> {selectedComplaint.request.toLocaleString()} VNĐ</p>
            <p><strong>Trạng thái:</strong> {selectedComplaint.status}</p>
            <p><strong>Ngày:</strong> {selectedComplaint.date}</p>
            {selectedComplaint.parentComplain && (
              <p><strong>Khiếu nại liên quan:</strong> {selectedComplaint.parentComplain}</p>
            )}
            <div className="manage-complaints-modal-image">
              <img src={selectedComplaint.image} alt="Hình ảnh khiếu nại" />
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