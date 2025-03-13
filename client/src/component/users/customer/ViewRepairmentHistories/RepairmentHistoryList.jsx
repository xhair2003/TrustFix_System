import { useState, useEffect } from 'react';
import React from 'react';
import RepairmentHistoryItem from './RepairmentHistoryItem';
import './RepairmentHistoryList.scss';
import RepairmentDetailModal from './RepairmentDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { getRepairHistory } from '../../../../store/actions/userActions';
import Loading from '../../../Loading/Loading';

const RepairmentHistoryList = () => {
  const dispatch = useDispatch();
  const { repairHistory, loading, error } = useSelector((state) => state.user);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(getRepairHistory());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="repairment-history-list">
      {Array.isArray(repairHistory) && repairHistory.length > 0 ? (
        repairHistory.map(item => (
          <div key={item.id} onClick={() => setSelectedItem(item)}>
            <RepairmentHistoryItem
              time={item.createdAt}
              status={item.status}
              location={item.address}
              serviceType={item.serviceType}
              technicianName={item.description}
            />
          </div>
        ))
      ) : (
        <p style={{ color: 'red', justifyContent: 'center', display: 'flex' }}>{error}</p>
      )}
      {selectedItem && (
        <RepairmentDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default RepairmentHistoryList;