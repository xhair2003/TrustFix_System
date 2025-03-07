import React from 'react';
import './RepairmentDetailModal.scss';

const RepairmentDetailModal = ({ item, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Chi tiết sửa chữa</h2>
        <p><strong>Thời gian:</strong> {item.time}</p>
        <p><strong>Trạng thái:</strong> {item.status}</p>
        <p><strong>Địa điểm:</strong> {item.location}</p>
        <p><strong>Loại dịch vụ:</strong> {item.serviceType}</p>
        <p><strong>Kỹ thuật viên:</strong> {item.technicianName}</p>
      </div>
    </div>
  );
};

export default RepairmentDetailModal;
