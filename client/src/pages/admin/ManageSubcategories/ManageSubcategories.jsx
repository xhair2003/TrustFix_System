import React, { useState } from "react";
import "./ManageSubcategories.css"; // File CSS riêng cho component này

const ManageCategories = () => {
    // Dữ liệu giả lập (thay bằng API thực tế nếu có)
    const initialCategories = [
        { id: 1, name: "Sửa ống nước", description: "Xử lý các vấn đề về ống nước" },
        { id: 2, name: "Sửa điện", description: "Sửa chữa hệ thống điện" },
        { id: 3, name: "Sửa máy lạnh", description: "Bảo trì và sửa máy lạnh" },
    ];

    const [categories, setCategories] = useState(initialCategories);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "add", "edit", "delete"
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const itemsPerPage = 5; // Số mục mỗi trang

    // Tính toán phân trang
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

    // Mở modal cho hành động cụ thể
    const openModal = (action, category = null) => {
        setModalAction(action);
        setSelectedCategory(category);
        if (action === "edit" && category) {
            setFormData({ name: category.name, description: category.description });
        } else if (action === "add") {
            setFormData({ name: "", description: "" });
        }
        setModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedCategory(null);
        setFormData({ name: "", description: "" });
    };

    // Xử lý thêm danh mục
    const handleAdd = () => {
        const newCategory = {
            id: categories.length + 1, // Giả lập ID, thay bằng logic thực tế nếu dùng API
            name: formData.name,
            description: formData.description,
        };
        setCategories([...categories, newCategory]);
        closeModal();
    };

    // Xử lý sửa danh mục
    const handleEdit = () => {
        const updatedCategories = categories.map((cat) =>
            cat.id === selectedCategory.id ? { ...cat, ...formData } : cat
        );
        setCategories(updatedCategories);
        closeModal();
    };

    // Xử lý xóa danh mục
    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            const updatedCategories = categories.filter((cat) => cat.id !== selectedCategory.id);
            setCategories(updatedCategories);
            closeModal();
        }
    };

    // Xử lý thay đổi input trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Chuyển trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ DANH MỤC SỬA CHỮA</h2>

                {/* Nút thêm danh mục */}
                <button className="add-button" onClick={() => openModal("add")}>
                    Thêm danh mục
                </button>

                {/* Bảng danh mục */}
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCategories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => openModal("edit", category)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => openModal("delete", category)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Modal cho thêm/sửa/xóa */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>
                            {modalAction === "add"
                                ? "Thêm danh mục"
                                : modalAction === "edit"
                                    ? "Sửa danh mục"
                                    : "Xóa danh mục"}
                        </h3>

                        {modalAction !== "delete" ? (
                            <div className="modal-form">
                                <label>Tên danh mục:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <label>Mô tả:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ) : (
                            <p>Bạn có chắc chắn muốn xóa "{selectedCategory.name}" không?</p>
                        )}

                        <div className="modal-buttons">
                            {modalAction === "add" && (
                                <button onClick={handleAdd}>Thêm</button>
                            )}
                            {modalAction === "edit" && (
                                <button onClick={handleEdit}>Lưu</button>
                            )}
                            {modalAction === "delete" && (
                                <button onClick={handleDelete}>Xóa</button>
                            )}
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;