import React from 'react';
import { useState } from 'react';
import RepairmentHistoriesSortBar from '../../../../component/users/customer/ViewRepairmentHistories/RepairmentHistoriesSortBar';
import RepairmentHistoryList from '../../../../component/users/customer/ViewRepairmentHistories/RepairmentHistoryList';
import './ViewRepairmentHistories.scss';

const ViewRepairmentHistories = () => {
    const [sortBy, setSortBy] = useState('date');
  
    const handleSort = (sortValue) => {
      setSortBy(sortValue);
      console.log(`Sorting by: ${sortValue}`);
    };
  
    return (
      <div className="view-repairment-histories">
        <nav className="breadcrumb">
          <span>Xem lịch sử sửa chữa</span>
        </nav>
        <div className="content">
          <RepairmentHistoriesSortBar onSort={handleSort} />
          <RepairmentHistoryList sortBy={sortBy} /> 
        </div>
      </div>
    );
  };
  
  export default ViewRepairmentHistories;