import React, { useState } from "react";
import "./ManagePracticeSertificates.css";
import Loading from "../../../component/Loading/Loading"; // Giả định có component Loading
import Swal from "sweetalert2";

// Dữ liệu giả
const dummyCertificates = [
  {
    _id: "1",
    user_id: {
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      address: "123 Đường Láng, Hà Nội",
      imgAvt: "https://scontent.fvii2-1.fna.fbcdn.net/v/t39.30808-6/482226649_1108014394344191_5021850687854468059_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGfaHJ8I0xHD5ODTSst4kuc0bL_sa6w5YfRsv-xrrDlh8gVS2NswtGAvDemFk9Yuvh0byUpC4wrw7cPujc_3NWc&_nc_ohc=mV1aCRdTpkwQ7kNvgFVO1om&_nc_oc=AdkAJPilQ9OekwY76EHznA9yCnw5ekFWgGZxqAF8KdwkOuKfGgbEwBIHyrQC4fTsRAY&_nc_zt=23&_nc_ht=scontent.fvii2-1.fna&_nc_gid=E2m7KJo0LRu-oKNRf820bA&oh=00_AYE3HsibGxBdnyNd-o-edU2f1RwN63scvWyTb0Zij8ZVSg&oe=67E74610",
    },
    imgCertificatePractice: "https://scontent.fvii2-1.fna.fbcdn.net/v/t39.30808-6/486339935_1119386626540301_973104953897190770_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF0itAhi1diJ5WpKtRXJr8b2zxb4Vr711rbPFvhWvvXWsI2AemlTEY6xwJFxp2zdu8pU2rCrry1xF5O5n04lrIw&_nc_ohc=94dokhxv8-EQ7kNvgElkrLS&_nc_oc=AdkanNO6pRn0bZH-IeA29UEqc9gq3vZGiyZihaKscJMS7oM2EVZGDQMohHP2zRIhzLo&_nc_zt=23&_nc_ht=scontent.fvii2-1.fna&_nc_gid=oru8OXU5KodwwN0b40-bFQ&oh=00_AYHS1b6YHyqVsnX0skYVM0QGC9F2TVOhicUMMFXpx4Vm8Q&oe=67E73419",
    status: "pending",
  },
  {
    _id: "2",
    user_id: {
      firstName: "Trần",
      lastName: "Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      address: "456 Lê Lợi, TP.HCM",
      imgAvt: "https://scontent.fvii2-1.fna.fbcdn.net/v/t39.30808-6/475384245_1082788706866760_8517113670033276482_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEG_V7sq51qEV8Q5CWIEEdyeHqQyUWhn_V4epDJRaGf9Zoun683YjHQ0wzWiEYe2zsO9OI6rZoSpV7moPKd5qQW&_nc_ohc=ne9uzaCUvpwQ7kNvgGGERAf&_nc_oc=AdnK0koKuUZZF6gUiAStSww6EEFekatSYy-VdBN-30F5VOJs1Xpzgj5CJa67yEgutoE&_nc_zt=23&_nc_ht=scontent.fvii2-1.fna&_nc_gid=uOzgoiDjiiGbVD1JSzQnWA&oh=00_AYEl1z3gHEdNyGcbb6uBzsL7hr9P47jeqt6FNe1SJnK8mg&oe=67E752C2",
    },
    imgCertificatePractice: "https://scontent.fvii2-4.fna.fbcdn.net/v/t39.30808-6/485987129_1119109353234695_2758454027113417654_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGp6TsOtGj5jGx5MbkzTQ6y6RT-IbbF-enpFP4htsX56ZDyIOs5NFhcUJuT4GQkj-GfYceyJB8pifMFUuBAdH-f&_nc_ohc=he-M-B3Lnb0Q7kNvgFfTVkm&_nc_oc=Adn1hmJX2zAy1a9K4jiPSvuGX79zuQUZmkndgo2yORWMhdXfmDeoOGW8br0HTIiuTfs&_nc_zt=23&_nc_ht=scontent.fvii2-4.fna&_nc_gid=4crKY7IuwvXJwQ3pfqKatw&oh=00_AYEjidTs12xFegkUNOIoLE7X7wlFoxeEOXROXQId0YRzlw&oe=67E7309F",
    status: "approved",
  },
  {
    _id: "3",
    user_id: {
      firstName: "Lê",
      lastName: "Văn C",
      email: "levanc@example.com",
      phone: "0923456789",
      address: "789 Nguyễn Huệ, Đà Nẵng",
      imgAvt: "https://scontent.fvii2-4.fna.fbcdn.net/v/t39.30808-6/486768561_1119386629873634_1219222130034265279_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGz4r3zQ34Bd2YKxGz8Ibw75U_uST5YQ97lT-5JPlhD3v4smjk8lmB51NBoVWSq2Q_llkFYmxKXoexarn75m5zs&_nc_ohc=5BZxAaSxuZwQ7kNvgFrFMzC&_nc_oc=Adn2kcv9QLU9YT3KxuQ3p9VhvgR3mX6GHVBTxmYYW_jxBXVUvyUp2lLJ8etOlVj-WBc&_nc_zt=23&_nc_ht=scontent.fvii2-4.fna&_nc_gid=Nf0bnDOom4j4ASCyCQtdiQ&oh=00_AYEZ9Zhi6fZEOqonnts3np5A6DaJDz0vFCPKltKB69X7ag&oe=67E72333",
    },
    imgCertificatePractice: "https://scontent.fvii2-4.fna.fbcdn.net/v/t39.30808-6/486768561_1119386629873634_1219222130034265279_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGz4r3zQ34Bd2YKxGz8Ibw75U_uST5YQ97lT-5JPlhD3v4smjk8lmB51NBoVWSq2Q_llkFYmxKXoexarn75m5zs&_nc_ohc=5BZxAaSxuZwQ7kNvgFrFMzC&_nc_oc=Adn2kcv9QLU9YT3KxuQ3p9VhvgR3mX6GHVBTxmYYW_jxBXVUvyUp2lLJ8etOlVj-WBc&_nc_zt=23&_nc_ht=scontent.fvii2-4.fna&_nc_gid=Nf0bnDOom4j4ASCyCQtdiQ&oh=00_AYEZ9Zhi6fZEOqonnts3np5A6DaJDz0vFCPKltKB69X7ag&oe=67E72333",
    imgCCCD: "https://via.placeholder.com/300x200?text=CMND/CCCD",
    status: "rejected",
    rejectReason: "Thiếu giấy tờ hợp lệ",
  },
];

