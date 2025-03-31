import React, { useState, useEffect } from "react";
import "./ManageUpgradeRepairman.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingUpgradeRequests,
  verifyRepairmanUpgradeRequest,
  resetError,
  resetSuccess
} from "../../../store/actions/adminActions"; // Adjust import to match the location of actions

const ManageUpgradeRepairman = () => {
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const { upgradeRequests, loading, errorUpgradeRequests,
    successVerifyUpgradeRequest, errorVerifyUpgradeRequest } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getPendingUpgradeRequests());
  }, [dispatch]);

  useEffect(() => {
    if (successVerifyUpgradeRequest) {
      dispatch(getPendingUpgradeRequests()); // Re-fetch after successful verify
    }
  }, [successVerifyUpgradeRequest, dispatch]);

  useEffect(() => {
    if (errorUpgradeRequests) {
      Swal.fire({
        title: "Lỗi",
        text: errorUpgradeRequests,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }

    if (errorVerifyUpgradeRequest) {
      Swal.fire({
        title: "Lỗi",
        text: errorVerifyUpgradeRequest,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }

    if (successVerifyUpgradeRequest) {
      Swal.fire({
        title: "Thành công",
        text: successVerifyUpgradeRequest,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetSuccess());
    }

  }, [dispatch, successVerifyUpgradeRequest, errorUpgradeRequests, errorVerifyUpgradeRequest]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setReason(request.rejectReason || "");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setReason("");
  };

  const handleApprove = async (id) => {
    dispatch(verifyRepairmanUpgradeRequest(id, "approve"));
    closeModal();
  };

  const handleReject = async (id) => {
    dispatch(verifyRepairmanUpgradeRequest(id, "reject", reason));
    closeModal();
  };


  // Lọc danh sách theo cả search term và trạng thái
  const filteredRequests = upgradeRequests.filter((request) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const matchesSearch =
      request.user_id.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.user_id.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.user_id.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.user_id.phone.includes(lowerCaseSearchTerm);
    return matchesSearch;
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
        </div>

        {loading ? (
          <p><Loading /></p>
        ) : errorUpgradeRequests ? (
          <p>{errorUpgradeRequests}</p>
        ) : (
          <div className="manage-upgrade-request-list">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="manage-upgrade-request-item"
                onClick={() => openModal(request)}
              >
                <img src={request.user_id.imgAvt} alt="Avatar" className="manage-upgrade-avatar" />
                <div className="manage-upgrade-info">
                  <p><strong>Tên:</strong> {`${request.user_id.firstName} ${request.user_id.lastName}`}</p>
                  <p><strong>Email:</strong> {request.user_id.email}</p>
                  <p><strong>SĐT:</strong> {request.user_id.phone}</p>
                  <p><strong>Địa chỉ:</strong> {request.user_id.address}</p>
                  <p><strong>Loại dịch vụ:</strong> {request.serviceIndustry_id.type}</p>
                </div>
                <div className="manage-upgrade-actions">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(request._id);
                        }}
                        disabled={loading}
                      >
                        Chấp thuận
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
              <p><strong>Tên:</strong> {`${selectedRequest.user_id.firstName} ${selectedRequest.user_id.lastName}`}</p>
              <p><strong>Email:</strong> {selectedRequest.user_id.email}</p>
              <p><strong>SĐT:</strong> {selectedRequest.user_id.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedRequest.user_id.address}</p>
              <p><strong>Loại dịch vụ:</strong> {selectedRequest.serviceIndustry_id.type}</p>
              <div className="manage-upgrade-documents">
                <p><strong>Giấy chứng nhận thực hành:</strong></p>
                {selectedRequest.imgCertificatePractice ? (
                  Array.isArray(selectedRequest.imgCertificatePractice) ? (
                    selectedRequest.imgCertificatePractice.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Certificate ${index + 1}`}
                        className="manage-upgrade-document-img"
                      />
                    ))
                  ) : (
                    <img
                      src={selectedRequest.imgCertificatePractice}
                      alt="Certificate"
                      className="manage-upgrade-document-img"
                    />
                  )
                ) : (
                  <p>Không có ảnh</p>
                )}

                <p><strong>CMND/CCCD:</strong></p>
                {selectedRequest.imgCCCD ? (
                  Array.isArray(selectedRequest.imgCCCD) ? (
                    selectedRequest.imgCCCD.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`CCCD ${index + 1}`}
                        className="manage-upgrade-document-img"
                      />
                    ))
                  ) : (
                    <img
                      src={selectedRequest.imgCCCD}
                      alt="CCCD"
                      className="manage-upgrade-document-img"
                    />
                  )
                ) : (
                  <p>Không có ảnh</p>
                )}
              </div>
              {selectedRequest.status === "pending" && (
                <div className="manage-upgrade-reject-section">
                  <label>Lý do từ chối:</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
                  </button>
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
