import React, { useState } from "react";
import "./ViewRepairBooking.css";

const ViewRepairBooking = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const repairOrders = [
    {
      id: "DH001",
      orderDate: "2025-03-15 09:30",
      completeDate: "2025-03-15 14:00",
      priceRange: "500.000 - 700.000 VNĐ",
      status: "Hoàn thành",
      rating: 4.5,
      customer: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0905123456",
        address: "123 Đường Láng, Hà Nội"
      },
      technician: {
        name: "Trần Văn B",
        email: "tranvanb@gmail.com",
        phone: "0987654321",
        address: "456 Lê Lợi, TP.HCM"
      }
    },
    {
      id: "DH002",
      orderDate: "2025-03-16 10:00",
      completeDate: null,
      priceRange: "300.000 - 500.000 VNĐ",
      status: "Đang xử lý",
      rating: null,
      customer: {
        name: "Lê Thị C",
        email: "lethic@gmail.com",
        phone: "0912345678",
        address: "789 Trần Phú, Đà Nẵng"
      },
      technician: {
        name: "Phạm Văn D",
        email: "phamvand@gmail.com",
        phone: "0978123456",
        address: "321 Nguyễn Huệ, Huế"
      }
    },
    {
      id: "DH003",
      orderDate: "2025-03-16 14:00",
      completeDate: null,
      priceRange: "400.000 - 600.000 VNĐ",
      status: "Đã hủy",
      rating: null,
      customer: {
        name: "Hoàng Văn E",
        email: "hoangvane@gmail.com",
        phone: "0935123456",
        address: "111 Nguyễn Trãi, Hà Nội"
      },
      technician: {
        name: null, // Chưa phân thợ vì đã hủy
        email: null,
        phone: null,
        address: null
      }
    }
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = repairOrders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter) &&
      (!start || orderDate >= start) &&
      (!end || orderDate <= end)
    );
  });

  return (
    <div className="history-container">
      <div className="history-form">
        <h2 className="complaint-title">XEM LỊCH SỬ SỬA CHỮA</h2>

        <div className="filter-section">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-filter"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-filter"
          />
        </div>

        <div className="view-order-list">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="view-order-item"
              onClick={() => handleOrderClick(order)}
            >
              <span className="view-order-item-id">{order.id}</span>
              <span className="view-order-item-date">Đặt: {order.orderDate}</span>
              <span className="view-order-item-complete">
                Hoàn thành: {order.completeDate || "Chưa hoàn thành"}
              </span>
              <span className="view-order-item-price">{order.priceRange}</span>
              <span
                className={`view-order-item-status view-order-status-${order.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {order.status}
              </span>
              <span className="view-order-item-rating">
                {order.rating ? `★ ${order.rating}/5` : "Chưa đánh giá"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="view-order-modal">
          <div className="view-order-modal-content">
            <h3 className="view-order-modal-title">CHI TIẾT ĐƠN HÀNG {selectedOrder.id}</h3>

            <div className="view-order-modal-section">
              <h4>Thông tin đơn hàng</h4>
              <p>Mã đơn hàng: {selectedOrder.id}</p>
              <p>Ngày đặt: {selectedOrder.orderDate}</p>
              <p>Ngày hoàn thành: {selectedOrder.completeDate || "Chưa hoàn thành"}</p>
              <p>Khoảng giá: {selectedOrder.priceRange}</p>
              <p>Trạng thái: {selectedOrder.status}</p>
              <p>Đánh giá: {selectedOrder.rating ? `${selectedOrder.rating}/5` : "Chưa đánh giá"}</p>
            </div>

            <div className="view-order-modal-section">
              <h4>Thông tin khách hàng</h4>
              <p>Tên: {selectedOrder.customer.name}</p>
              <p>Email: {selectedOrder.customer.email}</p>
              <p>SĐT: {selectedOrder.customer.phone}</p>
              <p>Địa chỉ: {selectedOrder.customer.address}</p>
            </div>

            <div className="view-order-modal-section">
              <h4>Thông tin thợ sửa</h4>
              <p>Tên: {selectedOrder.technician.name || "Chưa phân công"}</p>
              <p>Email: {selectedOrder.technician.email || "N/A"}</p>
              <p>SĐT: {selectedOrder.technician.phone || "N/A"}</p>
              <p>Địa chỉ: {selectedOrder.technician.address || "N/A"}</p>
            </div>

            <button className="view-order-modal-close" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRepairBooking;