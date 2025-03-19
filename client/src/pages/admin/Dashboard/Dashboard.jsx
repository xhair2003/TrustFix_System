import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalUsers: a   ,
    totalBannedUsers: b  ,
    totalRepairmen: c  ,
    totalCustomers: d ,
    totalCompletedRequests:e  ,
    totalConfirmedRequests: f  ,
    totalPendingRequests: g  ,
    totalCancelledRequests: i  ,
    totalMakePaymentRequests: k  ,
    totalDealPriceRequests: l  ,
    totalPendingComplaints:m  ,
    totalPendingUpgradeRequests:n  ,
    totalServiceIndustries: o  ,
    totalServicesByIndustry: p  ,
    totalServicePrices:q  ,
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

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Bảng Điều Khiển Quản Trị</h1>
      <div className="admin-dashboard__grid">
        <div className="admin-dashboard__card">
          <h3>Tổng thợ</h3>
          <p>{c}</p>
        </div>
        <div className="admin-dashboard__card">
          <h3>Tổng khách</h3>
          <p>{d}</p>
        </div>
        <div className="admin-dashboard__card">
          <h3>Tổng TK bị khóa</h3>
          <p>{b}</p>
        </div>
        {/* <div className="admin-dashboard__card">
          <h3>Yêu cầu hoàn thành</h3>
          <p>{e}</p>
        </div> */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu đã xác nhận</h3>
          <p>{f}</p>
        </div>
        <div className="admin-dashboard__card">
          <h3>Yêu cầu đang chờ</h3>
          <p>{c}</p>
        </div>
        {/* <div className="admin-dashboard__card">
          <h3>Yêu cầu đã hủy</h3>
          <p>{g}</p>
        </div> */}
        <div className="admin-dashboard__card">
          <h3>Yêu cầu thanh toán</h3>
          <p>{k}</p>
        </div>
        {/* <div className="admin-dashboard__card">
          <h3>Yêu cầu thương lượng giá</h3>
          <p>{l}</p>
        </div> */}
        <div className="admin-dashboard__card">
          <h3>Khiếu nại đang chờ</h3>
          <p>{m}</p>
        </div>
        <div className="admin-dashboard__card">
          <h3>Yêu cầu nâng cấp đang chờ</h3>
          <p>{n}</p>
        </div>
        {/* <div className="admin-dashboard__card">
          <h3>Tổng chuyên mục</h3>
          <p>{p}</p>
        </div> */}
        <div className="admin-dashboard__card">
          <h3>Tổng danh mục</h3>
          <p>{q}</p>
        </div>
      </div>
      {/* <div className="admin-dashboard__section">
        <h2>Dịch vụ theo ngành</h2>
        <div className="admin-dashboard__list">
          {Array.isArray( totalServicesByIndustry) &&  totalServicesByIndustry.length > 0 ? (
             totalServicesByIndustry.map((item, index) => (
              <div key={index} className="admin-dashboard__list-item">
                <span>{item.name || 'Không có tên'}</span>
                <span>{item.count || 0}</span>
              </div>
            ))
          ) : (
            <p>Không có dữ liệu dịch vụ theo ngành.</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;