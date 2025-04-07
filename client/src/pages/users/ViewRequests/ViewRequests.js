import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  viewRequest,
  viewCustomerRequest,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import socket from "../../../socket";
import "./ViewRequests.css";
import useWebSocketNotifications from "../../../utils/hook/useWebSocketNotifications";

const ViewRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user_id) || localStorage.getItem('user_id');
  const {
    loading,
    request,
    errorViewRequest,
    customerRequest,
    successRequest,
    errorRequest,
  } = useSelector((state) => state.user);

  //console.log("request", request);

  // Load dữ liệu ban đầu
  useEffect(() => {
    dispatch(viewRequest());
    dispatch(viewCustomerRequest());
  }, [dispatch]);

  // Sử dụng custom hook để lắng nghe newRequest
  useWebSocketNotifications();

  // Lắng nghe repairmanAssigned riêng trong ViewRequests
  useEffect(() => {
    if (!userId) {
      console.warn("User ID not found, WebSocket notifications will not be set up.");
      return;
    }

    // Chỉ cần lắng nghe sự kiện, không cần join/leave vì socket.js đã xử lý
    const handleRepairmanAssigned = () => {
      //console.log("Repairman assigned received for user:", userId);
      dispatch(viewCustomerRequest());
      Swal.fire({
        icon: "success",
        title: "Đơn hàng được giao",
        text: "Bạn đã được giao một đơn hàng sửa chữa!",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    };

    socket.on("repairmanAssigned", handleRepairmanAssigned);

    socket.on('connect', () => console.log('WebSocket connected:', socket.id));
    socket.on('connect_error', (err) => console.error('WebSocket connect error:', err));

    // Cleanup: Hủy lắng nghe khi component unmount
    return () => {
      socket.off("repairmanAssigned", handleRepairmanAssigned);
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [dispatch, userId]);

  // useEffect(() => {
  //     if (successRequest) {
  //         Swal.fire({
  //             icon: "success",
  //             title: "Thành công",
  //             text: successRequest,
  //             timer: 5000,
  //             timerProgressBar: true,
  //             showConfirmButton: false,
  //             showCloseButton: false,
  //         }).then(() => {
  //             dispatch(resetSuccess()); // Reset customer request state
  //         });
  //     }
  // }, [successRequest, dispatch]);

  // Handle errorViewRequest with Swal
  useEffect(() => {
    if (errorRequest) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorRequest,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      }).then(() => {
        dispatch(resetError()); // Reset view request state
      });
    }
  }, [errorRequest, dispatch]);

  useEffect(() => {
    if (errorViewRequest) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorViewRequest,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: false,
      }).then(() => {
        dispatch(resetError());
      });
    }
  }, [errorViewRequest, dispatch]);

  const shortenAddress = (address) => {
    const parts = address.split(", ");
    return parts.slice(1, 4).join(", ");
  };

  const handleViewRequestDetail = (requestData, status) => {
    navigate(`/repairman/detail-request/${requestData._id}`, {
      state: { requestData, status },
    });
  };

  const handleViewCustomerRequestDetail = (customerRequest) => {
    navigate(`/repairman/order-detail/${customerRequest._id}`, {
      state: { customerRequest },
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="repairman-requests-container">
      <h2 className="page-title">Danh sách đơn sửa chữa</h2>

      {/* Display customerRequest if it exists */}
      {customerRequest && customerRequest.status === "Proceed with repair" ? (
        <div className="request-card active-request">
          <div className="request-header">
            <h3 className="request-title">Đơn hàng đang thực hiện</h3>
            <span className="request-status active">Thực hiện sửa chữa</span>
          </div>
          <p>
            <strong>Mô tả:</strong>{" "}
            {customerRequest.description || "Không có mô tả"}
          </p>
          <p>
            <strong>Khu vực:</strong> {shortenAddress(customerRequest.address)}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(customerRequest.createdAt).toLocaleString()}
          </p>
          <button
            className="view-detail-button"
            onClick={() => handleViewCustomerRequestDetail(customerRequest)}
          >
            Xem chi tiết
          </button>
        </div>
      ) : request && request.status === "Deal price" ? (
        <div className="request-card">
          <div className="request-header">
            <h3 className="request-title">Đơn hàng chờ chốt giá</h3>
            <span className="request-status">Chờ bạn chốt giá</span>
          </div>
          <p>
            <strong>Mô tả:</strong> {request.description}
          </p>
          <p>
            <strong>Khu vực:</strong> {shortenAddress(request.address)}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(request.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Vùng giá:</strong>{" "}
            {request.minPrice?.toLocaleString() || "N/A"} -{" "}
            {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
          </p>
          <button
            className="view-detail-button"
            onClick={() => handleViewRequestDetail(request, true)}
          >
            Xem chi tiết
          </button>
        </div>
      ) : request && request.status === "Done deal price" ? (
        <div className="request-card">
          <div className="request-header">
            <h3 className="request-title">Đơn hàng chờ khách hàng xác nhận</h3>
            <span className="request-status">Đã chốt giá</span>
          </div>
          <p>
            <strong>Mô tả:</strong> {request.description}
          </p>
          <p>
            <strong>Khu vực:</strong> {shortenAddress(request.address)}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(request.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Vùng giá:</strong>{" "}
            {request.minPrice?.toLocaleString() || "N/A"} -{" "}
            {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
          </p>
          <button
            className="view-detail-button"
            onClick={() => handleViewRequestDetail(request, false)}
          >
            Xem chi tiết
          </button>
        </div>
      ) : (
        <p className="no-requests">Không có đơn sửa chữa nào.</p>
      )}
    </div>
  );
};

export default ViewRequests;
