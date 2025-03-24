import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  totalBannedUsers,
  totalRepairmen,
  totalCustomers,
  totalCompletedRequests,
  totalConfirmedRequests,
  totalPendingRequests,
  totalCancelledRequests,
  totalMakePaymentRequests,
  totalDealPriceRequests,
  totalPendingComplaints,
  totalPendingUpgradeRequests,
  totalServiceIndustries,
  totalServicesByIndustry,
  totalServicePrices,
  resetError,
} from '../../../store/actions/adminActions';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Modal = ({ isOpen, onClose, title, barData, tableData, total, columns }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="details-chart">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, ticks: { color: '#64748b' } },
                  x: { ticks: { color: '#64748b' } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div className="details-table">
            <table>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className="color-dot" style={{ backgroundColor: item.color }}></span>
                      {item.type}
                    </td>
                    <td>{item.count}</td>
                    <td>{total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueFilter, setRevenueFilter] = useState('month');

  const {
    totalBannedUsers: b,
    totalRepairmen: c,
    totalCustomers: d,
    totalCompletedRequests: e,
    totalConfirmedRequests: f,
    totalPendingRequests: g,
    totalCancelledRequests: i,
    totalMakePaymentRequests: k,
    totalDealPriceRequests: l,
    totalPendingComplaints: m,
    totalPendingUpgradeRequests: n,
    totalServiceIndustries: o,
    totalServicesByIndustry: p,
    totalServicePrices: q,
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(totalRepairmen());
    dispatch(totalCustomers());
    dispatch(totalBannedUsers());
    dispatch(totalCompletedRequests());
    dispatch(totalConfirmedRequests());
    dispatch(totalPendingRequests());
    dispatch(totalCancelledRequests());
    dispatch(totalMakePaymentRequests());
    dispatch(totalDealPriceRequests());
    dispatch(totalPendingComplaints());
    dispatch(totalPendingUpgradeRequests());
    dispatch(totalServiceIndustries());
    dispatch(totalServicesByIndustry());
    dispatch(totalServicePrices());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }
  }, [error, dispatch]);

  if (loading) {
    return <Loading />;
  }

  const servicesByIndustry = Array.isArray(p) ? p : [];

  // Dữ liệu cho biểu đồ Doughnut (Phân Bố Yêu Cầu)
  const requestData = {
    labels: ['Xác Nhận', 'Đang Chờ', 'Hủy', 'Thanh Toán', 'Thương Lượng Giá'],
    datasets: [
      {
        data: [f || 0, g || 0, i || 0, k || 0, l || 0],
        backgroundColor: ['#3b82f6', '#facc15', '#ef4444', '#22c55e', '#f97316'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20,
      },
    ],
  };

  const requestDetails = [
    { type: 'Xác Nhận', count: f || 0, color: '#3b82f6' },
    { type: 'Đang Chờ', count: g || 0, color: '#facc15' },
    { type: 'Hủy', count: i || 0, color: '#ef4444' },
    { type: 'Thanh Toán', count: k || 0, color: '#22c55e' },
    { type: 'Thương Lượng Giá', count: l || 0, color: '#f97316' },
  ];

  const totalRequests = (f || 0) + (g || 0) + (i || 0) + (k || 0) + (l || 0);

  // Dữ liệu cho biểu đồ Doughnut (Thống Kê Người Dùng)
  const userData = {
    labels: ['Thợ', 'Khách', 'TK Bị Khóa'],
    datasets: [
      {
        data: [c || 0, d || 0, b || 0],
        backgroundColor: ['#a855f7', '#8b5cf6', '#d8b4fe'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20,
      },
    ],
  };

  const userDetails = [
    { type: 'Thợ', count: c || 0, color: '#a855f7' },
    { type: 'Khách', count: d || 0, color: '#8b5cf6' },
    { type: 'TK Bị Khóa', count: b || 0, color: '#d8b4fe' },
  ];

  const totalUsers = (c || 0) + (d || 0) + (b || 0);

  // Dữ liệu cho biểu đồ Doughnut (Xu Hướng Yêu Cầu Hoàn Thành)
  const completedRequestData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: [30, 45, 60, 50, 70, e || 0],
        backgroundColor: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#4c1d95'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20,
      },
    ],
  };

  const completedDetails = [
    { type: 'Tháng 1', count: 30, color: '#a855f7' },
    { type: 'Tháng 2', count: 45, color: '#9333ea' },
    { type: 'Tháng 3', count: 60, color: '#7e22ce' },
    { type: 'Tháng 4', count: 50, color: '#6b21a8' },
    { type: 'Tháng 5', count: 70, color: '#581c87' },
    { type: 'Tháng 6', count: e || 0, color: '#4c1d95' },
  ];

  const totalCompleted = completedDetails.reduce((sum, item) => sum + item.count, 0);

  // Dữ liệu cho biểu đồ Doanh Thu (Doughnut Chart)
  const revenueData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac', '#bbf7d0'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20,
      },
    ],
  };

  const revenueDetails = [];

  // Dữ liệu giả lập cho doanh thu
  const revenueByMonth = [
    { type: 'Tháng 1', count: 50 },
    { type: 'Tháng 2', count: 70 },
    { type: 'Tháng 3', count: 60 },
    { type: 'Tháng 4', count: 90 },
    { type: 'Tháng 5', count: 120 },
    { type: 'Tháng 6', count: 150 },
  ];

  const revenueByWeek = [
    { type: 'Tuần 1', count: 20 },
    { type: 'Tuần 2', count: 30 },
    { type: 'Tuần 3', count: 25 },
    { type: 'Tuần 4', count: 40 },
  ];

  const revenueByMonths = [
    { type: '3 Tháng Gần Nhất', count: 360 },
    { type: '6 Tháng Gần Nhất', count: 540 },
  ];

  const revenueByYear = [
    { type: 'Năm 2024', count: 540 },
    { type: 'Năm 2023', count: 450 },
  ];

  // Cập nhật dữ liệu doanh thu dựa trên bộ lọc
  let selectedRevenueData = [];
  if (revenueFilter === 'month') selectedRevenueData = revenueByMonth;
  else if (revenueFilter === 'week') selectedRevenueData = revenueByWeek;
  else if (revenueFilter === 'months') selectedRevenueData = revenueByMonths;
  else if (revenueFilter === 'year') selectedRevenueData = revenueByYear;

  revenueData.labels = selectedRevenueData.map(item => item.type);
  revenueData.datasets[0].data = selectedRevenueData.map(item => item.count);
  selectedRevenueData.forEach((item, index) => {
    revenueDetails.push({
      type: item.type,
      count: item.count,
      color: revenueData.datasets[0].backgroundColor[index % revenueData.datasets[0].backgroundColor.length],
    });
  });

  const totalRevenue = selectedRevenueData.reduce((sum, item) => sum + item.count, 0);

  // Dữ liệu cho biểu đồ Bar chi tiết
  const getBarData = (details) => ({
    labels: details.map(item => item.type),
    datasets: [
      {
        label: 'Số Lượng',
        data: details.map(item => item.count),
        backgroundColor: details.map(item => item.color),
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  });

  return (
    <div className="modern-dashboard">
      <header className="dashboard-header">
        <h1>Bảng Điều Khiển Quản Trị</h1>
        <span className="date">Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
      </header>

      <div className="dashboard-grid">
        {[
          { title: "Tổng Thợ", value: c, icon: "👨‍🔧" },
          { title: "Tổng Khách", value: d, icon: "👥" },
          { title: "TK Bị Khóa", value: b, icon: "🔒" },
          { title: "Yêu Cầu Xác Nhận", value: f, icon: "✅" },
          { title: "Yêu Cầu Hủy", value: i, icon: "❌" },
          { title: "Yêu Cầu Thanh Toán", value: k, icon: "💸" },
          { title: "Khiếu Nại Chờ", value: m, icon: "⚠️" },
          { title: "Nâng Cấp Chờ", value: n, icon: "⬆️" },
          { title: "Tổng Chuyên Mục", value: o, icon: "📋" },
          { title: "Tổng Danh Mục", value: q, icon: "📊" },
        ].map((item, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="card-value">{item.value || 0}</p>
          </div>
        ))}
      </div>

      <div className="charts-section">
        {/* Biểu đồ Doughnut (Phân Bố Yêu Cầu) */}
        <div className="chart-container doughnut-chart" onClick={() => setShowRequestModal(true)}>
          <h2>Phân Bố Yêu Cầu</h2>
          <div className="doughnut-wrapper">
            <Doughnut
              data={requestData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#64748b' } },
                  beforeDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    ctx.save();
                    ctx.font = 'bold 30px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1e3a8a';
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    const maxValue = Math.max(...requestData.datasets[0].data);
                    const percentage = totalRequests > 0 ? ((maxValue / totalRequests) * 100).toFixed(1) : 0;
                    ctx.fillText(`${percentage}%`, centerX, centerY);
                    ctx.restore();
                  },
                },
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          title="Chi Tiết Phân Bố Yêu Cầu"
          barData={getBarData(requestDetails)}
          tableData={requestDetails}
          total={totalRequests}
          columns={['Loại Yêu Cầu', 'Số Lượng', 'Tỷ Lệ']}
        />

        {/* Biểu đồ Doughnut (Thống Kê Người Dùng) */}
        <div className="chart-container doughnut-chart" onClick={() => setShowUserModal(true)}>
          <h2>Thống Kê Người Dùng</h2>
          <div className="doughnut-wrapper">
            <Doughnut
              data={userData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#64748b' } },
                  beforeDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    ctx.save();
                    ctx.font = 'bold 30px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1e3a8a';
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    const maxValue = Math.max(...userData.datasets[0].data);
                    const percentage = totalUsers > 0 ? ((maxValue / totalUsers) * 100).toFixed(1) : 0;
                    ctx.fillText(`${percentage}%`, centerX, centerY);
                    ctx.restore();
                  },
                },
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="Chi Tiết Thống Kê Người Dùng"
          barData={getBarData(userDetails)}
          tableData={userDetails}
          total={totalUsers}
          columns={['Loại Người Dùng', 'Số Lượng', 'Tỷ Lệ']}
        />

        {/* Biểu đồ Doughnut (Xu Hướng Yêu Cầu Hoàn Thành) */}
        <div className="chart-container doughnut-chart" onClick={() => setShowCompletedModal(true)}>
          <h2>Xu Hướng Yêu Cầu Hoàn Thành</h2>
          <div className="doughnut-wrapper">
            <Doughnut
              data={completedRequestData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#64748b' } },
                  beforeDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    ctx.save();
                    ctx.font = 'bold 30px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1e3a8a';
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    const maxValue = Math.max(...completedRequestData.datasets[0].data);
                    const percentage = totalCompleted > 0 ? ((maxValue / totalCompleted) * 100).toFixed(1) : 0;
                    ctx.fillText(`${percentage}%`, centerX, centerY);
                    ctx.restore();
                  },
                },
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={showCompletedModal}
          onClose={() => setShowCompletedModal(false)}
          title="Chi Tiết Xu Hướng Yêu Cầu Hoàn Thành"
          barData={getBarData(completedDetails)}
          tableData={completedDetails}
          total={totalCompleted}
          columns={['Tháng', 'Số Lượng', 'Tỷ Lệ']}
        />

        {/* Biểu đồ Doanh Thu (Doughnut Chart) */}
        <div className="chart-container doughnut-chart" >
          <h2>Phân Bố Doanh Thu</h2>
          <div className="filter-options">
            <select onChange={(e) => setRevenueFilter(e.target.value)} value={revenueFilter}>
              <option value="month">Theo Tháng</option>
              <option value="week">Theo Tuần</option>
              <option value="months">Theo Số Tháng</option>
              <option value="year">Theo Năm</option>
            </select>
          </div>
          <div className="doughnut-wrapper" onClick={() => setShowRevenueModal(true)}>
            <Doughnut
              data={revenueData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  beforeDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    ctx.save();
                    ctx.font = 'bold 20px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1e3a8a';
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    ctx.fillText(`${totalRevenue} triệu`, centerX, centerY);
                    ctx.restore();
                  },
                },
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={showRevenueModal}
          onClose={() => setShowRevenueModal(false)}
          title="Chi Tiết Phân Bố Doanh Thu"
          barData={getBarData(revenueDetails)}
          tableData={revenueDetails}
          total={totalRevenue}
          columns={['Thời Gian', 'Doanh Thu (triệu VNĐ)', 'Tỷ Lệ']}
        />
      </div>

      <section className="services-section">
        <h2>Dịch Vụ Theo Ngành</h2>
        <div className="services-list">
          {servicesByIndustry.length > 0 ? (
            servicesByIndustry.map((item, index) => (
              <div key={index} className="service-item">
                <span className="service-name">{item.serviceIndustry || 'Không có tên'}</span>
                <span className="service-count">{item.totalServices || 0}</span>
              </div>
            ))
          ) : (
            <p className="no-data">Không có dữ liệu dịch vụ theo ngành.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;