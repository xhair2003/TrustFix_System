import React from 'react';
import './RepairmentDetailModal.scss';

const RepairmentDetailModal = ({ item, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Chi tiết sửa chữa</h2>
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
        <p><strong>Ảnh đơn hàng:</strong>
          {item.image && Array.isArray(item.image) && item.image.length > 0 && (
            <div>
              {item.image.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Order ${index + 1}`}
                  className="order-image"
                />
              ))}
            </div>
          )}</p>
        <p><strong>Loại dịch vụ:</strong> {item.serviceType}</p>
        <p><strong>Thông tin thợ</strong></p>
        <p><strong>Kỹ thuật viên:</strong> {`${item.repairman?.firstName} ${item.repairman?.lastName}`}</p>
        <p><strong>Thông tin liên hệ:</strong> {item.repairman?.phone}</p>
        <p><strong>Ảnh chứng chỉ hành nghề:</strong>
          {item.repairman_id.imgCertificatePractice && Array.isArray(item.repairman_id.imgCertificatePractice) && item.repairman_id.imgCertificatePractice.length > 0 && (
            <div>
              {item.repairman_id.imgCertificatePractice.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Order ${index + 1}`}
                  className="order-image"
                />
              ))}
            </div>
          )}
          {item.repairman_id.supplementaryPracticeCertificate && Array.isArray(item.repairman_id.supplementaryPracticeCertificate) && item.repairman_id.supplementaryPracticeCertificate.length > 0 && (
            <div>
              {item.repairman_id.supplementaryPracticeCertificate.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Order ${index + 1}`}
                  className="order-image"
                />
              ))}
            </div>
          )}

        </p>
      </div>
    </div>
  );
};

export default RepairmentDetailModal;
