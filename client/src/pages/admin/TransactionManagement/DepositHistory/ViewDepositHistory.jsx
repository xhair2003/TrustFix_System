import React, { useState } from "react";
import { Link } from "react-router-dom"; // Sử dụng react-router-dom để chuyển trang
import './ViewDepositHistory.css';

const ViewDepositHistory = () => {
  // State để quản lý dữ liệu và trang hiện tại
  const [deposits] = useState([
    {
      depositor: "Nguyen Xuan Hai",
      depositDate: "15:15 AM, 25/02/2025",
      transactionCode: "MOMO1731826001739",
      method: "Momo",
      amount: 150000,
      status: "Done",
      details: {
        transactionDate: "15:30 PM, 25/02/2025",
        transactionCode: "MOMO1731826001739",
        method: "Momo",
        amount: 70000,
        status: "Done",
        customerName: "Nguyen Xuan Hai",
        email: "ngnghai2003@gmail.com",
        phone: "0978287322",
        address: "27 Tra No 1, Hoa Khanh Nam, Lien Chieu, Da Nang",
      },
    },
    // Thêm các giao dịch khác nếu cần
    {
      depositor: "Nguyen Xuan Hai",
      depositDate: "15:15 AM, 25/02/2025",
      transactionCode: "MOMO1731826001739",
      method: "Momo",
      amount: 150000,
      status: "Done",
      details: {
        transactionDate: "15:30 PM, 25/02/2025",
        transactionCode: "MOMO1731826001739",
        method: "Momo",
        amount: 70000,
        status: "Done",
        customerName: "Nguyen Xuan Hai",
        email: "ngnghai2003@gmail.com",
        phone: "0978287322",
        address: "27 Tra No 1, Hoa Khanh Nam, Lien Chieu, Da Nang",
      },
    },
    // Thêm các bản ghi khác tương tự
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  // Lọc và tìm kiếm
  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch = deposit.depositor
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMethod =
      methodFilter === "All" || deposit.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeposits = filteredDeposits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hiển thị chi tiết
  const handleShowDetails = (deposit) => setSelectedDeposit(deposit);
  const handleCloseDetails = () => setSelectedDeposit(null);

  return (
    <div className="history-container">
      <div className="history-form">
        <div className="deposit-history-nav">
          <Link to="/admin/view-deposit-history">
            <button
              className="deposit-history-nav-btn active"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              Lịch sử nạp tiền
            </button>
          </Link>
          <Link to="/admin/view-history-payment">
            <button className="deposit-history-nav-btn">Lịch sử thanh toán</button>
          </Link>
        </div>
        <h2 className="deposit-history-title">LỊCH SỬ NẠP TIỀN</h2>

        <div className="deposit-history-filter">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="deposit-history-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="deposit-history-method"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="All">Tất cả phương thức</option>
            <option value="Momo">Momo</option>
            {/* Thêm các phương thức khác nếu cần */}
          </select>
        </div>

        <table className="deposit-history-table">
          <thead>
            <tr>
              <th>Người nạp</th>
              <th>Ngày nạp</th>
              <th>Mã giao dịch</th>
              <th>Phương thức</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentDeposits.map((deposit, index) => (
              <tr key={index}>
                <td>{deposit.depositor}</td>
                <td>{deposit.depositDate}</td>
                <td>{deposit.transactionCode}</td>
                <td>{deposit.method}</td>
                <td>{deposit.amount.toLocaleString()} VND</td>
                <td>{deposit.status}</td>
                <td>
                  <button
                    className="deposit-history-action-btn"
                    onClick={() => handleShowDetails(deposit)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="deposit-history-pagination">
          <select
            className="deposit-history-page-size"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
          >
            <option value="5">5 giao dịch mỗi trang</option>
            <option value="10">10 giao dịch mỗi trang</option>
            <option value="20">20 giao dịch mỗi trang</option>
          </select>
          <div className="deposit-history-page-nav">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="deposit-history-page-btn"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`deposit-history-page-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="deposit-history-page-btn"
            >
              &gt;
            </button>
          </div>
        </div>

        {selectedDeposit && (
          <div className="deposit-history-details-overlay">
            <div className="deposit-history-details">
              <h3>Chi tiết</h3>
              <div className="deposit-history-details-content">
                <div className="deposit-history-details-section">
                  <h4>Thông tin giao dịch</h4>
                  <p>
                    Ngày giao dịch:{" "}
                    {selectedDeposit.details.transactionDate}
                  </p>
                  <p>
                    Mã giao dịch:{" "}
                    {selectedDeposit.details.transactionCode}
                  </p>
                  <p>Phương thức: {selectedDeposit.details.method}</p>
                  <p>
                    Số tiền: {selectedDeposit.details.amount.toLocaleString()} VND
                  </p>
                  <p>Trạng thái: {selectedDeposit.details.status}</p>
                </div>
                <div className="deposit-history-details-section">
                  <h4>Thông tin khách hàng</h4>
                  <p>Tên: {selectedDeposit.details.customerName}</p>
                  <p>Email: {selectedDeposit.details.email}</p>
                  <p>Số điện thoại: {selectedDeposit.details.phone}</p>
                  <p>Địa chỉ: {selectedDeposit.details.address}</p>
                </div>
              </div>
              <button
                className="deposit-history-close-btn"
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

export default ViewDepositHistory;