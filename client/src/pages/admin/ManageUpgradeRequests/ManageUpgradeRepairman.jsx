// ManageUpgradeRepairman.jsx
import React, { useState, useEffect } from "react";
import "./ManageUpgradeRepairman.css";

const ManageUpgradeRepairman = () => {
  const [upgradeRequests, setUpgradeRequests] = useState([
    {
      id: 1,
      userId: 101,
      serviceIndustryId: 1,
      imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      status: 0,
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      rejectReason: "",
      updatedAt: null
    },
    {
      id: 2,
      userId: 102,
      serviceIndustryId: 2,
      imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      status: 1,
      name: "Trần Thị B",
      email: "thib@example.com",
      phone: "0912345678",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
      rejectReason: "",
      updatedAt: "2025-03-14T10:00:00Z"
    },
    {
        id: 3,
        userId: 102,
        serviceIndustryId: 2,
        imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        status: 1,
        name: "Trần Thị B",
        email: "thib@example.com",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        rejectReason: "",
        updatedAt: "2025-03-14T10:00:00Z"
      },
      {
        id: 4,
        userId: 102,
        serviceIndustryId: 2,
        imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        status: 0,
        name: "Trần Thị B",
        email: "thib@example.com",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        rejectReason: "",
        updatedAt: "2025-03-14T10:00:00Z"
      },
      {
        id: 5,
        userId: 102,
        serviceIndustryId: 2,
        imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        status: 0,
        name: "Trần Thị B",
        email: "thib@example.com",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        rejectReason: "",
        updatedAt: "2025-03-14T10:00:00Z"
      },
      {
        id: 6,
        userId: 102,
        serviceIndustryId: 2,
        imgCertificatePractice: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        imgGCCCD: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        status: 0,
        name: "Trần Thị B",
        email: "thib@example.com",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        avatar: "https://cdn.accgroup.vn/wp-content/uploads/2022/01/giay-to-tuy-than-la-gi.jpeg",
        rejectReason: "",
        updatedAt: "2025-03-14T10:00:00Z"
      },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // Thêm state cho bộ lọc trạng thái

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const openModal = (request) => {
    setSelectedRequest(request);
    setReason(request.rejectReason || "");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setReason("");
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      setUpgradeRequests(
        upgradeRequests.map((req) =>
          req.id === id ? { 
            ...req, 
            status: 1, 
            updatedAt: new Date().toISOString() 
          } : req
        )
      );
      closeModal();
      alert("Yêu cầu đã được cấp nhận thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi phê duyệt!");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (reason.trim() === "") {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    try {
      setLoading(true);
      setUpgradeRequests(
        upgradeRequests.map((req) =>
          req.id === id ? { 
            ...req, 
            status: 2, 
            rejectReason: reason,
            updatedAt: new Date().toISOString() 
          } : req
        )
      );
      closeModal();
      alert(`Yêu cầu đã bị từ chối với lý do: ${reason}`);
    } catch (error) {
      alert("Có lỗi xảy ra khi từ chối!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách theo cả search term và trạng thái
  const filteredRequests = upgradeRequests.filter((request) => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "pending" && request.status === 0) ||
      (statusFilter === "approved" && request.status === 1) ||
      (statusFilter === "rejected" && request.status === 2);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">QUẢN LÝ YÊU CẦU NÂNG CẤP</h2>

        <div className="manage-upgrade-search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={loading}
          >
            <option value="pending">Đang chờ xử lý</option>
            <option value="approved">Đã phê duyệt</option>
            <option value="rejected">Đã từ chối</option>
            <option value="all">Tất cả trạng thái</option>
          </select>

        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <div className="manage-upgrade-request-list">
            {filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className="manage-upgrade-request-item" 
                onClick={() => openModal(request)}
              >
                <img src={request.avatar} alt="Avatar" className="manage-upgrade-avatar" />
                <div className="manage-upgrade-info">
                  <p><strong>Tên:</strong> {request.name}</p>
                  <p><strong>Email:</strong> {request.email}</p>
                  <p><strong>SĐT:</strong> {request.phone}</p>
                  <p><strong>Địa chỉ:</strong> {request.address}</p>
                </div>
                <div className="manage-upgrade-actions">
                  {request.status === 0 && (
                    <>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleApprove(request.id); 
                        }}
                        disabled={loading}
                      >
                        Cấp nhận
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          openModal(request); 
                        }}
                        disabled={loading}
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {request.status === 1 && <span className="manage-upgrade-status-approved">Đã phê duyệt</span>}
                  {request.status === 2 && <span className="manage-upgrade-status-rejected">Đã từ chối</span>}
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <p>Không tìm thấy yêu cầu nào phù hợp.</p>
            )}
          </div>
        )}

        {selectedRequest && (
          <div className="manage-upgrade-modal-overlay" onClick={closeModal}>
            <div className="manage-upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="manage-upgrade-close-btn" onClick={closeModal}>Đóng</button>
              <h3>Thông tin chi tiết</h3>
              <p><strong>Tên:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>SĐT:</strong> {selectedRequest.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedRequest.address}</p>
              <div className="manage-upgrade-documents">
                <p><strong>Giấy chứng nhận thực hành:</strong></p>
                <img 
                  src={selectedRequest.imgCertificatePractice} 
                  alt="Certificate" 
                  className="manage-upgrade-document-img" 
                />
                <p><strong>CMND/CCCD:</strong></p>
                <img 
                  src={selectedRequest.imgGCCCD} 
                  alt="GCCCD" 
                  className="manage-upgrade-document-img" 
                />
              </div>
              {selectedRequest.status === 0 && (
                <div className="manage-upgrade-reject-section">
                  <label>Lý do từ chối:</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    disabled={loading}
                  />
                  <button 
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
                  </button>
                </div>
              )}
              {selectedRequest.status === 1 && (
                <p className="manage-upgrade-status-approved">
                  Yêu cầu đã được cấp nhận! 
                  (Cập nhật: {new Date(selectedRequest.updatedAt).toLocaleString()})
                </p>
              )}
              {selectedRequest.status === 2 && (
                <div>
                  <p className="manage-upgrade-status-rejected">
                    Yêu cầu đã bị từ chối! 
                    (Cập nhật: {new Date(selectedRequest.updatedAt).toLocaleString()})
                  </p>
                  <p><strong>Lý do:</strong> {selectedRequest.rejectReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUpgradeRepairman;