import React, { useState } from 'react';
import './RepairmentHistoriesSortBar.scss';

const RepairmentHistoriesSortBar = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const statusOptions = [
    { label: 'Tất cả trạng thái', value: '' },
    { label: 'Đã hoàn thành', value: 'Completed' },
    { label: 'Đã xác nhận', value: 'Confirmed' },
    { label: 'Đang chờ xử lý', value: 'Pending' },
    { label: 'Đã hủy', value: 'Cancelled' },
    { label: 'Yêu cầu chi tiết', value: 'Requesting Details' },
    { label: 'Thỏa thuận giá', value: 'Deal price' },
    { label: 'Đã chốt giá', value: 'Done deal price' },
    { label: 'Chờ thanh toán', value: 'Make payment' },
    { label: 'Thợ xác nhận hoàn thành', value: 'Repairman confirmed completion' },
    { label: 'Tiến hành sửa chữa', value: 'Proceed with repair' },
  ];

  const handleFilterChange = () => {
    if (onFilter) {
      onFilter({ searchTerm, statusFilter, startDate, endDate });
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    handleFilterChange();
  };

  return (
    <div className="sort-bar">
      <h3>Lọc lịch sử sửa chữa</h3>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên thợ..."
          value={searchTerm}
          onChange={handleInputChange(setSearchTerm)}
          className="filter-input"
        />
        <select
          value={statusFilter}
          onChange={handleInputChange(setStatusFilter)}
          className="filter-select"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={handleInputChange(setStartDate)}
          className="filter-date"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleInputChange(setEndDate)}
          className="filter-date"
        />
      </div>
    </div>
  );
};

export default RepairmentHistoriesSortBar;