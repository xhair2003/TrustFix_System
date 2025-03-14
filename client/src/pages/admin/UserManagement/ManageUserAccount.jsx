import React, { useState } from "react";
import "./ManageUserAccount.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import UserInfoModal from "./UserInforModal";

const ManageUserAccount = () => {
    const [users, setUsers] = useState([
        { id: 1, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 2, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 3, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 4, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 5, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 6, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 7, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 8, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 9, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 10, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 11, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
        { id: 12, fullName: "Nguyen Xuan Hai", email: "abc123456789@gmail.com", phone: "0989273874", role: "Customer", avatar: "" },
    ]);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedUser, setSelectedUser] = useState(null); // Trạng thái cho user được chọn

    // Handle checkbox selection
    const handleCheckboxChange = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    // Handle delete selected users
    const handleDeleteSelected = () => {
        if (selectedUsers.length > 0) {
            setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
            setSelectedUsers([]);
        }
    };

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Open modal with user details
    const handleViewUser = (user) => {
        setSelectedUser(user);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG</h2>

                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="role-dropdown"
                    >
                        <option value="All">All</option>
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
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
                        onClick={handleDeleteSelected}
                        disabled={selectedUsers.length === 0}
                    >
                        Delete chosen
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" onChange={() => {
                                    if (selectedUsers.length === filteredUsers.length) {
                                        setSelectedUsers([]);
                                    } else {
                                        setSelectedUsers(filteredUsers.map(user => user.id));
                                    }
                                }} checked={selectedUsers.length === filteredUsers.length} /></th>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Avatar</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} /></td>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td><div className="avatar-placeholder"></div></td>
                                    <td>
                                        <button className="action-button edit-button" onClick={() => handleViewUser(user)}><FaEdit /></button>
                                        <button className="action-button delete-button"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
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
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Render UserInfoModal */}
            {selectedUser && <UserInfoModal user={selectedUser} onClose={handleCloseModal} />}
        </div>
    );
};

export default ManageUserAccount;