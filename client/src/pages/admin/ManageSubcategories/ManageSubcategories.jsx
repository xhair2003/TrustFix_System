import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createService,
    getAllServices,
    updateService,
    deleteService,
    resetError,
    resetSuccess,
    getAllServiceIndustries
} from "../../../store/actions/adminActions";
import "./ManageSubcategories.css";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";

const ManageServices = () => {
    const dispatch = useDispatch();

    const { subcategories, loading, errorSubcategories, successAddSubcategories, successUpdateSubcategories, successDeleteSubcategories,
        errorAddSubcategories, errorUpdateSubcategories, errorDeleteSubcategories, categories } = useSelector(state => state.admin);

    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "add", "edit", "delete"
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({ type: "", serviceIndustry_id: "" }); // Thêm state cho serviceIndustry_id
    const [searchText, setSearchText] = useState(""); // State cho input tìm kiếm
    const [selectedIndustry, setSelectedIndustry] = useState(""); // State cho dropdown loại chuyên mục
    const itemsPerPage = 5; // Items per page

    // Fetch services and service industries on mount
    useEffect(() => {
        dispatch(getAllServices()); // Lấy danh sách dịch vụ
        dispatch(getAllServiceIndustries()); // Lấy danh sách loại chuyên mục
    }, [dispatch]);

    useEffect(() => {
        if (successAddSubcategories || successUpdateSubcategories || successDeleteSubcategories) {
            dispatch(getAllServices()); // Re-fetch services after successful add, update, or delete
        }
    }, [successAddSubcategories, successUpdateSubcategories, successDeleteSubcategories, dispatch]);

    // Filter services based on search text and selected industry
    const filteredServices = subcategories.filter(service =>
        (service.type.toLowerCase().includes(searchText.toLowerCase()) || service._id.toString().includes(searchText)) &&
        (selectedIndustry ? service.serviceIndustry_id._id === selectedIndustry : true)
    );

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

    const openModal = (action, service = null) => {
        setModalAction(action);
        setSelectedService(service);
        if (action === "edit" && service) {
            setFormData({ type: service.type, serviceIndustry_id: service.serviceIndustry_id._id }); // Lấy thông tin khi chỉnh sửa
        } else if (action === "add") {
            setFormData({ type: "", serviceIndustry_id: "" }); // Reset form khi tạo mới
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedService(null);
        setFormData({ type: "", serviceIndustry_id: "" });
    };

    // Hàm thêm dịch vụ mới
    const handleAdd = () => {
        if (!formData.type || !formData.serviceIndustry_id) {
            Swal.fire({
                title: "Lỗi",
                text: "Vui lòng chọn loại chuyên mục và nhập tên danh mục!",
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            return;
        }

        // Gửi cả serviceIndustry_id và type khi tạo mới dịch vụ
        dispatch(createService(formData.serviceIndustry_id, formData.type));
        closeModal();
    };

    const handleEdit = () => {
        // Cập nhật dịch vụ và loại chuyên mục
        dispatch(updateService(selectedService._id, formData.serviceIndustry_id, formData.type)); // Cập nhật dịch vụ
        closeModal();
    };

    const handleDelete = () => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục ${selectedService.type}?`)) {
            dispatch(deleteService(selectedService._id)); // Xóa dịch vụ
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

    const handleIndustryFilterChange = (e) => {
        setSelectedIndustry(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    // Hiển thị thông báo lỗi/thành công từ redux
    useEffect(() => {
        if (errorSubcategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorSubcategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorAddSubcategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorAddSubcategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorUpdateSubcategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorUpdateSubcategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorDeleteSubcategories) {
            Swal.fire({
                title: "Lỗi",
                text: errorDeleteSubcategories,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (successAddSubcategories) {
            Swal.fire({
                title: "Thành công",
                text: successAddSubcategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successUpdateSubcategories) {
            Swal.fire({
                title: "Thành công",
                text: successUpdateSubcategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successDeleteSubcategories) {
            Swal.fire({
                title: "Thành công",
                text: successDeleteSubcategories,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }
    }, [dispatch, errorSubcategories, successAddSubcategories, successUpdateSubcategories, successDeleteSubcategories, errorAddSubcategories, errorUpdateSubcategories, errorDeleteSubcategories]);

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ DANH MỤC SỬA CHỮA</h2>

                {/* Input tìm kiếm và dropdown lọc */}
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID hoặc tên danh mục"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <select
                        name="serviceIndustry_id"
                        value={selectedIndustry}
                        onChange={handleIndustryFilterChange}
                    >
                        <option value="">Chọn loại chuyên mục</option>
                        {categories && categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.type}
                            </option>
                        ))}
                    </select>
                    <button className="add-button" onClick={() => openModal("add")}>Thêm danh mục</button>
                </div>

                {loading ? (
                    <p><Loading /></p>
                ) : errorSubcategories ? (
                    <p>{errorSubcategories}</p>
                ) : (
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Loại chuyên mục</th>
                                <th>Tên danh mục</th>
                                <th>Ngày tạo</th>
                                <th>Ngày cập nhật</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedServices.map((service) => (
                                <tr key={service._id}>
                                    <td>{service._id}</td>
                                    <td>{service.serviceIndustry_id.type}</td>
                                    <td>{service.type}</td>
                                    <td>{formatDateTime(service.createdAt)}</td>
                                    <td>{formatDateTime(service.updatedAt)}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openModal("edit", service)}>Sửa</button>
                                        <button className="delete-button" onClick={() => openModal("delete", service)}>Xóa</button>
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
                                <label>Chọn loại chuyên mục:</label>
                                <select
                                    name="serviceIndustry_id"
                                    value={formData.serviceIndustry_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn loại chuyên mục</option>
                                    {categories && categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.type}
                                        </option>
                                    ))}
                                </select>
                                <label>Tên danh mục:</label>
                                <input type="text" name="type" value={formData.type} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <p>Bạn có chắc chắn muốn xóa "{selectedService.type}" không?</p>
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

export default ManageServices;
