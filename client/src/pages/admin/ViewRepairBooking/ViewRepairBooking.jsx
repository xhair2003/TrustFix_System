// import React, { useState, useEffect } from "react";
// import "./ViewRepairBooking.css";
// import Loading from "../../../component/Loading/Loading";
// import Swal from "sweetalert2";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchRepairBookingHistory, resetError
// } from "../../../store/actions/adminActions"; // Adjust import to match the location of your actions

// const ViewRepairBooking = () => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Redux state
//   const dispatch = useDispatch();
//   const { repairBookingHistory, loading, errorRepairBookingHistory } = useSelector(state => state.admin);

//   // Fetch repair booking history when the component mounts
//   useEffect(() => {
//     dispatch(fetchRepairBookingHistory());
//   }, [dispatch]);

//   useEffect(() => {
//     if (errorRepairBookingHistory) {
//       Swal.fire({
//         title: "Lỗi",
//         text: errorRepairBookingHistory,
//         icon: "error",
//         timer: 5000,
//         showConfirmButton: false,
//       });
//       dispatch(resetError());
//     }
//   }, [dispatch, errorRepairBookingHistory]);

//   const handleOrderClick = (order) => {
//     setSelectedOrder(order);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//   };

//   // Filter orders based on search term, status, and date
//   const filteredOrders = repairBookingHistory.filter((order) => {
//     const orderDate = new Date(order.orderDate);
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     return (
//       (searchTerm === "" ||
//         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (statusFilter === "" || order.status === statusFilter) &&
//       (!start || orderDate >= start) &&
//       (!end || orderDate <= end)
//     );
//   });

//   // Function to format date
//   const formatDateTime = (date) => {
//     const d = new Date(date);
//     const hours = d.getHours().toString().padStart(2, '0');
//     const minutes = d.getMinutes().toString().padStart(2, '0');
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear();
//     return `${hours}:${minutes} ${day}/${month}/${year}`;
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="history-container">
//       <div className="history-form">
//         <h2 className="complaint-title">XEM LỊCH SỬ SỬA CHỮA</h2>

//         <div className="filter-section">
//           <input
//             type="text"
//             placeholder="Tìm theo mã hoặc tên khách hàng"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="status-filter"
//           >
//             <option value="">Tất cả trạng thái</option>
//             <option value="Hoàn thành">Hoàn thành</option>
//             <option value="Đang xử lý">Đang xử lý</option>
//             <option value="Đã hủy">Đã hủy</option>
//           </select>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="date-filter"
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="date-filter"
//           />
//         </div>

//         <div className="view-order-list">
//           {filteredOrders.map((order) => (
//             <div
//               key={order._id}
//               className="view-order-item"
//               onClick={() => handleOrderClick(order)}
//             >
//               <span className="view-order-item-id">{order._id}</span>
//               <span className="view-order-item-date">Đặt: {formatDateTime(order.createdAt)}</span>
//               <span className="view-order-item-complete">
//                 Hoàn thành:  {formatDateTime(order.updatedAt)}
//               </span>
//               <span className="view-order-item-price">{order.priceRange || 0}</span>
//               <span
//                 className={`view-order-item-status view-order-status-${order.status}`}
//               >
//                 {
//                   order.status === 'Pending' ? 'Đang tiến hành' :
//                     order.status === 'Completed' ? 'Đã hoàn thành' :
//                       order.status === 'Confirmed' ? 'Đã xác nhận' :
//                         order.status === 'Cancelled' ? 'Đã hủy' :
//                           order.status === 'Make payment' ? 'Chờ thanh toán' :
//                             order.status === 'Deal price' ? 'Đã thỏa thuận giá' :
//                               'Trạng thái không xác định'
//                 }
//               </span>
//               <span className="view-order-item-rating">
//                 {order.ratings ? `★ ${order.ratings.rate}/5` : "Chưa đánh giá"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedOrder && (
//         <div className="view-order-modal">
//           <div className="view-order-modal-content">
//             <h3 className="view-order-modal-title">CHI TIẾT ĐƠN HÀNG {selectedOrder.id}</h3>

//             <div className="view-order-modal-section">
//               <h4>Thông tin đơn hàng</h4>
//               <p>Mã đơn hàng: {selectedOrder._id}</p>
//               <p>Ngày đặt: {formatDateTime(selectedOrder.createdAt)}</p>
//               <p>Ngày hoàn thành: {formatDateTime(selectedOrder.updatedAt)}</p>
//               <p>Khoảng giá: {selectedOrder.priceRange || 0}</p>
//               <p>
//                 Trạng thái:{" "}
//                 {
//                   selectedOrder.status === 'Pending' ? 'Đang tiến hành' :
//                     selectedOrder.status === 'Completed' ? 'Đã hoàn thành' :
//                       selectedOrder.status === 'Confirmed' ? 'Đã xác nhận' :
//                         selectedOrder.status === 'Cancelled' ? 'Đã hủy' :
//                           selectedOrder.status === 'Make payment' ? 'Chờ thanh toán' :
//                             selectedOrder.status === 'Deal price' ? 'Đã thỏa thuận giá' :
//                               'Trạng thái không xác định'
//                 }
//               </p>
//               <p>Đánh giá: {selectedOrder.ratings ? `${selectedOrder.ratings.rate}/5` : "Chưa đánh giá"}</p>
//             </div>

//             <div className="view-order-modal-section">
//               <h4>Thông tin khách hàng</h4>
//               <p>Tên: {selectedOrder.user_id.firstName} {selectedOrder.user_id.lastName}</p>
//               <p>Email: {selectedOrder.user_id.email}</p>
//               <p>SĐT: {selectedOrder.user_id.phone}</p>
//               <p>Địa chỉ: {selectedOrder.user_id.address}</p>
//             </div>

//             <div className="view-order-modal-section">
//               <h4>Thông tin thợ sửa</h4>
//               <p>Tên: {`${selectedOrder.repairman_id.firstName} ${selectedOrder.repairman_id.lastName} || "Chưa phân công"`}</p>
//               <p>Email: {selectedOrder.repairman_id.email || "N/A"}</p>
//               <p>SĐT: {selectedOrder.repairman_id.phone || "N/A"}</p>
//               <p>Địa chỉ: {selectedOrder.repairman_id.address || "N/A"}</p>
//             </div>

//             <button className="view-order-modal-close" onClick={closeModal}>
//               Đóng
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewRepairBooking;



import React, { useState, useEffect } from "react";
import "./ViewRepairBooking.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRepairBookingHistory, resetError
} from "../../../store/actions/adminActions"; // Adjust import to match the location of your actions

