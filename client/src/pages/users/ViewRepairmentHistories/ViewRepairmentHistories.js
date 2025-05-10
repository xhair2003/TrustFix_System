import React, { useState } from 'react';
import RepairmentHistoriesSortBar from '../../../component/users/customer/ViewRepairmentHistories/RepairmentHistoriesSortBar';
import RepairmentHistoryList from '../../../component/users/customer/ViewRepairmentHistories/RepairmentHistoryList';
import './ViewRepairmentHistories.scss';

const ViewRepairmentHistories = () => {
  const [filter, setFilter] = useState({
    searchTerm: '',
    statusFilter: '',
    startDate: '',
    endDate: '',
  });

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">LỊCH SỬ THUÊ THỢ</h2>
        <div className="view-repairment-histories">
          <div className="content-in">
            <RepairmentHistoriesSortBar onFilter={handleFilter} />
            <RepairmentHistoryList filter={filter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRepairmentHistories;