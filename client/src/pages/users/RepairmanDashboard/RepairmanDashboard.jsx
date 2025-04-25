// import React, { useEffect, useState } from 'react';
// import './RepairmanDashboard.css';
// import { useDispatch, useSelector } from 'react-redux';
// import Loading from '../../../component/Loading/Loading';
// import Swal from 'sweetalert2';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import * as XLSX from 'xlsx';
// import {
//   getRevenueByTime,
//   getRequestStatusByMonth,
//   getRequestStatusByYear,
//   resetError,
// } from '../../../store/actions/userActions';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const RepairmanDashboard = () => {
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [viewMode, setViewMode] = useState('month'); // 'month' hoặc 'year'
//   const [showModal, setShowModal] = useState(null);

//   const dispatch = useDispatch();
//   const { revenueByTime, requestStatusByMonth, requestStatusByYear, loading, error } = useSelector(
//     (state) => state.user
//   );

//   useEffect(() => {
//     if (viewMode === 'month') {
//       dispatch(getRevenueByTime('month', selectedYear, selectedMonth));
//       dispatch(getRequestStatusByMonth(selectedYear, selectedMonth));
//     } else {
//       dispatch(getRevenueByTime('year', selectedYear));
//       dispatch(getRequestStatusByYear(selectedYear));
//     }
//   }, [dispatch, selectedMonth, selectedYear, viewMode]);

//   useEffect(() => {
//     if (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Lỗi',
//         text: error,
//         timer: 5000,
//         timerProgressBar: true,
//         showConfirmButton: false,
//       });
//       dispatch(resetError());
//     }
//   }, [error, dispatch]);

//   if (loading) {
//     return <Loading />;
//   }

//   const months = Array.from({ length: 12 }, (_, i) => i + 1);
//   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

//   // Chuẩn bị dữ liệu cho biểu đồ doanh thu
//   const revenueChartData = {
//     labels: viewMode === 'month'
//       ? (revenueByTime || []).map((item) => `Ngày ${item.day}`)
//       : (revenueByTime || []).map((item) => `Tháng ${item.month}`),
//     datasets: [
//       {
//         label: 'Doanh thu (VNĐ)',
//         data: (revenueByTime || []).map((item) => item.totalRevenue),
//         backgroundColor: '#3498db',
//         borderRadius: 5,
//       },
//     ],
//   };

//   // Chuẩn bị dữ liệu cho biểu đồ đơn hàng
//   const ordersChartData = {
//     labels: viewMode === 'month'
//       ? (requestStatusByMonth || []).map((item) => `Ngày ${item.day}`)
//       : (requestStatusByYear || []).map((item) => `Tháng ${item.month}`),
//     datasets: [
//       {
//         label: 'Hoàn thành',
//         data: viewMode === 'month'
//           ? (requestStatusByMonth || []).map((item) => item.Completed)
//           : (requestStatusByYear || []).map((item) => item.Completed),
//         backgroundColor: '#27ae60',
//         borderRadius: 5,
//       },
//       {
//         label: 'Hủy',
//         data: viewMode === 'month'
//           ? (requestStatusByMonth || []).map((item) => item.Cancelled)
//           : (requestStatusByYear || []).map((item) => item.Cancelled),
//         backgroundColor: '#e74c3c',
//         borderRadius: 5,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: {
//         display: true,
//         text:
//           viewMode === 'month'
//             ? `Thống kê chi tiết tháng ${selectedMonth}/${selectedYear}`
//             : `Thống kê chi tiết năm ${selectedYear}`,
//       },
//     },
//     scales: {
//       y: { beginAtZero: true },
//     },
//   };

//   // Tính tổng doanh thu và đơn hàng
//   const totalRevenue = (revenueByTime || []).reduce((sum, item) => sum + item.totalRevenue, 0);
//   const totalCompleted = (viewMode === 'month' ? requestStatusByMonth : requestStatusByYear || []).reduce(
//     (sum, item) => sum + item.Completed,
//     0
//   );
//   const totalCancelled = (viewMode === 'month' ? requestStatusByMonth : requestStatusByYear || []).reduce(
//     (sum, item) => sum + item.Cancelled,
//     0
//   );

//   // Hàm xuất Excel
//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();

//     // Sheet 1: Doanh Thu
//     const revenueData = [
//       [
//         viewMode === 'month' ? 'Ngày' : 'Tháng',
//         'Doanh Thu (VNĐ)',
//       ],
//       ...(viewMode === 'month'
//         ? (revenueByTime || []).map((item) => [
//           `Ngày ${item.day}`,
//           item.totalRevenue,
//         ])
//         : (revenueByTime || []).map((item) => [
//           `Tháng ${item.month}`,
//           item.totalRevenue,
//         ])),
//       ['Tổng', totalRevenue],
//     ];
//     const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
//     XLSX.utils.book_append_sheet(wb, revenueSheet, 'Doanh Thu');

//     // Sheet 2: Đơn Hàng
//     const ordersData = [
//       [
//         viewMode === 'month' ? 'Ngày' : 'Tháng',
//         'Hoàn Thành',
//         'Hủy',
//       ],
//       ...(viewMode === 'month'
//         ? (requestStatusByMonth || []).map((item) => [
//           `Ngày ${item.day}`,
//           item.Completed,
//           item.Cancelled,
//         ])
//         : (requestStatusByYear || []).map((item) => [
//           `Tháng ${item.month}`,
//           item.Completed,
//           item.Cancelled,
//         ])),
//       ['Tổng', totalCompleted, totalCancelled],
//     ];
//     const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
//     XLSX.utils.book_append_sheet(wb, ordersSheet, 'Đơn Hàng');

//     // Xuất file
//     XLSX.writeFile(
//       wb,
//       `Repairman_Dashboard_${viewMode === 'month' ? `Month_${selectedMonth}_${selectedYear}` : `Year_${selectedYear}`}.xlsx`
//     );
//   };

//   return (
//     <div className="history-container">
//       <div className="history-form">
//         <h2 className="complaint-title">DASHBOARD CHO THỢ</h2>

//         <div className="repairman-dashboard-filters">
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(Number(e.target.value))}
//             className="repairman-dashboard-select"
//             disabled={viewMode === 'year'}
//           >
//             {months.map((month) => (
//               <option key={month} value={month}>
//                 Tháng {month}
//               </option>
//             ))}
//           </select>
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(Number(e.target.value))}
//             className="repairman-dashboard-select"
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 Năm {year}
//               </option>
//             ))}
//           </select>
//           <select
//             value={viewMode}
//             onChange={(e) => setViewMode(e.target.value)}
//             className="repairman-dashboard-select"
//           >
//             <option value="month">Theo tháng</option>
//             <option value="year">Theo năm</option>
//           </select>
//           <button onClick={exportToExcel} className="repairman-dashboard-export-btn">
//             Xuất Excel
//           </button>
//         </div>

