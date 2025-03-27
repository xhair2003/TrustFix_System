import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Sử dụng react-router-dom để chuyển trang
import './ViewDepositHistory.css';
import Loading from "../../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepositHistory, resetError } from "../../../../store/actions/adminActions"; // Import the action

const ViewDepositHistory = () => {
  // Lấy dữ liệu từ Redux store
  const dispatch = useDispatch();
  const { depositeHistories, loading, errorDepositeHistories } = useSelector(
    (state) => state.admin
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  useEffect(() => {
    // Gọi API để lấy lịch sử nạp tiền
    dispatch(fetchDepositHistory());
  }, [dispatch]);

  useEffect(() => {
    if (errorDepositeHistories) {
      Swal.fire({
        title: "Lỗi",
        text: errorDepositeHistories,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }
  }, [dispatch, errorDepositeHistories]);

  // Lọc và tìm kiếm
  const filteredDeposits = depositeHistories.filter((deposit) => {
    const matchesSearch = `${deposit.wallet_id.user_id?.firstName} ${deposit.wallet_id.user_id?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMethod =
      methodFilter === "all" || deposit.status === methodFilter;
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

  // Hàm định dạng ngày và giờ theo kiểu hh:mm dd/mm/yyyy
  const formatDateTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0'); // Lấy giờ
    const minutes = d.getMinutes().toString().padStart(2, '0'); // Lấy phút
    const day = d.getDate().toString().padStart(2, '0'); // Lấy ngày
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng
    const year = d.getFullYear(); // Lấy năm

    return `${hours}:${minutes} ${day}/${month}/${year}`; // Trả về định dạng hh:mm dd/mm/yyyy
  };

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
            <option value="all">Tất cả phương thức</option>
            <option value="Momo">Momo</option>
            <option value="PayOS">PayOS</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : errorDepositeHistories ? (
          <div>{errorDepositeHistories}</div>
        ) : (
          <>
            <table className="deposit-history-table">
              <thead>
                <tr>
                  <th>Người nạp</th>
                  <th>Ngày nạp</th>
                  <th>Mã giao dịch</th>
                  <th>Phương thức</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {currentDeposits.map((deposit, index) => (
                  <tr key={index}>
                    <td>{deposit.wallet_id.user_id?.firstName} {deposit.wallet_id.user_id?.lastName}</td>
                    <td>{formatDateTime(deposit.createdAt)}</td>
                    <td>{deposit.payCode}</td>
                    <td>
                      {deposit.payCode && deposit.payCode.toLowerCase().startsWith("pay") ? "PayOS" : "Momo"}
                    </td>
                    <td>{deposit.amount.toLocaleString()} VNĐ</td>
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
                    className={`deposit-history-page-btn ${currentPage === i + 1 ? "active" : ""}`}
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
          </>
        )}

        {selectedDeposit && (
          <div className="deposit-history-details-overlay">
            <div className="deposit-history-details">
              <h3>Chi tiết</h3>
              <div className="deposit-history-details-content">
                <div className="deposit-history-details-section">
                  <h4>Thông tin giao dịch</h4>
                  <p>Ngày giao dịch: {formatDateTime(selectedDeposit.createdAt)}</p>
                  <p>Mã giao dịch: {selectedDeposit.payCode}</p>
                  <p>Phương thức: {selectedDeposit?.payCode && selectedDeposit.payCode?.toLowerCase().startsWith("pay") ? "PayOS" : "Momo"}</p>
                  <p>Số tiền: {selectedDeposit.amount?.toLocaleString()} VNĐ</p>
                  <p>Trạng thái: {selectedDeposit.status}</p>
                </div>
                <div className="deposit-history-details-section">
                  <h4>Thông tin khách hàng</h4>
                  <p>Tên: {selectedDeposit.wallet_id.user_id?.firstName} {selectedDeposit.wallet_id.user_id?.lastName}</p>
                  <p>Email: {selectedDeposit.wallet_id.user_id?.email}</p>
                  <p>Số điện thoại: {selectedDeposit.wallet_id.user_id?.phone}</p>
                  <p>
                    Vai trò: {selectedDeposit.wallet_id.user_id?.roles && selectedDeposit.wallet_id.user_id?.roles.length > 0 &&
                      selectedDeposit.wallet_id.user_id?.roles[0].type === "repairman" ? "Thợ" : "Khách hàng"}
                  </p>
                  <p>Địa chỉ: {selectedDeposit.wallet_id.user_id?.address}</p>
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
