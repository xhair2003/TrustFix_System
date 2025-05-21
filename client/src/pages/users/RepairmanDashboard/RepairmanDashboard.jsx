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
  //console.log('requestStatusByMonth:', requestStatusByMonth);
  //console.log('requestStatusByYear:', requestStatusByYear);

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
    (sum, item) => sum + (item.Completed || 0),
    0
  );
  const totalCancelled = (viewMode === 'month' ? requestStatusByMonth : requestStatusByYear || []).reduce(
    (sum, item) => sum + (item.Cancelled || 0),
    0
  );

  // Hàm xuất Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Sheet "Doanh Thu [Year]"
    const revenueSheetData = [];
    if (viewMode === 'month') {
      // Bảng chi tiết theo ngày trong tháng được chọn
      revenueSheetData.push([`Tháng ${selectedMonth}/${selectedYear}`]);
      const daysRow = ['Ngày'];
      const revenueRow = ['Doanh thu'];
      const dailyTotalRow = ['Tổng'];
      let monthRevenueTotal = 0;
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        daysRow.push(day);
        const revenueItem = (revenueByTime || []).find((r) => r.day === day) || { totalRevenue: 0 };
        const totalRevenue = revenueItem.totalRevenue || 0;
        revenueRow.push(totalRevenue);
        dailyTotalRow.push(totalRevenue);
        monthRevenueTotal += totalRevenue;
      }
      daysRow.push('Tổng');
      revenueRow.push(monthRevenueTotal);
      dailyTotalRow.push(monthRevenueTotal);
      revenueSheetData.push(daysRow);
      revenueSheetData.push(revenueRow);
      revenueSheetData.push(dailyTotalRow);
    } else {
      // Bảng chi tiết theo tháng trong năm được chọn
      revenueSheetData.push([`Năm ${selectedYear}`]);
      const monthsRow = ['Tháng'];
      const revenueRow = ['Doanh thu'];
      const monthlyTotalRow = ['Tổng'];
      let yearRevenueTotal = 0;

      for (let month = 1; month <= 12; month++) {
        monthsRow.push(month);
        const revenueItem = (revenueByTime || []).find((r) => r.month === month) || { totalRevenue: 0 };
        const totalRevenue = revenueItem.totalRevenue || 0;
        revenueRow.push(totalRevenue);
        monthlyTotalRow.push(totalRevenue);
        yearRevenueTotal += totalRevenue;
      }
      monthsRow.push('Tổng');
      revenueRow.push(yearRevenueTotal);
      monthlyTotalRow.push(yearRevenueTotal);
      revenueSheetData.push(monthsRow);
      revenueSheetData.push(revenueRow);
      revenueSheetData.push(monthlyTotalRow);
    }

    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
    XLSX.utils.book_append_sheet(wb, revenueSheet, `Doanh Thu ${selectedYear}`);

    // 2. Sheet "Đơn Hàng [Year]"
    const ordersSheetData = [];
    const ordersData = viewMode === 'month' ? requestStatusByMonth : requestStatusByYear;

    if (viewMode === 'month') {
      // Bảng chi tiết theo ngày trong tháng được chọn
      ordersSheetData.push([`Tháng ${selectedMonth}/${selectedYear}`]);
      const daysRow = ['Ngày'];
      const completedRow = ['Hoàn Thành'];
      const cancelledRow = ['Hủy'];
      const dailyTotalRow = ['Tổng'];
      let monthCompletedTotal = 0;
      let monthCancelledTotal = 0;
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        daysRow.push(day);
        const requestItem = (ordersData || []).find((r) => r.day === day) || { Completed: 0, Cancelled: 0 };
        const completed = requestItem.Completed || 0;
        const cancelled = requestItem.Cancelled || 0;
        completedRow.push(completed);
        cancelledRow.push(cancelled);
        const dailyTotal = completed + cancelled;
        dailyTotalRow.push(dailyTotal);
        monthCompletedTotal += completed;
        monthCancelledTotal += cancelled;
      }
      daysRow.push('Tổng');
      completedRow.push(monthCompletedTotal);
      cancelledRow.push(monthCancelledTotal);
      dailyTotalRow.push(monthCompletedTotal + monthCancelledTotal);
      ordersSheetData.push(daysRow);
      ordersSheetData.push(completedRow);
      ordersSheetData.push(cancelledRow);
      ordersSheetData.push(dailyTotalRow);
    } else {
      // Bảng chi tiết theo tháng trong năm được chọn
      ordersSheetData.push([`Năm ${selectedYear}`]);
      const monthsRow = ['Tháng'];
      const completedRow = ['Hoàn Thành'];
      const cancelledRow = ['Hủy'];
      const monthlyTotalRow = ['Tổng'];
      let yearCompletedTotal = 0;
      let yearCancelledTotal = 0;

      for (let month = 1; month <= 12; month++) {
        monthsRow.push(month);
        const requestItem = (ordersData || []).find((r) => r.month === month) || { Completed: 0, Cancelled: 0 };
        const completed = requestItem.Completed || 0;
        const cancelled = requestItem.Cancelled || 0;
        completedRow.push(completed);
        cancelledRow.push(cancelled);
        const monthlyTotal = completed + cancelled;
        monthlyTotalRow.push(monthlyTotal);
        yearCompletedTotal += completed;
        yearCancelledTotal += cancelled;
      }
      monthsRow.push('Tổng');
      completedRow.push(yearCompletedTotal);
      cancelledRow.push(yearCancelledTotal);
      monthlyTotalRow.push(yearCompletedTotal + yearCancelledTotal);
      ordersSheetData.push(monthsRow);
      ordersSheetData.push(completedRow);
      ordersSheetData.push(cancelledRow);
      ordersSheetData.push(monthlyTotalRow);
    }

    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);
    XLSX.utils.book_append_sheet(wb, ordersSheet, `Đơn Hàng ${selectedYear}`);

    XLSX.writeFile(wb, 'Repairman_Dashboard_Stats.xlsx');
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