//         <div className="repairman-dashboard-container">
//           <div className="repairman-dashboard-card" onClick={() => setShowModal('revenue')}>
//             <h3 className="repairman-dashboard-card-title">Doanh Thu</h3>
//             <div className="repairman-dashboard-stats">
//               <div className="repairman-dashboard-stat-item">
//                 <span>{viewMode === 'month' ? 'Tháng' : 'Năm'}:</span>
//                 <span className="repairman-dashboard-value">
//                   {totalRevenue.toLocaleString('vi-VN')} VNĐ
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="repairman-dashboard-card" onClick={() => setShowModal('orders')}>
//             <h3 className="repairman-dashboard-card-title">Đơn Hàng</h3>
//             <div className="repairman-dashboard-stats">
//               <div className="repairman-dashboard-stat-item">
//                 <span>Hoàn thành ({viewMode === 'month' ? 'Tháng' : 'Năm'}):</span>
//                 <span className="repairman-dashboard-value">
//                   {totalCompleted} đơn
//                 </span>
//               </div>
//               <div className="repairman-dashboard-stat-item">
//                 <span>Hủy ({viewMode === 'month' ? 'Tháng' : 'Năm'}):</span>
//                 <span className="repairman-dashboard-value repairman-dashboard-cancelled">
//                   {totalCancelled} đơn
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showModal && (
//           <div className="repairman-dashboard-modal">
//             <div className="repairman-dashboard-modal-content">
//               <button
//                 className="repairman-dashboard-modal-close"
//                 onClick={() => setShowModal(null)}
//               >
//                 ×
//               </button>
//               {showModal === 'revenue' ? (
//                 <Bar data={revenueChartData} options={chartOptions} />
//               ) : (
//                 <Bar data={ordersChartData} options={chartOptions} />
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RepairmanDashboard;


import React, { useEffect, useState } from 'react';
import './RepairmanDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../component/Loading/Loading';
import Swal from 'sweetalert2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as XLSX from 'xlsx';
import {
  getRevenueByTime,
  getRequestStatusByMonth,
  getRequestStatusByYear,
  getAllRepairmanStats,
  resetError,
} from '../../../store/actions/userActions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RepairmanDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('month');
  const [showModal, setShowModal] = useState(null);

  const dispatch = useDispatch();
  const { revenueByTime, requestStatusByMonth, requestStatusByYear, allStats, loading, error } = useSelector(
    (state) => state.user
  );
  //console.log('allStats:', allStats);

  useEffect(() => {
    dispatch(getAllRepairmanStats());
    if (viewMode === 'month') {
      dispatch(getRevenueByTime('month', selectedYear, selectedMonth));
      dispatch(getRequestStatusByMonth(selectedYear, selectedMonth));
    } else {
      dispatch(getRevenueByTime('year', selectedYear));
      dispatch(getRequestStatusByYear(selectedYear));
    }
  }, [dispatch, selectedMonth, selectedYear, viewMode]);

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

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const revenueChartData = {
    labels: viewMode === 'month'
      ? (revenueByTime || []).map((item) => `Ngày ${item.day}`)
      : (revenueByTime || []).map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: (revenueByTime || []).map((item) => item.totalRevenue),
        backgroundColor: '#3498db',
        borderRadius: 5,
      },
    ],
  };

  const ordersChartData = {
    labels: viewMode === 'month'
      ? (requestStatusByMonth || []).map((item) => `Ngày ${item.day}`)
      : (requestStatusByYear || []).map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Hoàn thành',
        data: viewMode === 'month'
          ? (requestStatusByMonth || []).map((item) => item.Completed)
          : (requestStatusByYear || []).map((item) => item.Completed),
        backgroundColor: '#27ae60',
        borderRadius: 5,
      },
      {
        label: 'Hủy',
        data: viewMode === 'month'
          ? (requestStatusByMonth || []).map((item) => item.Cancelled)
          : (requestStatusByYear || []).map((item) => item.Cancelled),
        backgroundColor: '#e74c3c',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text:
          viewMode === 'month'
            ? `Thống kê chi tiết tháng ${selectedMonth}/${selectedYear}`
            : `Thống kê chi tiết năm ${selectedYear}`,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const totalRevenue = (revenueByTime || []).reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalCompleted = (viewMode === 'month' ? requestStatusByMonth : requestStatusByYear || []).reduce(
    (sum, item) => sum + (item.Completed || 0), // Thêm kiểm tra mặc định 0
    0
  );
  const totalCancelled = (viewMode === 'month' ? requestStatusByMonth : requestStatusByYear || []).reduce(
    (sum, item) => sum + (item.Cancelled || 0), // Thêm kiểm tra mặc định 0
    0
  );

  // Hàm xuất Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.keys(allStats || {}).forEach((year) => {
      const yearData = allStats[year];

      // 1. Sheet "Doanh Thu [Year]"
      const revenueSheetData = [];
      for (let month = 1; month <= 12; month++) {
        const monthData = yearData[month] || { revenue: [] };
        const daysInMonth = new Date(year, month, 0).getDate();

        // Bảng chi tiết theo ngày (theo đường ngang)
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
          const revenueItem = monthData.revenue.find((r) => r.day === day) || { registrationFee: 0, commissionFee: 0, vipFee: 0 };
          const registration = revenueItem.registrationFee || 0;
          const commission = revenueItem.commissionFee || 0;
          const vip = revenueItem.vipFee || 0;
          registrationRow.push(registration);
          commissionRow.push(commission);
          vipRow.push(vip);
          // Tính tổng theo ngày (tổng các loại phí trong ngày)
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
        dailyTotalRow.push(monthRegistrationTotal + monthCommissionTotal + monthVipTotal); // Tổng tất cả phí trong tháng
        revenueSheetData.push(daysRow);
        revenueSheetData.push(registrationRow);
        revenueSheetData.push(commissionRow);
        revenueSheetData.push(vipRow);
        revenueSheetData.push(dailyTotalRow);
        revenueSheetData.push([]); // Dòng trống giữa các tháng
      }

      // Bảng tổng hợp theo tháng (theo đường ngang)
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
        const monthData = yearData[month] || { revenue: [] };
        monthsRow.push(month);
        const monthRegistration = monthData.revenue.reduce((sum, item) => sum + (item.registrationFee || 0), 0);
        const monthCommission = monthData.revenue.reduce((sum, item) => sum + (item.commissionFee || 0), 0);
        const monthVip = monthData.revenue.reduce((sum, item) => sum + (item.vipFee || 0), 0);
        registrationSummaryRow.push(monthRegistration);
        commissionSummaryRow.push(monthCommission);
        vipSummaryRow.push(monthVip);
        // Tính tổng theo tháng (tổng các loại phí trong tháng)
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
      monthlyTotalRow.push(yearRegistrationTotal + yearCommissionTotal + yearVipTotal); // Tổng tất cả phí trong năm
      revenueSheetData.push(monthsRow);
      revenueSheetData.push(registrationSummaryRow);
      revenueSheetData.push(commissionSummaryRow);
      revenueSheetData.push(vipSummaryRow);
      revenueSheetData.push(monthlyTotalRow);

      const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
      XLSX.utils.book_append_sheet(wb, revenueSheet, `Doanh Thu ${year}`);

      // 2. Sheet "Đơn Hàng [Year]"
      const ordersSheetData = [];
      for (let month = 1; month <= 12; month++) {
        const monthData = yearData[month] || { requests: [] };
        const daysInMonth = new Date(year, month, 0).getDate();

        // Bảng chi tiết theo ngày (theo đường ngang)
        ordersSheetData.push([`Tháng ${month}`]);
        const daysRow = ['Ngày'];
        const completedRow = ['Hoàn Thành'];
        const cancelledRow = ['Hủy'];
        const dailyTotalRow = ['Tổng']; // Hàng tổng theo ngày
        let monthCompletedTotal = 0; // Tổng đơn hoàn thành trong tháng
        let monthCancelledTotal = 0; // Tổng đơn hủy trong tháng
        for (let day = 1; day <= daysInMonth; day++) {
          daysRow.push(day);
          const requestItem = monthData.requests.find((r) => r.day === day) || { Completed: 0, Cancelled: 0 };
          const completed = requestItem.Completed !== undefined ? requestItem.Completed : 0;
          const cancelled = requestItem.Cancelled !== undefined ? requestItem.Cancelled : 0;
          completedRow.push(completed);
          cancelledRow.push(cancelled);
          // Tính tổng theo ngày (Hoàn Thành + Hủy)
          const dailyTotal = completed + cancelled;
          dailyTotalRow.push(dailyTotal);
          monthCompletedTotal += completed;
          monthCancelledTotal += cancelled;
        }
        daysRow.push('Tổng');
        completedRow.push(monthCompletedTotal);
        cancelledRow.push(monthCancelledTotal);
        dailyTotalRow.push(monthCompletedTotal + monthCancelledTotal); // Tổng tất cả đơn trong tháng
        ordersSheetData.push(daysRow);
        ordersSheetData.push(completedRow);
        ordersSheetData.push(cancelledRow);
        ordersSheetData.push(dailyTotalRow);
        ordersSheetData.push([]); // Dòng trống giữa các tháng
      }

      // Bảng tổng hợp theo tháng (theo đường ngang)
      ordersSheetData.push(['Tổng Theo Tháng']);
      const ordersMonthsRow = ['Tháng'];
      const ordersCompletedRow = ['Hoàn Thành'];
      const ordersCancelledRow = ['Hủy'];
      const ordersMonthlyTotalRow = ['Tổng']; // Hàng tổng theo tháng
      let yearCompletedTotal = 0; // Tổng đơn hoàn thành trong năm
      let yearCancelledTotal = 0; // Tổng đơn hủy trong năm
      for (let month = 1; month <= 12; month++) {
        const monthData = yearData[month] || { requests: [] };
        ordersMonthsRow.push(month);
        const monthCompleted = monthData.requests.reduce((sum, item) => sum + (item.Completed || 0), 0);
        const monthCancelled = monthData.requests.reduce((sum, item) => sum + (item.Cancelled || 0), 0);
        ordersCompletedRow.push(monthCompleted);
        ordersCancelledRow.push(monthCancelled);
        // Tính tổng theo tháng (Hoàn Thành + Hủy)
        const monthlyTotal = monthCompleted + monthCancelled;
        ordersMonthlyTotalRow.push(monthlyTotal);
        yearCompletedTotal += monthCompleted;
        yearCancelledTotal += monthCancelled;
      }
      ordersMonthsRow.push('Tổng');
      ordersCompletedRow.push(yearCompletedTotal);
      ordersCancelledRow.push(yearCancelledTotal);
      ordersMonthlyTotalRow.push(yearCompletedTotal + yearCancelledTotal); // Tổng tất cả đơn trong năm
      ordersSheetData.push(ordersMonthsRow);
      ordersSheetData.push(ordersCompletedRow);
      ordersSheetData.push(ordersCancelledRow);
      ordersSheetData.push(ordersMonthlyTotalRow);

      const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);
      XLSX.utils.book_append_sheet(wb, ordersSheet, `Đơn Hàng ${year}`);
    });

    XLSX.writeFile(wb, 'Repairman_Dashboard_Full_Stats.xlsx');
  };

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">THỐNG KÊ</h2>

        <div className="repairman-dashboard-filters">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="repairman-dashboard-select"
            disabled={viewMode === 'year'}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                Tháng {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="repairman-dashboard-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="repairman-dashboard-select"
          >
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
          <button onClick={exportToExcel} className="repairman-dashboard-export-btn">
            Xuất file thống kê
          </button>
        </div>

        <div className="repairman-dashboard-container">
          <div className="repairman-dashboard-card" onClick={() => setShowModal('revenue')}>
            <h3 className="repairman-dashboard-card-title">Doanh Thu</h3>
            <div className="repairman-dashboard-stats">
              <div className="repairman-dashboard-stat-item">
                <span>{viewMode === 'month' ? 'Tháng' : 'Năm'}:</span>
                <span className="repairman-dashboard-value">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>

          <div className="repairman-dashboard-card" onClick={() => setShowModal('orders')}>
            <h3 className="repairman-dashboard-card-title">Đơn Hàng</h3>
            <div className="repairman-dashboard-stats">
              <div className="repairman-dashboard-stat-item">
                <span>Hoàn thành ({viewMode === 'month' ? 'Tháng' : 'Năm'}):</span>
                <span className="repairman-dashboard-value">
                  {totalCompleted} đơn
                </span>
              </div>
              <div className="repairman-dashboard-stat-item">
                <span>Hủy ({viewMode === 'month' ? 'Tháng' : 'Năm'}):</span>
                <span className="repairman-dashboard-value repairman-dashboard-cancelled">
                  {totalCancelled} đơn
                </span>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="repairman-dashboard-modal">
            <div className="repairman-dashboard-modal-content">
              <button
                className="repairman-dashboard-modal-close"
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