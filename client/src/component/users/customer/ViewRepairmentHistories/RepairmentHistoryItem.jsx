import React from 'react';
import './RepairmentHistoryItem.scss';

const RepairmentHistoryItem = () => {
  return (
    <div className="repairment-history-item">
      <div className="header">
        <span className="time">12:59 AM, 23 thg 08, 2025</span>
        <span className="status completed">Đã hoàn thành</span>
        <span className="info-icon">ⓘ</span>
      </div>
      <div className="details">
        <div className="location">
          <span className="location-icon">📍</span>
          27, Trà Na 1, Hoa Khan Nam, Liên Chiểu, Đà Nẵng
        </div>
        <div className="service">
          <span className="service-icon">🔧</span>
          Sửa máy lạnh
        </div>
        <div className="technician">
          <span className="technician-icon">👤</span>
          Nguyễn Văn Hoành
        </div>
      </div>
    </div>
  );
};

export default RepairmentHistoryItem;