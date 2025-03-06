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
      <div className='history-container'>
        <div className='history-form'>
          <h2 className='complaint-title'>LỊCH SỬ THUÊ THỢ</h2>
          <div className="view-repairment-histories">
            <div className="content-in">
              <RepairmentHistoriesSortBar onSort={handleSort} />
              <RepairmentHistoryList sortBy={sortBy} /> 
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ViewRepairmentHistories;