import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { Doughnut, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
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
  getMostUsedVipService,
  getAllProfit,
  getYearlyProfit,
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

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
                    <td>{item.count.toLocaleString('vi-VN')} VNĐ</td>
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

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

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
    mostUsedVipService: a,
    totalsProfit,
    totalAll,
    yearlyProfit,
    totalAllByYear,
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
    dispatch(getMostUsedVipService());
    dispatch(getAllProfit(selectedMonth, selectedYear));
    dispatch(getYearlyProfit()); // Lấy dữ liệu cho tất cả các năm
  }, [dispatch, selectedMonth, selectedYear]);

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
  if (totalsProfit) {
    revenueData.labels = Object.keys(totalsProfit);
    revenueData.datasets[0].data = Object.values(totalsProfit);
    Object.entries(totalsProfit).forEach(([type, count], index) => {
      revenueDetails.push({
        type,
        count,
        color: revenueData.datasets[0].backgroundColor[index % revenueData.datasets[0].backgroundColor.length],
      });
    });
  }

  const totalRevenue = totalAll || 0;

  const getBarData = (details) => ({
    labels: details.map(item => item.type),
    datasets: [
      {
        label: 'Doanh Thu (VNĐ)',
        data: details.map(item => item.count),
        backgroundColor: details.map(item => item.color),
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Hàm xuất dữ liệu ra file Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Thống kê chung
    const generalData = [
      ['Thống Kê Chung', 'Số Lượng'],
      ['Tổng Thợ', c || 0],
      ['Tổng Khách', d || 0],
      ['TK Bị Khóa', b || 0],
      ['ĐH Đã Hoàn Thành', e || 0],
      ['ĐH Đang Sửa', g || 0],
      ['ĐH Bị Hủy', i || 0],
      ['ĐH Chờ Thanh Toán', k || 0],
      ['ĐH Đang Chốt Giá', l || 0],
      ['Khiếu Nại Chờ Xử Lý', m || 0],
      ['Nâng Cấp Chờ Duyệt', n || 0],
      ['Tổng Chuyên Mục', o || 0],
      ['Số Dịch Vụ Đề Xuất', q || 0],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(generalData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Thống Kê Chung');

    // Sheet 2: Phân bố yêu cầu
    const requestSheetData = [
      ['Loại Yêu Cầu', 'Số Lượng', 'Tỷ Lệ (%)'],
      ...requestDetails.map(item => [
        item.type,
        item.count,
        totalRequests > 0 ? ((item.count / totalRequests) * 100).toFixed(1) : 0,
      ]),
      ['Tổng', totalRequests, '100%'],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(requestSheetData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Phân Bố Yêu Cầu');

    // Sheet 3: Thống kê người dùng
    const userSheetData = [
      ['Loại Người Dùng', 'Số Lượng', 'Tỷ Lệ (%)'],
      ...userDetails.map(item => [
        item.type,
        item.count,
        totalUsers > 0 ? ((item.count / totalUsers) * 100).toFixed(1) : 0,
      ]),
      ['Tổng', totalUsers, '100%'],
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(userSheetData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Thống Kê Người Dùng');

    // Sheet 4: Xu hướng yêu cầu hoàn thành
    const completedSheetData = [
      ['Tháng', 'Số Lượng', 'Tỷ Lệ (%)'],
      ...completedDetails.map(item => [
        item.type,
        item.count,
        totalCompleted > 0 ? ((item.count / totalCompleted) * 100).toFixed(1) : 0,
      ]),
      ['Tổng', totalCompleted, '100%'],
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(completedSheetData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Xu Hướng Hoàn Thành');

    // Sheets: Phân bố doanh thu (mỗi năm một sheet)
    const feeTypes = [
      "phí đăng kí thành viên",
      "phí hoa hồng sửa chữa",
      "phí đăng kí gói vip",
    ];
    const allYears = Object.keys(yearlyProfit).sort(); // Sắp xếp các năm

    allYears.forEach((year) => {
      const revenueSheetData = [];
      const yearlyData = yearlyProfit[year] || {};

      // Bảng chi tiết theo ngày cho từng tháng
      for (let month = 1; month <= 12; month++) {
        const monthData = yearlyData[month] || {};
        const daysInMonth = new Date(year, month, 0).getDate();

        revenueSheetData.push([`Tháng ${month}`]);
        const daysRow = ['Ngày'];
        const registrationRow = ['Phí đăng ký thợ'];
        const commissionRow = ['Phí hoa hồng sửa chữa'];
        const vipRow = ['Phí đăng ký gói VIP'];
        const dailyTotalRow = ['Tổng']; // Hàng tổng theo ngày
        let monthRegistrationTotal = 0; // Tổng phí đăng ký thợ trong tháng
        let monthCommissionTotal = 0; // Tổng phí hoa hồng sửa chữa trong tháng
        let monthVipTotal = 0; // Tổng phí đăng ký gói VIP trong tháng
        for (let day = 1; day <= daysInMonth; day++) {
          daysRow.push(day);
          const dayData = monthData[day] || { "phí đăng kí thành viên": 0, "phí hoa hồng sửa chữa": 0, "phí đăng kí gói vip": 0 };
          const registration = dayData["phí đăng kí thành viên"] || 0;
          const commission = dayData["phí hoa hồng sửa chữa"] || 0;
          const vip = dayData["phí đăng kí gói vip"] || 0;
          registrationRow.push(registration);
          commissionRow.push(commission);
          vipRow.push(vip);
          // Tính tổng theo ngày
          const dailyTotal = registration + commission + vip;
          dailyTotalRow.push(dailyTotal);
          monthRegistrationTotal += registration;
          monthCommissionTotal += commission;
          monthVipTotal += vip;
        }
        daysRow.push('Tổng');
        registrationRow.push(monthRegistrationTotal);
        commissionRow.push(monthCommissionTotal);
        vipRow.push(monthVipTotal);
        dailyTotalRow.push(monthRegistrationTotal + monthCommissionTotal + monthVipTotal);
        revenueSheetData.push(daysRow);
        revenueSheetData.push(registrationRow);
        revenueSheetData.push(commissionRow);
        revenueSheetData.push(vipRow);
        revenueSheetData.push(dailyTotalRow);
        revenueSheetData.push([]); // Dòng trống giữa các tháng
      }

      // Bảng tổng hợp theo tháng
      revenueSheetData.push(['Tổng Theo Tháng']);
      const monthsRow = ['Tháng'];
      const registrationSummaryRow = ['Phí đăng ký thợ'];
      const commissionSummaryRow = ['Phí hoa hồng sửa chữa'];
      const vipSummaryRow = ['Phí đăng ký gói VIP'];
      const monthlyTotalRow = ['Tổng']; // Hàng tổng theo tháng
      let yearRegistrationTotal = 0; // Tổng phí đăng ký thợ trong năm
      let yearCommissionTotal = 0; // Tổng phí hoa hồng sửa chữa trong năm
      let yearVipTotal = 0; // Tổng phí đăng ký gói VIP trong năm
      for (let month = 1; month <= 12; month++) {
        const monthData = yearlyData[month] || {};
        monthsRow.push(month);
        let monthRegistration = 0;
        let monthCommission = 0;
        let monthVip = 0;
        for (let day = 1; day <= 31; day++) {
          const dayData = monthData[day] || { "phí đăng kí thành viên": 0, "phí hoa hồng sửa chữa": 0, "phí đăng kí gói vip": 0 };
          monthRegistration += dayData["phí đăng kí thành viên"] || 0;
          monthCommission += dayData["phí hoa hồng sửa chữa"] || 0;
          monthVip += dayData["phí đăng kí gói vip"] || 0;
        }
        registrationSummaryRow.push(monthRegistration);
        commissionSummaryRow.push(monthCommission);
        vipSummaryRow.push(monthVip);
        // Tính tổng theo tháng
        const monthlyTotal = monthRegistration + monthCommission + monthVip;
        monthlyTotalRow.push(monthlyTotal);
        yearRegistrationTotal += monthRegistration;
        yearCommissionTotal += monthCommission;
        yearVipTotal += monthVip;
      }
      monthsRow.push('Tổng');
      registrationSummaryRow.push(yearRegistrationTotal);
      commissionSummaryRow.push(yearCommissionTotal);
      vipSummaryRow.push(yearVipTotal);
      monthlyTotalRow.push(yearRegistrationTotal + yearCommissionTotal + yearVipTotal);
      revenueSheetData.push(monthsRow);
      revenueSheetData.push(registrationSummaryRow);
      revenueSheetData.push(commissionSummaryRow);
      revenueSheetData.push(vipSummaryRow);
      revenueSheetData.push(monthlyTotalRow);

      const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
      XLSX.utils.book_append_sheet(wb, revenueSheet, `Doanh Thu ${year}`);
    });

    // Sheet: Dịch vụ theo chuyên mục
    const servicesSheetData = [
      ['Chuyên Mục', 'Số Dịch Vụ'],
      ...servicesByIndustry.map(item => [item.serviceIndustry || 'Không có tên', item.totalServices || 0]),
    ];
    const ws6 = XLSX.utils.aoa_to_sheet(servicesSheetData);
    XLSX.utils.book_append_sheet(wb, ws6, 'Dịch Vụ Theo Chuyên Mục');

    // Sheet: Dịch vụ VIP phổ biến
    const vipServiceSheetData = [
      ['Dịch Vụ VIP Phổ Biến Nhất'],
      [a || 'Không có dữ liệu'],
    ];
    const ws7 = XLSX.utils.aoa_to_sheet(vipServiceSheetData);
    XLSX.utils.book_append_sheet(wb, ws7, 'Dịch Vụ VIP');

    // Xuất file
    XLSX.writeFile(wb, `Dashboard_Summary_All_Years.xlsx`);
  };

  return (
    <div className="modern-dashboard">
      <header className="dashboard-header">
        <h1>Bảng Điều Khiển Quản Trị</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="date">Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
          <button className="export-btn" onClick={exportToExcel}>
            Xuất Excel
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {[
          { title: "Tổng Thợ", value: c, icon: "👨‍🔧" },
          { title: "Tổng Khách", value: d, icon: "👥" },
          { title: "TK Bị Khóa", value: b, icon: "🔒" },
          { title: "ĐH đã hoàn thành", value: e, icon: "✅" },
          { title: "ĐH đang sửa", value: g, icon: "🔧" },
          { title: "ĐH bị hủy", value: i, icon: "❌" },
          { title: "ĐH chờ thanh toán", value: k, icon: "💳" },
          { title: "ĐH đang chốt giá", value: l, icon: "💲" },
          { title: "Khiếu nại chờ xử lý", value: m, icon: "⚠️" },
          { title: "Nâng cấp chờ duyệt", value: n, icon: "⏳" },
          { title: "Tổng Chuyên Mục", value: o, icon: "📋" },
          { title: "Số dịch vụ đề xuất", value: q, icon: "💡" },
        ].map((item, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="card-value">{item.value || 0}</p>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-container doughnut-chart" onClick={() => setShowRequestModal(true)}>
          <h2>Tỷ lệ tình trạng đơn hàng</h2>
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

        <div className="chart-container doughnut-chart">
          <h2>Phân Bố Doanh Thu</h2>
          <div className="filter-options">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
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
                    const totalInMillions = (totalRevenue / 1000000).toFixed(2);
                    ctx.fillText(`${totalInMillions} triệu`, centerX, centerY);
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
          title={`Chi Tiết Doanh Thu Tháng ${selectedMonth}/${selectedYear}`}
          barData={getBarData(revenueDetails)}
          tableData={revenueDetails}
          total={totalRevenue}
          columns={['Loại Phí', 'Doanh Thu', 'Tỷ Lệ']}
        />
      </div>

      <section className="services-section">
        <h2>Tổng số danh mục theo từng chuyên mục sửa chữa</h2>
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

      <section className="services-section" style={{ marginTop: '20px' }}>
        <h2>Dịch vụ đề xuất đang được sử dụng nhiều nhất</h2>
        <div className="services-list">
          {a}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;