const ManagePracticeCertificates = () => {
  const [certificates, setCertificates] = useState(dummyCertificates); // Dữ liệu giả
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false); // Giả lập trạng thái loading

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setReason(certificate.rejectReason || "");
  };

  const closeModal = () => {
    setSelectedCertificate(null);
    setReason("");
  };

  const handleApprove = async (id) => {
    setLoading(true);
    setTimeout(() => {
      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === id ? { ...cert, status: "approved" } : cert
        )
      );
      setLoading(false);
      Swal.fire({
        title: "Thành công",
        text: "Đã chấp thuận chứng chỉ!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      closeModal();
    }, 1000); // Giả lập delay 1 giây
  };

  const handleReject = async (id) => {
    if (!reason.trim()) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập lý do từ chối!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === id ? { ...cert, status: "rejected", rejectReason: reason } : cert
        )
      );
      setLoading(false);
      Swal.fire({
        title: "Thành công",
        text: "Đã từ chối chứng chỉ!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      closeModal();
    }, 1000); // Giả lập delay 1 giây
  };

  // Lọc danh sách theo từ khóa tìm kiếm và trạng thái
  const filteredCertificates = certificates.filter((certificate) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      certificate.user_id.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      certificate.user_id.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
      certificate.user_id.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      certificate.user_id.phone.includes(lowerCaseSearchTerm);

    const matchesStatus = statusFilter === "all" || certificate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">QUẢN LÝ CHỨNG CHỈ HÀNH NGHỀ</h2>

        <div className="certificate-filter-section">
          <div className="certificate-search-bar">
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
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>
            <Loading />
          </p>
        ) : (
          <div className="certificate-list">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className="certificate-item"
                onClick={() => openModal(certificate)}
              >
                <img
                  src={certificate.user_id.imgAvt}
                  alt="Avatar"
                  className="certificate-avatar"
                />
                <div className="certificate-info">
                  <p>
                    <strong>Tên:</strong> {`${certificate.user_id.firstName} ${certificate.user_id.lastName}`}
                  </p>
                  <p>
                    <strong>Email:</strong> {certificate.user_id.email}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {certificate.user_id.phone}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {certificate.status === "pending"
                      ? "Đang chờ duyệt"
                      : certificate.status === "approved"
                      ? "Đã duyệt"
                      : "Đã từ chối"}
                  </p>
                </div>
                {certificate.status === "pending" && (
                  <div className="certificate-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(certificate._id);
                      }}
                      disabled={loading}
                    >
                      Chấp thuận
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(certificate);
                      }}
                      disabled={loading}
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredCertificates.length === 0 && (
              <p>Không tìm thấy chứng chỉ nào phù hợp.</p>
            )}
          </div>
        )}

        {selectedCertificate && (
          <div className="certificate-modal-overlay" onClick={closeModal}>
            <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="certificate-close-btn" onClick={closeModal}>
                Đóng
              </button>
              <h3>Thông tin chi tiết</h3>
              <p>
                <strong>Tên:</strong> {`${selectedCertificate.user_id.firstName} ${selectedCertificate.user_id.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {selectedCertificate.user_id.email}
              </p>
              <p>
                <strong>SĐT:</strong> {selectedCertificate.user_id.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedCertificate.user_id.address}
              </p>
              <div className="certificate-documents">
                <p>
                  <strong>Giấy chứng chỉ hành nghề:</strong>
                </p>
                <img
                  src={selectedCertificate.imgCertificatePractice}
                  alt="Certificate"
                  className="certificate-document-img"
                />
              </div>
              {selectedCertificate.status === "pending" && (
                <div className="certificate-reject-section">
                  <label>Lý do từ chối:</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleReject(selectedCertificate._id)}
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

export default ManagePracticeCertificates;