const ViewRepairBooking = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    const orderDate = new Date(order.updatedAt); // Use the completion date for filtering
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Normalize the start and end dates (set end date to 23:59:59 for inclusivity)
    if (end) {
      end.setHours(23, 59, 59, 999); // Set time to end of the day
    }

    const fullName = order.user_id ? `${order.user_id.firstName} ${order.user_id.lastName}` : "";
    // Check if the search term matches order ID or customer name
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Apply status filter
    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    // Apply date range filter
    const matchesDate =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <Loading />;
  }

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
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã thỏa thuận giá">Đã thỏa thuận giá</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
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
              key={order._id}
              className="view-order-item"
              onClick={() => handleOrderClick(order)}
            >
              <span className="view-order-item-id">{order._id}</span>
              <span className="view-order-item-date">Đặt: {formatDateTime(order.createdAt)}</span>
              <span className="view-order-item-complete">
                Hoàn thành: {formatDateTime(order.updatedAt)}
              </span>
              <span className="view-order-item-price">{order.priceRange || 0}</span>
              <span
                className={`view-order-item-status view-order-status-${order.status.toLowerCase().replace(" ", "-")}`}
              >
                {
                  order.status === 'Pending' ? 'Đang tiến hành' :
                    order.status === 'Completed' ? 'Đã hoàn thành' :
                      order.status === 'Confirmed' ? 'Đã xác nhận' :
                        order.status === 'Cancelled' ? 'Đã hủy' :
                          order.status === 'Make payment' ? 'Chờ thanh toán' :
                            order.status === 'Deal price' ? 'Đã thỏa thuận giá' :
                              'Trạng thái không xác định'
                }
              </span>
              <span className="view-order-item-rating">
                {order.ratings ? `★ ${order.ratings.rate}/5` : "Chưa đánh giá"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="view-order-modal">
          <div className="view-order-modal-content">
            <h3 className="view-order-modal-title">CHI TIẾT ĐƠN HÀNG {selectedOrder._id}</h3>

            <div className="view-order-modal-section">
              <h4>Thông tin đơn hàng</h4>
              <p>Mã đơn hàng: {selectedOrder._id}</p>
              <p>Ngày đặt: {formatDateTime(selectedOrder.createdAt)}</p>
              <p>Ngày hoàn thành: {formatDateTime(selectedOrder.updatedAt)}</p>
              <p>Khoảng giá: {selectedOrder.priceRange || 0}</p>
              <p>
                Trạng thái:{" "}
                {
                  selectedOrder.status === 'Pending' ? 'Đang tiến hành' :
                    selectedOrder.status === 'Completed' ? 'Đã hoàn thành' :
                      selectedOrder.status === 'Confirmed' ? 'Đã xác nhận' :
                        selectedOrder.status === 'Cancelled' ? 'Đã hủy' :
                          selectedOrder.status === 'Make payment' ? 'Chờ thanh toán' :
                            selectedOrder.status === 'Deal price' ? 'Đã thỏa thuận giá' :
                              'Trạng thái không xác định'
                }
              </p>
              <p>Đánh giá: {selectedOrder.ratings ? `${selectedOrder.ratings.rate}/5` : "Chưa đánh giá"}</p>
            </div>

            <div className="view-order-modal-section">
              <h4>Thông tin khách hàng</h4>
              <p>Tên: {selectedOrder.user_id.firstName} {selectedOrder.user_id.lastName}</p>
              <p>Email: {selectedOrder.user_id.email}</p>
              <p>SĐT: {selectedOrder.user_id.phone}</p>
              <p>Địa chỉ: {selectedOrder.user_id.address}</p>
            </div>

            <div className="view-order-modal-section">
              <h4>Thông tin thợ sửa</h4>
              <p>Tên: {`${selectedOrder.repairman_id.firstName} ${selectedOrder.repairman_id.lastName}` || "Chưa phân công"}</p>
              <p>Email: {selectedOrder.repairman_id.email || "N/A"}</p>
              <p>SĐT: {selectedOrder.repairman_id.phone || "N/A"}</p>
              <p>Địa chỉ: {selectedOrder.repairman_id.address || "N/A"}</p>
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
