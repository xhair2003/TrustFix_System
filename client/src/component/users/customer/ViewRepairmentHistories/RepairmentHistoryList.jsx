// import { useState, useEffect } from 'react';
// import React from 'react';
// import RepairmentHistoryItem from './RepairmentHistoryItem';
// import './RepairmentHistoryList.scss';
// import RepairmentDetailModal from './RepairmentDetailModal';
// import { useDispatch, useSelector } from 'react-redux';
// import { getRepairHistory, resetError, resetSuccess } from '../../../../store/actions/userActions';
// import Loading from '../../../Loading/Loading';

// const RepairmentHistoryList = () => {
//   const dispatch = useDispatch();
//   const { repairHistory, loading, errorRepairHistory } = useSelector((state) => state.user);
//   const [selectedItem, setSelectedItem] = useState(null);
//   console.log("repairHistory", repairHistory);
//   useEffect(() => {
//     dispatch(getRepairHistory());
//   }, [dispatch]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="repairment-history-list">
//       {Array.isArray(repairHistory) && repairHistory.length > 0 ? (
//         repairHistory.map(item => (
//           <div key={item.id} onClick={() => setSelectedItem(item)}>
//             <RepairmentHistoryItem
//               time={new Date(item.createdAt).toLocaleDateString('vi-VN')}
//               status=
//               {
//                 item.status === "Completed" ? "Đã hoàn thành" :
//                   item.status === "Confirmed" ? "Đã xác nhận" :
//                     item.status === "Pending" ? "Đang chờ xử lý" :
//                       item.status === "Cancelled" ? "Đã hủy" :
//                         item.status === "Requesting Details" ? "Yêu cầu chi tiết" :
//                           item.status === "Deal price" ? "Thỏa thuận giá" :
//                             item.status === "Done deal price" ? "Đã chốt giá" :
//                               item.status === "Make payment" ? "Chờ thanh toán" :
//                                 item.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
//                                   item.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
//                                     "Trạng thái không xác định"
//               }
//               location={item.address}
//               serviceType={item.serviceType}
//               technicianName={`${item.repairman?.firstName} ${item.repairman?.lastName}`}
//             />
//           </div>
//         ))
//       ) : (
//         <p style={{ color: 'red', justifyContent: 'center', display: 'flex' }}>{errorRepairHistory}</p>
//       )}
//       {selectedItem && (
//         <RepairmentDetailModal
//           item={selectedItem}
//           onClose={() => setSelectedItem(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default RepairmentHistoryList;



import { useState, useEffect } from 'react';
import React from 'react';
import RepairmentHistoryItem from './RepairmentHistoryItem';
import './RepairmentHistoryList.scss';
import RepairmentDetailModal from './RepairmentDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { getRepairHistory, resetError, resetSuccess } from '../../../../store/actions/userActions';
import Loading from '../../../Loading/Loading';

const RepairmentHistoryList = ({ filter }) => {
  const dispatch = useDispatch();
  const { repairHistory, loading, errorRepairHistory } = useSelector((state) => state.user);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    dispatch(getRepairHistory());
  }, [dispatch]);

  useEffect(() => {
    if (repairHistory) {
      applyFilter(repairHistory, filter);
    }
  }, [repairHistory, filter]);

  const applyFilter = (data, { searchTerm, statusFilter, startDate, endDate }) => {
    let filtered = [...data];

    // Lọc theo tên thợ
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const fullName = item.repairman
          ? `${item.repairman.firstName} ${item.repairman.lastName}`.toLowerCase()
          : '';
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Lọc theo ngày
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (end) {
        end.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc ngày
      }

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      });
    }

    setFilteredHistory(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="repairment-history-list">
      {Array.isArray(filteredHistory) && filteredHistory.length > 0 ? (
        filteredHistory.map((item) => (
          <div key={item._id} onClick={() => setSelectedItem(item)}>
            <RepairmentHistoryItem
              time={new Date(item.createdAt).toLocaleDateString('vi-VN')}
              status={
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
              }
              location={item.address}
              serviceType={item.serviceType}
              technicianName={item.repairman ? `${item.repairman.firstName} ${item.repairman.lastName}` : 'Chưa có thợ'}
            />
          </div>
        ))
      ) : (
        <p style={{ color: 'red', justifyContent: 'center', display: 'flex' }}>
          {errorRepairHistory || 'Không có lịch sử sửa chữa nào phù hợp.'}
        </p>
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