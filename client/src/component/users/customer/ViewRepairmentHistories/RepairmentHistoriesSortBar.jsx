import React, { useState } from 'react';
import './RepairmentHistoriesSortBar.scss';

const RepairmentHistoriesSortBar = ({ onSort }) => {
  const [selectedSort, setSelectedSort] = useState('date');

  const sortOptions = [
    { label: 'Sắp xếp theo ngày', value: 'date' },
    { label: 'Sắp xếp theo trạng thái', value: 'status' },
    { label: 'Sắp xếp theo thợ', value: 'technician' },
  ];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    if (onSort) {
      onSort(value); // Notify parent component of sort change
    }
  };

  return (
    <div className="sort-bar">
      <h3>Sort Options</h3>
      <div className="sort-controls">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`sort-option ${selectedSort === option.value ? 'active' : ''}`}
            onClick={() => handleSortChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="filter-section">
        <input type="text" placeholder="Filter by technician name..." className="filter-input" />
        <select className="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Đã hoàn thành</option>
          <option value="in-progress">Đang thực hiện</option>
          <option value="pending">Đã hủy</option>
        </select>
      </div>
    </div>
  );
};

export default RepairmentHistoriesSortBar;