import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    totalWorkers: 0,
    totalCustomers: 0,
    totalLockedAccounts: 0,
    completedRequests: 0,
    confirmedRequests: 0,
    pendingRequests: 0,
    cancelledRequests: 0,
    makePaymentRequests: 0,
    dealPriceRequests: 0,
    pendingComplaints: 0,
    pendingUpgradeRequests: 0,
    totalServiceIndustries: 0,
    totalServicesByIndustry: [],
    totalServicePrices: 0,
  });

  useEffect(() => {
    // Giả lập lấy dữ liệu từ API
    const fetchData = async () => {
      // Thay thế bằng API thực tế của bạn
      const mockData = {
        totalWorkers: 150,
        totalCustomers: 320,
        totalLockedAccounts: 5,
        completedRequests: 45,
        confirmedRequests: 60,
        pendingRequests: 20,
        cancelledRequests: 10,
        makePaymentRequests: 15,
        dealPriceRequests: 25,
        pendingComplaints: 8,
        pendingUpgradeRequests: 3,
        totalServiceIndustries: 10,
        totalServicesByIndustry: [
          { name: 'Sửa chữa', count: 50 },
          { name: 'Vệ sinh', count: 30 },
          { name: 'Nấu ăn', count: 20 },
        ],
        totalServicePrices: 12500000,
      };
      setData(mockData);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Bảng Điều Khiển Quản Trị</h1>
      <div className="admin-dashboard__grid">
        {/* Tổng thợ */}
        <div className="admin-dashboard__card">
          <h3>Tổng thợ</h3>
          <p>{data.totalWorkers}</p>
        </div>

        {/* Tổng khách */}
        <div className="admin-dashboard__card">
          <h3>Tổng khách</h3>
          <p>{data.totalCustomers}</p>
        </div>

        {/* Tổng tài khoản bị khóa */}
        <div className="admin-dashboard__card">
          <h3>Tổng TK bị khóa</h3>
          <p>{data.totalLockedAccounts}</p>
        </div>

        {/* getCompletedRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu hoàn thành</h3>
          <p>{data.completedRequests}</p>
        </div>

        {/* getConfirmedRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu đã xác nhận</h3>
          <p>{data.confirmedRequests}</p>
        </div>

        {/* getPendingRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu đang chờ</h3>
          <p>{data.pendingRequests}</p>
        </div>

        {/* getCancelledRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu đã hủy</h3>
          <p>{data.cancelledRequests}</p>
        </div>

        {/* getMakePaymentRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu thanh toán</h3>
          <p>{data.makePaymentRequests}</p>
        </div>

        {/* getDealPriceRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu thương lượng giá</h3>
          <p>{data.dealPriceRequests}</p>
        </div>

        {/* getPendingComplaintsCount */}
        <div className="admin-dashboard__card">
          <h3>Khiếu nại đang chờ</h3>
          <p>{data.pendingComplaints}</p>
        </div>

        {/* getPendingUpgradeRequestsCount */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu nâng cấp đang chờ</h3>
          <p>{data.pendingUpgradeRequests}</p>
        </div>

        {/* totalServiceIndustries */}
        <div className="admin-dashboard__card">
          <h3>Tổng ngành dịch vụ</h3>
          <p>{data.totalServiceIndustries}</p>
        </div>

        {/* totalServicePrices */}
        <div className="admin-dashboard__card">
          <h3>Tổng giá dịch vụ</h3>
          <p>{data.totalServicePrices.toLocaleString('vi-VN')} VNĐ</p>
        </div>
      </div>

      {/* totalServicesByIndustry */}
      <div className="admin-dashboard__section">
        <h2>Dịch vụ theo ngành</h2>
        <div className="admin-dashboard__list">
          {data.totalServicesByIndustry.map((item, index) => (
            <div key={index} className="admin-dashboard__list-item">
              <span>{item.name}</span>
              <span>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;