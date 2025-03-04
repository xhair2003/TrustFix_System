import { useState } from 'react';
import React from 'react';
import RepairmentHistoryItem from './RepairmentHistoryItem';
import './RepairmentHistoryList.scss';
import RepairmentDetailModal from './RepairmentDetailModal';

const RepairmentHistoryList = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const repairmentHistory = [
    {
      id: 1,
      time: "12:59 AM, 23 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "27, Trà Na 1, Hoa Khan Nam, Liên Chiểu, Đà Nẵng",
      serviceType: "Sửa máy lạnh",
      technicianName: "Nguyễn Văn Hoành"
    },
    {
      id: 2,
      time: "9:30 AM, 22 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "15, Lê Lợi, Hải Châu, Đà Nẵng",
      serviceType: "Bảo dưỡng điều hòa",
      technicianName: "Trần Thị Mai"
    },
    {
      id: 3,
      time: "2:15 PM, 21 thg 08, 2025",
      status: "Đang xử lý",
      location: "10, Nguyễn Huệ, Thanh Khê, Đà Nẵng",
      serviceType: "Sửa quạt điện",
      technicianName: "Lê Văn Hùng"
    },
    {
      id: 4,
      time: "3:20 PM, 24 thg 08, 2025",
      status: "Đã hủy",
      location: "8, Phạm Văn Đồng, Sơn Trà, Đà Nẵng",
      serviceType: "Sửa tủ lạnh",
      technicianName: "Hoàng Văn Nam"
    },
    {
      id: 5,
      time: "11:00 AM, 25 thg 08, 2025",
      status: "Đang chờ",
      location: "42, Trần Phú, Hải Châu, Đà Nẵng",
      serviceType: "Lắp đặt máy lạnh",
      technicianName: "Nguyễn Thị Hồng"
    },
    {
      id: 6,
      time: "8:15 AM, 26 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "19, Ông Ích Khiêm, Thanh Khê, Đà Nẵng",
      serviceType: "Sửa máy lọc nước",
      technicianName: "Võ Văn Tài"
    },
    {
      id: 7,
      time: "4:30 PM, 27 thg 08, 2025",
      status: "Đang xử lý",
      location: "33, Nguyễn Văn Linh, Ngũ Hành Sơn, Đà Nẵng",
      serviceType: "Bảo dưỡng lò vi sóng",
      technicianName: "Đặng Thị Thu"
    },
    {
      id: 8,
      time: "9:45 AM, 28 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "12, Lý Thường Kiệt, Liên Chiểu, Đà Nẵng",
      serviceType: "Sửa tivi",
      technicianName: "Bùi Văn Minh"
    }
];
  return (
    <div className="repairment-history-list">
      {repairmentHistory.map(item => (
         <div key={item.id} onClick={() => setSelectedItem(item)}>
        <RepairmentHistoryItem
          key={item.id}
          time={item.time}
          status={item.status}
          location={item.location}
          serviceType={item.serviceType}
          technicianName={item.technicianName}
        />
        </div>
      ))}
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