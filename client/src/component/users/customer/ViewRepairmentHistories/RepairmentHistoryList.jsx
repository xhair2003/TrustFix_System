import React from 'react';
import RepairmentHistoryItem from './RepairmentHistoryItem';
import './RepairmentHistoryList.scss';

const RepairmentHistoryList = () => {
  // Dummy data for multiple repairment history items
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
      time: "10:45 AM, 20 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "5, Hùng Vương, Cẩm Lệ, Đà Nẵng",
      serviceType: "Sửa máy giặt",
      technicianName: "Phạm Thị Lan"
    },
    {
      id: 5,
      time: "10:45 AM, 20 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "5, Hùng Vương, Cẩm Lệ, Đà Nẵng",
      serviceType: "Sửa máy giặt",
      technicianName: "Phạm Thị Lan"
    },
    {
      id: 6,
      time: "10:45 AM, 20 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "5, Hùng Vương, Cẩm Lệ, Đà Nẵng",
      serviceType: "Sửa máy giặt",
      technicianName: "Phạm Thị Lan"
    },
    {
      id: 7,
      time: "10:45 AM, 20 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "5, Hùng Vương, Cẩm Lệ, Đà Nẵng",
      serviceType: "Sửa máy giặt",
      technicianName: "Phạm Thị Lan"
    },
    {
      id: 8,
      time: "10:45 AM, 20 thg 08, 2025",
      status: "Đã hoàn thành",
      location: "5, Hùng Vương, Cẩm Lệ, Đà Nẵng",
      serviceType: "Sửa máy giặt",
      technicianName: "Phạm Thị Lan"
    }
    
  ];

  return (
    <div className="repairment-history-list">
      {repairmentHistory.map(item => (
        <RepairmentHistoryItem
          key={item.id}
          time={item.time}
          status={item.status}
          location={item.location}
          serviceType={item.serviceType}
          technicianName={item.technicianName}
        />
      ))}
    </div>
  );
};

export default RepairmentHistoryList;