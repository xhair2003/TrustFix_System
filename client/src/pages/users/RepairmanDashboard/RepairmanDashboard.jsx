import React, { useEffect, useState } from 'react';
import './RepairmanDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RepairmanDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(null);

  // Giả lập dữ liệu
  const dashboardData = {
    revenue: {
      monthly: 15000000,
      yearly: 180000000,
      monthlyDetail: [5000000, 4000000, 3000000, 2000000] // dữ liệu chi tiết 4 tuần
    },
    orders: {
      completed: {
        monthly: 25,
        yearly: 300,
        monthlyDetail: [7, 6, 8, 4] // dữ liệu chi tiết 4 tuần
      },
      cancelled: {
        monthly: 3,
        yearly: 15,
        monthlyDetail: [1, 0, 1, 1] // dữ liệu chi tiết 4 tuần
      }
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Cấu hình biểu đồ doanh thu
  const revenueChartData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: dashboardData.revenue.monthlyDetail,
      backgroundColor: '#3498db',
      borderRadius: 5,
    }]
  };

  // Cấu hình biểu đồ đơn hàng
  const ordersChartData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Hoàn thành',
        data: dashboardData.orders.completed.monthlyDetail,
        backgroundColor: '#27ae60',
        borderRadius: 5,
      },
      {
        label: 'Hủy',
        data: dashboardData.orders.cancelled.monthlyDetail,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống kê chi tiết tháng ' + selectedMonth }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

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
              <option key={month} value={month}>Tháng {month}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='repairman-dashboard-select'
          >
            {years.map(year => (
              <option key={year} value={year}>Năm {year}</option>
            ))}
          </select>
        </div>

        <div className='repairman-dashboard-container'>
          <div 
            className='repairman-dashboard-card'
            onClick={() => setShowModal('revenue')}
          >
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

          <div 
            className='repairman-dashboard-card'
            onClick={() => setShowModal('orders')}
          >
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

        {showModal && (
          <div className='repairman-dashboard-modal'>
            <div className='repairman-dashboard-modal-content'>
              <button 
                className='repairman-dashboard-modal-close'
                onClick={() => setShowModal(null)}
              >
                ×
              </button>
              {showModal === 'revenue' ? (
                <Bar data={revenueChartData} options={chartOptions} />
              ) : (
                <Bar data={ordersChartData} options={chartOptions} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairmanDashboard;