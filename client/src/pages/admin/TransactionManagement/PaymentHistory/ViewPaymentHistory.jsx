import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ViewPaymentHistory.css";

const ViewPaymentHistory = () => {
  // Dữ liệu mẫu
  const [payments] = useState([
    {
      creator: "Nguyen Xuan Hai",
      createDate: "15:15, 25/02/2025",
      transactionCode: "MOMO1731826001739",
      amount: 70000,
      balance: 150000,
      status: "Hoàn tất",
      details: {
        transactionDate: "15:30, 25/02/2025",
        transactionCode: "PAY1731826001739",
        amount: 70000,
        balanceAfter: 150000,
        status: "Hoàn tất",
        transactionContent: "Thanh toán phí kết nối + VAT",
        customerName: "Nguyen Xuan Hai",
        email: "ngnghai2003@gmail.com",
        phone: "0978287322",
        role: "Thợ sửa chữa",
        address: "27 Trà Nổ 1, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng",
      },
    },
    {
      creator: "Nguyen Xuan Hai",
      createDate: "15:15, 25/02/2025",
      transactionCode: "MOMO1731826001739",
      amount: 70000,
      balance: 150000,
      status: "Hoàn tất",
      details: {
        transactionDate: "15:30, 25/02/2025",
        transactionCode: "PAY1731826001739",
        amount: 70000,
        balanceAfter: 150000,
        status: "Hoàn tất",
        transactionContent: "Thanh toán phí kết nối + VAT",
        customerName: "Nguyen Xuan Hai",
        email: "ngnghai2003@gmail.com",
        phone: "0978287322",
        role: "Thợ sửa chữa",
        address: "27 Trà Nổ 1, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng",
      },
    },
    // Thêm dữ liệu khác nếu cần
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  // Lọc và tìm kiếm
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.creator
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Tất cả" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hiển thị chi tiết
  const handleShowDetails = (payment) => setSelectedPayment(payment);
  const handleCloseDetails = () => setSelectedPayment(null);

  return (
    <div className="history-container">
      <div className="history-form">
        <div className="payment-history-nav">
          <Link to="/admin/view-deposit-history">
            <button className="payment-history-nav-btn">Lịch sử nạp tiền</button>
          </Link>
          <Link to="/admin/view-payment-history">
            <button
              className="payment-history-nav-btn active"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              Lịch sử thanh toán
            </button>
          </Link>
        </div>
        <h2 className="payment-history-title">LỊCH SỬ THANH TOÁN</h2>

        <div className="payment-history-filter">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người tạo..."
            className="payment-history-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="payment-history-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoàn tất">Hoàn tất</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Thất bại">Thất bại</option>
          </select>
        </div>

        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Mã giao dịch</th>
              <th>Số tiền</th>
              <th>Số dư</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.creator}</td>
                <td>{payment.createDate}</td>
                <td>{payment.transactionCode}</td>
                <td>{payment.amount.toLocaleString()} VND</td>
                <td>{payment.balance.toLocaleString()} VND</td>
                <td>{payment.status}</td>
                <td>
                  <button
                    className="payment-history-action-btn"
                    onClick={() => handleShowDetails(payment)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="payment-history-pagination">
          <select
            className="payment-history-page-size"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
          >
            <option value="5">5 giao dịch mỗi trang</option>
            <option value="10">10 giao dịch mỗi trang</option>
            <option value="20">20 giao dịch mỗi trang</option>
          </select>
          <div className="payment-history-page-nav">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="payment-history-page-btn"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`payment-history-page-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="payment-history-page-btn"
            >
              &gt;
            </button>
          </div>
        </div>

        {selectedPayment && (
          <div className="payment-history-details-overlay">
            <div className="payment-history-details">
              <h3>Chi tiết giao dịch</h3>
              <div className="payment-history-details-content">
                <div className="payment-history-details-section">
                  <h4>Thông tin giao dịch</h4>
                  <p>Ngày giao dịch: {selectedPayment.details.transactionDate}</p>
                  <p>Mã giao dịch: {selectedPayment.details.transactionCode}</p>
                  <p>Số tiền: {selectedPayment.details.amount.toLocaleString()} VND</p>
                  <p>Số dư sau giao dịch: {selectedPayment.details.balanceAfter.toLocaleString()} VND</p>
                  <p>Trạng thái: {selectedPayment.details.status}</p>
                  <p>Nội dung giao dịch: {selectedPayment.details.transactionContent}</p>
                </div>
                <div className="payment-history-details-section">
                  <h4>Thông tin khách hàng</h4>
                  <p>Tên: {selectedPayment.details.customerName}</p>
                  <p>Email: {selectedPayment.details.email}</p>
                  <p>Số điện thoại: {selectedPayment.details.phone}</p>
                  <p>Vai trò: {selectedPayment.details.role}</p>
                  <p>Địa chỉ: {selectedPayment.details.address}</p>
                </div>
              </div>
              <button
                className="payment-history-close-btn"
                onClick={handleCloseDetails}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaymentHistory;