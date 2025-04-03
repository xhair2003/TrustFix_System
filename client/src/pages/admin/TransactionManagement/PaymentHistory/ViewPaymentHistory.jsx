// cần thêm thanh toán cho đơn hàng nào nữa trong xem chi tiết bằng 
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ViewPaymentHistory.css";
import Loading from "../../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentHistory, resetError } from "../../../../store/actions/adminActions"; // Import the action

const ViewPaymentHistory = () => {
  const dispatch = useDispatch();
  const { loading, HistoryPayments, errorHistoryPayments } = useSelector(
    (state) => state.admin
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchPaymentHistory()); // Fetch payment history when the component is mounted
  }, [dispatch]);

  useEffect(() => {
    if (errorHistoryPayments) {
      Swal.fire({
        title: "Lỗi",
        text: errorHistoryPayments,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }
  }, [dispatch, errorHistoryPayments]);

  const filteredPayments = HistoryPayments.filter((payment) => {
    const matchesSearch = `${payment.wallet_id.user_id?.firstName} ${payment.wallet_id.user_id?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || parseInt(payment.status) === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowDetails = (payment) => setSelectedPayment(payment);
  const handleCloseDetails = () => setSelectedPayment(null);

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
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Thành công</option>
            <option value="0">Đang xử lý</option>
            <option value="2">Thất bại</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : errorHistoryPayments ? (
          <p>{errorHistoryPayments}</p>
        ) : (
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>Người tạo</th>
                <th>Ngày tạo</th>
                <th>Mã giao dịch</th>
                <th>Số tiền giao dịch</th>
                <th>Số dư sau giao dịch</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{`${payment.wallet_id.user_id?.firstName} ${payment.wallet_id.user_id?.lastName}`}</td>
                  <td>{formatDateTime(payment.createdAt)}</td>
                  <td>{payment.payCode}</td>
                  <td>{payment.amount?.toLocaleString()} VNĐ</td>
                  <td>{payment.balanceAfterTransact?.toLocaleString()} VNĐ</td>
                  <td>{payment.status === 0
                    ? "Đang xử lý"
                    : payment.status === 1
                      ? "Thành công"
                      : payment.status === 2
                        ? "Thất bại"
                        : "Không xác định"}</td>
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
        )}

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
                className={`payment-history-page-btn ${currentPage === i + 1 ? "active" : ""}`}
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
              <h3>Chi tiết thanh toán</h3>
              <div className="payment-history-details-content">
                <div className="payment-history-details-section">
                  <h4>Thông tin thanh toán</h4>
                  <p>Ngày giao dịch: {formatDateTime(selectedPayment.createdAt)}</p>
                  <p>Mã giao dịch: {selectedPayment.payCode}</p>
                  <p>Số tiền: {selectedPayment.amount?.toLocaleString()} VNĐ</p>
                  <p>Số dư sau giao dịch: {selectedPayment.balanceAfterTransact?.toLocaleString()} VNĐ</p>
                  <p>
                    Trạng thái: {selectedPayment.status === 0
                      ? "Đang xử lý"
                      : selectedPayment.status === 1
                        ? "Thành công"
                        : selectedPayment.status === 2
                          ? "Thất bại"
                          : "Không xác định"}
                  </p>
                  <p>Nội dung giao dịch: {selectedPayment.content}</p>
                </div>
                <div className="payment-history-details-section">
                  <h4>Thông tin khách hàng</h4>
                  <p>Họ và tên: {`${selectedPayment.wallet_id.user_id?.firstName} ${selectedPayment.wallet_id.user_id?.lastName}`}</p>
                  <p>Email: {selectedPayment.wallet_id.user_id?.email}</p>
                  <p>Số điện thoại: {selectedPayment.wallet_id.user_id?.phone}</p>
                  <p>
                    Vai trò: {selectedPayment.wallet_id.user_id?.roles && selectedPayment.wallet_id.user_id?.roles.length > 0 &&
                      selectedPayment.wallet_id.user_id?.roles[0].type === "repairman" ? "Thợ" : "Khách hàng"}
                  </p>
                  <p>Địa chỉ: {selectedPayment.wallet_id.user_id?.address}</p>
                </div>

                {/* vài bữa thêm mục thông tin đơn hàng nào nữa nhé hải, bằng selectedPayment.request*/}

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
