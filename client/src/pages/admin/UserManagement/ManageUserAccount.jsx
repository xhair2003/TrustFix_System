import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, resetError, resetSuccess } from "../../../store/actions/adminActions";
import { FaTrash, FaEye, FaLock, FaUnlock } from "react-icons/fa"; // Icons for view, lock, delete
import "./ManageUserAccount.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";

const ManageUserAccount = () => {
    const dispatch = useDispatch();
    const { users, loading, errorGetUsers, deleteSuccessMessage, deleteErrorMessage } = useSelector((state) => state.admin);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (errorGetUsers) {
            Swal.fire({
                title: "Lỗi",
                text: errorGetUsers,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
    }, [errorGetUsers, dispatch]);

    useEffect(() => {
        if (deleteSuccessMessage) {
            Swal.fire({
                title: "Thành công",
                text: deleteSuccessMessage,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());

            // Làm mới danh sách người dùng sau khi xóa thành công
            dispatch(fetchUsers());
        }

        if (deleteErrorMessage) {
            Swal.fire({
                title: "Lỗi",
                text: deleteErrorMessage,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
    }, [deleteSuccessMessage, deleteErrorMessage, dispatch]);

    useEffect(() => {
        dispatch(resetSuccess());
        dispatch(resetError());
        dispatch(fetchUsers()); // Fetch users when the component mounts
    }, [dispatch]);

    const openModal = (type, user) => {
        setModalType(type);
        setSelectedUser(user);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
        setReason("");
    };

    const handleCheckboxChange = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const filteredUsers = users
        .filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const matchesSearch =
                fullName.includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user._id.toLowerCase().includes(searchTerm.toLowerCase()); // Thêm điều kiện tìm kiếm theo _id
            const matchesRole = roleFilter === "All" || user.roles[0]?.type === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            if (roleFilter === "All") {
                return 0;
            }
            return a.roles[0]?.type.localeCompare(b.roles[0]?.type);
        });


    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleSubmitReason = () => {
        if (!reason) {
            Swal.fire("Vui lòng nhập lý do!");
            return;
        }

        dispatch(resetSuccess());
        dispatch(resetError());

        // Gọi API xóa tài khoản
        dispatch(deleteUser(selectedUser._id, reason));

        // Reset lý do sau khi gửi
        setReason("");

        // Đóng modal sau khi xác nhận
        closeModal();
    };


    if (!users || loading) {
        return <Loading />;
    };

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG</h2>

                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng theo ID, Họ và tên hoặc Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="role-dropdown"
                    >
                        <option value="All">Tất cả</option>
                        <option value="customer">Khách hàng</option>
                        <option value="repairman">Thợ</option>
                    </select>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="items-per-page-dropdown"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                    <button
                        className="delete-button"
                        disabled={selectedUsers.length === 0}
                    >
                        Xóa người dùng đã chọn
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            if (selectedUsers.length === paginatedUsers.length) {
                                                setSelectedUsers([]);
                                            } else {
                                                setSelectedUsers(paginatedUsers.map((user) => user._id));
                                            }
                                        }}
                                        checked={selectedUsers.length === paginatedUsers.length}
                                    />
                                </th>
                                <th>ID</th>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Ảnh</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleCheckboxChange(user._id)}
                                        />
                                    </td>
                                    <td>{user._id}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.roles[0]?.type === "customer" ? "Khách hàng" : "Thợ"}</td>
                                    <td>
                                        <div className="avatar-placeholder">
                                            <img src={user.imgAvt} alt="Avatar" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="icon-container">
                                            <button className="action-button" onClick={() => openModal("view", user)}>
                                                <FaEye />
                                                <span>Xem chi tiết</span>
                                            </button>
                                            {/* Hiển thị nút khóa/mở khóa tài khoản tùy vào trạng thái */}
                                            {user.status === "Active" || user.status === "Inactive" || user.status === 1 ? (
                                                <button className="action-button" onClick={() => openModal("lock", user)}>
                                                    <FaLock />
                                                    <span>Khóa tài khoản</span>
                                                </button>
                                            ) : user.status === "Banned" ? (
                                                <button className="action-button" onClick={() => openModal("unlock", user)}>
                                                    <FaUnlock />
                                                    <span>Mở khóa tài khoản</span>
                                                </button>
                                            ) : null}
                                            <button className="action-button" onClick={() => openModal("delete", user)}>
                                                <FaTrash />
                                                <span>Xóa tài khoản</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </div>

            {/* Modal for View User Details */}
            {modalType === "view" && selectedUser && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>Chi tiết người dùng</h3>
                        <p><strong>Họ và tên:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
                        <p><strong>Ảnh:</strong> <img style={{ width: '250px', height: '250px' }} src={selectedUser.imgAvt} alt="Avatar" /></p>
                        <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
                        <p><strong>Vai trò:</strong> {selectedUser.roles[0].type === "customer" ? "Khách hàng" : "Thợ"}</p>

                        {/* Hiển thị trạng thái chỉ khi vai trò là "Thợ" */}
                        {selectedUser.roles[0].type === "repairman" && (
                            <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        )}

                        <p><strong>Mô tả bản thân:</strong> {selectedUser.description}</p>

                        {/* Định dạng ngày giờ */}
                        <p><strong>Ngày tạo tài khoản:</strong> {new Date(selectedUser.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
                        <p><strong>Ngày cập nhật thông tin:</strong> {new Date(selectedUser.updatedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>

                    </div>
                </div>
            )}

            {/* Modal for Lock User Account */}
            {modalType === "lock" && selectedUser && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>Khóa tài khoản</h3>
                        <textarea
                            value={reason}
                            onChange={handleReasonChange}
                            placeholder="Nhập lý do khóa tài khoản"
                            rows="4"
                            style={{ width: "100%" }}
                        />
                        <div className="modal-footer">
                            <button onClick={handleSubmitReason}>Xác nhận</button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Unlock User Account */}
            {modalType === "unlock" && selectedUser && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>Mở khóa tài khoản</h3>
                        <textarea
                            value={reason}
                            onChange={handleReasonChange}
                            placeholder="Nhập lý do mở khóa tài khoản"
                            rows="4"
                            style={{ width: "100%" }}
                        />
                        <div className="modal-footer">
                            <button onClick={handleSubmitReason}>Xác nhận</button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Delete User Account */}
            {modalType === "delete" && selectedUser && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>Xóa tài khoản</h3>
                        <textarea
                            value={reason}
                            onChange={handleReasonChange}
                            placeholder="Nhập lý do xóa tài khoản"
                            rows="4"
                            style={{ width: "100%" }}
                        />
                        <div className="modal-footer">
                            <button onClick={handleSubmitReason} disabled={loading}>
                                {loading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUserAccount;

