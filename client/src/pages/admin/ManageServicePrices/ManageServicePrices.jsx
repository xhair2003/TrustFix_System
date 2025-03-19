import React, { useState, useEffect } from "react";
import './ManageServicePrices.css';
import { useDispatch, useSelector } from 'react-redux';
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import {
    fetchSevicePrices,
    addServicePrice,
    updateServicePrice,
    deleteServicePrice,
    resetError,
    resetSuccess
} from "../../../store/actions/adminActions";

const ManageServicePrices = () => {
    const dispatch = useDispatch();
    const { servicePrices, loading, errorServicePrices, successAddServicePrices, errorAddServicePrices,
        successUpdateServicePrices, errorUpdateServicePrices, successDeleteServicePrices, errorDeleteServicePrices
    } = useSelector(state => state.admin);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "add", "edit", "delete"
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", description: "", status: "" });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchSevicePrices()); // Fetch service prices on component mount
    }, [dispatch]);

    useEffect(() => {
        if (successAddServicePrices || successUpdateServicePrices || successDeleteServicePrices) {
            dispatch(fetchSevicePrices()); // Re-fetch after successful add, update, or delete
        }
    }, [successAddServicePrices, successUpdateServicePrices, successDeleteServicePrices, dispatch]);

    useEffect(() => {
        if (errorServicePrices) {
            Swal.fire({
                title: "Lỗi",
                text: errorServicePrices,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorAddServicePrices) {
            Swal.fire({
                title: "Lỗi",
                text: errorAddServicePrices,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorUpdateServicePrices) {
            Swal.fire({
                title: "Lỗi",
                text: errorUpdateServicePrices,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (errorDeleteServicePrices) {
            Swal.fire({
                title: "Lỗi",
                text: errorDeleteServicePrices,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }

        if (successAddServicePrices) {
            Swal.fire({
                title: "Thành công",
                text: successAddServicePrices,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successUpdateServicePrices) {
            Swal.fire({
                title: "Thành công",
                text: successUpdateServicePrices,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }

        if (successDeleteServicePrices) {
            Swal.fire({
                title: "Thành công",
                text: successDeleteServicePrices,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
        }
    }, [dispatch, errorServicePrices, successAddServicePrices, errorAddServicePrices,
        successUpdateServicePrices, errorUpdateServicePrices, successDeleteServicePrices, errorDeleteServicePrices]);

    // Calculate pagination
    const totalPages = Math.ceil(servicePrices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = servicePrices.slice(startIndex, startIndex + itemsPerPage);

    // Open modal for add/edit/delete
    const openModal = (action, service = null) => {
        setModalAction(action);
        setSelectedService(service);
        if (action === "edit" && service) {
            setFormData({
                name: service.name,
                price: service.price,
                description: service.description,
                status: service.status
            });
        } else if (action === "add") {
            setFormData({ name: "", price: "", description: "", status: "active" });
        }
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedService(null);
        setFormData({ name: "", price: "", description: "", status: "" });
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle adding service price
    const handleAdd = () => {
        dispatch(addServicePrice(formData.name, formData.price, formData.description));
        closeModal();
    };

    // Handle editing service price
    const handleEdit = () => {
        dispatch(updateServicePrice(formData.name, formData.price, formData.description));
        closeModal();
    };

    // Handle deleting service price
    const handleDelete = () => {
        dispatch(deleteServicePrice(selectedService._id));
        closeModal();
    };

    // Handle page change
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

    return (
        <div className="history-container">
            <div className="history-form">
                <h2 className="complaint-title">QUẢN LÝ GIÁ DỊCH VỤ</h2>

                {/* Add button */}
                <button className="add-button" onClick={() => openModal("add")}>
                    Thêm dịch vụ
                </button>

                {/* Loading spinner */}
                {loading && <Loading />}

                {/* Error handling */}
                {errorServicePrices && (
                    <div className="error-message">
                        <p>{errorServicePrices}</p>
                    </div>
                )}

                {/* Service price table */}
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Loại Dịch Vụ</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Ngày Tạo</th>
                            <th>Ngày Cập Nhật</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedServices.map((service) => (
                            <tr key={service._id}>
                                <td>{service._id}</td>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>{service.price.toLocaleString()}</td>
                                <td>{formatDateTime(service.createdAt)}</td>
                                <td>{formatDateTime(service.updatedAt)}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => openModal("edit", service)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => openModal("delete", service)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
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

            {/* Modal for add/edit/delete */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>
                            {modalAction === "add"
                                ? "Thêm dịch vụ"
                                : modalAction === "edit"
                                    ? "Sửa dịch vụ"
                                    : "Xóa dịch vụ"}
                        </h3>

                        {modalAction !== "delete" ? (
                            <div className="modal-form">
                                <label>Loại dịch vụ:</label>
                                <input
                                    type="text"
                                    name="serviceName"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <label>Mô tả:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                                <label>Giá:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ) : (
                            <p>Bạn có chắc chắn muốn xóa "{selectedService.name}" không?</p>
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

export default ManageServicePrices;
