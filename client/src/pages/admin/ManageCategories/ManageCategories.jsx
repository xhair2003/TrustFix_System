import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createServiceIndustry,
    getAllServiceIndustries,
    updateServiceIndustry,
    deleteServiceIndustry,
    resetError,
    resetSuccess
} from "../../../store/actions/adminActions"; // Adjust the import path as needed
import "./ManageCategories.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";

const ManageCategories = () => {
    const dispatch = useDispatch();

    const { categories, loading, errorCategories, successAddCategories, successUpdateCategories, successDeleteCategories
        , errorAddCategories, errorUpdateCategories, errorsDeleteCategories
    } = useSelector(state => state.admin);

    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "add", "edit", "delete"
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ type: "" });
    const [searchText, setSearchText] = useState(""); // State cho input tìm kiếm
    const itemsPerPage = 5; // Items per page

    useEffect(() => {
        dispatch(getAllServiceIndustries()); // Lấy danh sách loại chuyên mục
    }, [dispatch]);

    useEffect(() => {
        if (successAddCategories || successUpdateCategories || successDeleteCategories) {
            dispatch(getAllServiceIndustries()); // Re-fetch after successful add, update, or delete
        }
    }, [successAddCategories, successUpdateCategories, successDeleteCategories, dispatch]);

    // Filter categories based on search text
    const filteredCategories = categories.filter(category =>
        category.type.toLowerCase().includes(searchText.toLowerCase()) || category._id.toString().includes(searchText)
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const openModal = (action, category = null) => {
        setModalAction(action);
        setSelectedCategory(category);
        if (action === "edit" && category) {
            setFormData({ type: category.type });
        } else if (action === "add") {
            setFormData({ type: "" });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedCategory(null);
        setFormData({ type: "" });
    };

    const handleAdd = () => {
        dispatch(createServiceIndustry(formData.type));
        closeModal();
    };

    const handleEdit = () => {
        if (!selectedCategory || !selectedCategory._id) {
            Swal.fire({
                title: "Lỗi",
                text: "ID không hợp lệ!",
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            return;
        }

        dispatch(updateServiceIndustry(selectedCategory._id, formData.type));
        closeModal();
    };

    const handleDelete = () => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên mục ${selectedCategory.type}?`)) {
            dispatch(deleteServiceIndustry(selectedCategory._id));
            closeModal();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    useEffect(() => {
        if (errorCategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorCategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorAddCategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorAddCategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorUpdateCategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorUpdateCategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorsDeleteCategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorsDeleteCategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (successAddCategories) {
            Swal.fire({
                title: "Thành công",
                text: successAddCategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successUpdateCategories) {
            Swal.fire({
                title: "Thành công",
                text: successUpdateCategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successDeleteCategories) {
            Swal.fire({
                title: "Thành công",
                text: successDeleteCategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }
    }, [dispatch, errorCategories, successAddCategories, successUpdateCategories, successDeleteCategories, errorAddCategories, errorUpdateCategories, errorsDeleteCategories]);

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ CHUYÊN MỤC SỬA CHỮA</h2>

                {/* Thêm input tìm kiếm và button Thêm chuyên mục */}
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID hoặc tên chuyên mục"
                        value={searchText}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button className="add-button" onClick={() => openModal("add")}>Thêm chuyên mục</button>
                </div>

                {loading ? (
                    <p><Loading /></p>
                ) : errorCategories ? (
                    <p>{errorCategories}</p>
                ) : (
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên chuyên mục</th>
                                <th>Ngày tạo</th>
                                <th>Ngày cập nhật</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category._id}</td>
                                    <td>{category.type}</td>
                                    <td>{formatDateTime(category.createdAt)}</td>
                                    <td>{formatDateTime(category.updatedAt)}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openModal("edit", category)}>Sửa</button>
                                        <button className="delete-button" onClick={() => openModal("delete", category)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
                </div>
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{modalAction === "add" ? "Thêm danh mục" : modalAction === "edit" ? "Sửa danh mục" : "Xóa danh mục"}</h3>
                        {modalAction !== "delete" ? (
                            <div className="modal-form">
                                <label>Tên danh mục:</label>
                                <input type="text" name="type" value={formData.type} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <p>Bạn có chắc chắn muốn xóa "{selectedCategory.type}" không?</p>
                        )}

                        <div className="modal-buttons">
                            {modalAction === "add" && <button onClick={handleAdd}>Thêm</button>}
                            {modalAction === "edit" && <button onClick={handleEdit}>Lưu</button>}
                            {modalAction === "delete" && <button onClick={handleDelete}>Xóa</button>}
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
