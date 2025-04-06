import React, { useEffect, useState } from 'react';
import './RepairmanDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";

const RepairmanDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Giả lập dữ liệu (thay bằng API thực tế nếu có)
  const dashboardData = {
    revenue: {
      monthly: 15000000,
      yearly: 180000000
    },
    orders: {
      completed: {
        monthly: 25,
        yearly: 300
      },
      cancelled: {
        monthly: 3,
        yearly: 15
      }
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className='history-container'>
      <div className='history-form'>
        <h2 className='complaint-title'>DASHBOARD CHO THỢ</h2>
        
        <div className='repairman-dashboard-filters'>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='repairman-dashboard-select'
          >
            {months.map(month => (
              <option key={month} value={month}>
                Tháng {month}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='repairman-dashboard-select'
          >
            {years.map(year => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>

        <div className='repairman-dashboard-container'>
          <div className='repairman-dashboard-card'>
            <h3 className='repairman-dashboard-card-title'>Doanh Thu</h3>
            <div className='repairman-dashboard-stats'>
              <div className='repairman-dashboard-stat-item'>
                <span>Tháng:</span>
                <span className='repairman-dashboard-value'>
                  {dashboardData.revenue.monthly.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className='repairman-dashboard-stat-item'>
                <span>Năm:</span>
                <span className='repairman-dashboard-value'>
                  {dashboardData.revenue.yearly.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>

          <div className='repairman-dashboard-card'>
            <h3 className='repairman-dashboard-card-title'>Đơn Hàng</h3>
            <div className='repairman-dashboard-stats'>
              <div className='repairman-dashboard-stat-item'>
                <span>Hoàn thành (Tháng):</span>
                <span className='repairman-dashboard-value'>
                  {dashboardData.orders.completed.monthly} đơn
                </span>
              </div>
              <div className='repairman-dashboard-stat-item'>
                <span>Hoàn thành (Năm):</span>
                <span className='repairman-dashboard-value'>
                  {dashboardData.orders.completed.yearly} đơn
                </span>
              </div>
              <div className='repairman-dashboard-stat-item'>
                <span>Hủy (Tháng):</span>
                <span className='repairman-dashboard-value repairman-dashboard-cancelled'>
                  {dashboardData.orders.cancelled.monthly} đơn
                </span>
              </div>
              <div className='repairman-dashboard-stat-item'>
                <span>Hủy (Năm):</span>
                <span className='repairman-dashboard-value repairman-dashboard-cancelled'>
                  {dashboardData.orders.cancelled.yearly} đơn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairmanDashboard;