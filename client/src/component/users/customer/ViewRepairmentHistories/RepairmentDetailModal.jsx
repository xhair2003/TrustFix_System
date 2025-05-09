import React from 'react';
import './RepairmentDetailModal.scss';

const RepairmentDetailModal = ({ item, onClose }) => {
  return (
    <div className="repairman-detail-modal-overlay" onClick={onClose}>
      <div className="repairman-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="repairman-detail-modal-close-button" onClick={onClose}>✖</button>
        <h2>Chi tiết sửa chữa</h2>
        <section>
          <p><strong>Thông tin đơn sửa chữa</strong></p>
          <p><strong>Thời gian:</strong> {new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> {
            item.status === "Completed" ? "Đã hoàn thành" :
              item.status === "Confirmed" ? "Đã xác nhận" :
                item.status === "Pending" ? "Đang chờ xử lý" :
                  item.status === "Cancelled" ? "Đã hủy" :
                    item.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                      item.status === "Deal price" ? "Thỏa thuận giá" :
                        item.status === "Done deal price" ? "Đã chốt giá" :
                          item.status === "Make payment" ? "Chờ thanh toán" :
                            item.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                              item.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                "Trạng thái không xác định"
          }</p>
          <p><strong>Địa điểm:</strong> {item.address}</p>
          <p><strong>Mô tả:</strong> {item.description}</p>
          <p><strong>Loại dịch vụ:</strong> {item.serviceType}</p>
          {item.image && Array.isArray(item.image) && item.image.length > 0 && (
            <div>
              <p><strong>Ảnh đơn hàng:</strong></p>
              {item.image.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Order ${index + 1}`}
                  className="repairman-detail-modal-order-image"
                />
              ))}
            </div>
          )}
        </section>
        <section>
          <p><strong>Thông tin thợ</strong></p>
          <p><strong>Kỹ thuật viên:</strong> {`${item.repairman?.firstName} ${item.repairman?.lastName}`}</p>
          <p><strong>Thông tin liên hệ:</strong> {item.repairman?.phone}</p>
          {(item.repairman_id.imgCertificatePractice && Array.isArray(item.repairman_id.imgCertificatePractice) && item.repairman_id.imgCertificatePractice.length > 0) ||
           (item.repairman_id.supplementaryPracticeCertificate && Array.isArray(item.repairman_id.supplementaryPracticeCertificate) && item.repairman_id.supplementaryPracticeCertificate.length > 0) ? (
            <div>
              <p><strong>Ảnh chứng chỉ hành nghề:</strong></p>
              {item.repairman_id.imgCertificatePractice && Array.isArray(item.repairman_id.imgCertificatePractice) && item.repairman_id.imgCertificatePractice.length > 0 && (
                item.repairman_id.imgCertificatePractice.map((imageUrl, index) => (
                  <img
                    key={`cert-${index}`}
                    src={imageUrl}
                    alt={`Certificate ${index + 1}`}
                    className="repairman-detail-modal-order-image"
                  />
                ))
              )}
              {item.repairman_id.supplementaryPracticeCertificate && Array.isArray(item.repairman_id.supplementaryPracticeCertificate) && item.repairman_id.supplementaryPracticeCertificate.length > 0 && (
                item.repairman_id.supplementaryPracticeCertificate.map((imageUrl, index) => (
                  <img
                    key={`supp-cert-${index}`}
                    src={imageUrl}
                    alt={`Supplementary Certificate ${index + 1}`}
                    className="repairman-detail-modal-order-image"
                  />
                ))
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default RepairmentDetailModal;