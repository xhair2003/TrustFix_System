import React, { useState, useEffect } from "react";
import "./ViewRepairBooking.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRepairBookingHistory, resetError
} from "../../../store/actions/adminActions";

const ViewRepairBooking = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  console.log(selectedOrder);
  // Redux state
  const dispatch = useDispatch();
  const { repairBookingHistory, loading, errorRepairBookingHistory } = useSelector(state => state.admin);

  // Fetch repair booking history when the component mounts
  useEffect(() => {
    dispatch(fetchRepairBookingHistory());
  }, [dispatch]);

  useEffect(() => {
    if (errorRepairBookingHistory) {
      Swal.fire({
        title: "Lỗi",
        text: errorRepairBookingHistory,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }
  }, [dispatch, errorRepairBookingHistory]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Function to format date
  const formatDateTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // Filter orders based on search term, status, and date
  const filteredOrders = repairBookingHistory.filter((order) => {
    const orderDate = new Date(order.updatedAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    const fullName = order.user_id ? `${order.user_id.firstName} ${order.user_id.lastName}` : "";
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    const matchesDate =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="view-booking-repair-order-container">
      <div className="view-booking-repair-order-form">
        <h2 className="view-booking-repair-order-title">XEM LỊCH SỬ SỬA CHỮA</h2>

        <div className="view-booking-repair-filter-section">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="view-booking-repair-search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="view-booking-repair-status-filter"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Completed">Đã hoàn thành</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Pending">Đang chờ xử lý</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Requesting Details">Yêu cầu chi tiết</option>
            <option value="Deal price">Thỏa thuận giá</option>
            <option value="Done deal price">Đã chốt giá</option>
            <option value="Make payment">Chờ thanh toán</option>
            <option value="Repairman confirmed completion">Thợ xác nhận hoàn thành</option>
            <option value="Proceed with repair">Tiến hành sửa chữa</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="view-booking-repair-date-filter"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="view-booking-repair-date-filter"
          />
        </div>

        <div className="view-booking-repair-order-table-container">
          <table className="view-booking-repair-order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Ngày hoàn thành</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="view-booking-repair-order-item"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="view-booking-repair-order-item-id">{order._id || "không xác định"}</td>
                  <td className="view-booking-repair-order-item-date">{formatDateTime(order.createdAt) || "Không xác định"}</td>
                  <td className="view-booking-repair-order-item-complete">{formatDateTime(order.updatedAt) || "Không xác định"}</td>
                  <td className="view-booking-repair-order-item-price">{order.priceRange || 0}</td>
                  <td>
                    <span
                      className={`view-booking-repair-order-item-status view-booking-repair-order-status-${order.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {
                        order.status === "Completed" ? "Đã hoàn thành" :
                        order.status === "Confirmed" ? "Đã xác nhận" :
                        order.status === "Pending" ? "Đang chờ xử lý" :
                        order.status === "Cancelled" ? "Đã hủy" :
                        order.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                        order.status === "Deal price" ? "Thỏa thuận giá" :
                        order.status === "Done deal price" ? "Đã chốt giá" :
                        order.status === "Make payment" ? "Chờ thanh toán" :
                        order.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                        order.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                        "Trạng thái không xác định"
                      }
                    </span>
                  </td>
                  <td className="view-booking-repair-order-item-rating">
                    {order.ratings && order.ratings[0] ? `★ ${order.ratings[0].rate}/5` : "Chưa đánh giá"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="view-booking-repair-order-modal">
          <div className="view-booking-repair-order-modal-content">
            <h3 className="view-booking-repair-order-modal-title">CHI TIẾT ĐƠN HÀNG {selectedOrder._id}</h3>

            <div className="view-booking-repair-order-modal-section">
              <h4>Thông tin đơn hàng</h4>
              <p>Mã đơn hàng: {selectedOrder._id || "Không xác định"}</p>
              <p>Ngày đặt: {formatDateTime(selectedOrder.createdAt) || "Không xác định"}</p>
              <p>Ngày hoàn thành: {formatDateTime(selectedOrder.updatedAt) || "Không xác định"}</p>
              <p>Loại dịch vụ: {selectedOrder.serviceIndustry_id.type || "Không xác định"}</p>
              <p>Địa chỉ thực hiện đơn sửa chữa: {selectedOrder.address || "Không xác định"}</p>
              <p>Mô tả tình trạng đơn sửa chữa: {selectedOrder.description || "Không xác định"}</p>
              <p>Ảnh đơn sửa chữa: {<img src={selectedOrder.image} alt="Avatar" /> || "Không xác định"}</p>
              <p>Khoảng giá: {selectedOrder.priceRange || 0}</p>
              <p>
                Trạng thái:{" "}
                {
                  selectedOrder.status === "Completed" ? "Đã hoàn thành" :
                  selectedOrder.status === "Confirmed" ? "Đã xác nhận" :
                  selectedOrder.status === "Pending" ? "Đang chờ xử lý" :
                  selectedOrder.status === "Cancelled" ? "Đã hủy" :
                  selectedOrder.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                  selectedOrder.status === "Deal price" ? "Thỏa thuận giá" :
                  selectedOrder.status === "Done deal price" ? "Đã chốt giá" :
                  selectedOrder.status === "Make payment" ? "Chờ thanh toán" :
                  selectedOrder.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                  selectedOrder.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                  "Trạng thái không xác định"
                }
              </p>
              <p>Đánh giá: {selectedOrder.ratings && selectedOrder.ratings[0] ? `${selectedOrder.ratings[0].rate}/5` : "Chưa đánh giá"}</p>
            </div>

            <div className="view-booking-repair-order-modal-section">
              <h4>Thông tin khách hàng</h4>
              <p>Tên: {selectedOrder.user_id ? `${selectedOrder.user_id.firstName} ${selectedOrder.user_id.lastName}` : "Không xác định"}</p>
              <p>Email: {selectedOrder.user_id ? selectedOrder.user_id.email : "Không xác định"}</p>
              <p>SĐT: {selectedOrder.user_id ? selectedOrder.user_id.phone : "Không xác định"}</p>
              <p>Địa chỉ: {selectedOrder.user_id ? selectedOrder.user_id.address : "Không xác định"}</p>
            </div>

            <div className="view-booking-repair-order-modal-section">
              <h4>Thông tin thợ sửa</h4>
              <p>Tên: {selectedOrder.repairman_id ? `${selectedOrder.repairman_id.firstName} ${selectedOrder.repairman_id.lastName}` : "Không xác định"}</p>
              <p>Email: {selectedOrder.repairman_id ? selectedOrder.repairman_id.email : "Không xác định"}</p>
              <p>SĐT: {selectedOrder.repairman_id ? selectedOrder.repairman_id.phone : "Không xác định"}</p>
              <p>Địa chỉ: {selectedOrder.repairman_id ? selectedOrder.repairman_id.address : "Không xác định"}</p>
            </div>

            <button className="view-booking-repair-order-modal-close" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRepairBooking;