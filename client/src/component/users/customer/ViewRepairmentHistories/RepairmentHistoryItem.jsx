import React from 'react';
import './RepairmentHistoryItem.scss';

const RepairmentHistoryItem = ({
  time,
  status,
  location,
  serviceType,
  technicianName
}) => {
  return (
    <div className="repairment-history-item">
      <div className="header">
        <span className="time">{time}</span>
        <span className={`status ${status === 1 ? 'completed' : status === 0 ? 'processing' : 'cancelled'}`}>{status === 1 ? 'Đã hoàn thành' : status === 0 ? 'Đang xử lý' : 'Đã hủy'}</span>
        <span className="info-icon">ⓘ</span>
      </div>
      <div className="details">
        <div className="location">
          <span className="location-icon">📍</span>
          {location}
        </div>
        <div className="service">
          <span className="service-icon">🔧</span>
          {serviceType}
        </div>
        <div className="technician">
          <span className="technician-icon">👤</span>
          {technicianName}
        </div>
      </div>
    </div>
  );
};

export default RepairmentHistoryItem;