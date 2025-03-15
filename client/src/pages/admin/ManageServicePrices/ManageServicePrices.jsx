import React, { useState } from "react";
import './ManageServicePrices.css';

const ManageServicePrices = () => {
    const [services, setServices] = useState([
        { id: 1, createdAt: "2025-03-01", updatedAt: "2025-03-10", type: "VIP Basic", description: "Gói cơ bản cho khách VIP", price: 500000, status: "active" },
        { id: 2, createdAt: "2025-03-02", updatedAt: "2025-03-11", type: "VIP Premium", description: "Gói cao cấp cho khách VIP", price: 1000000, status: "active" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "add", "edit", "delete"
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({ type: "", description: "", price: "", status: "" });
    const itemsPerPage = 5; // Số mục mỗi trang

    // Tính toán phân trang
    const totalPages = Math.ceil(services.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = services.slice(startIndex, startIndex + itemsPerPage);

    // Mở modal cho hành động cụ thể
    const openModal = (action, service = null) => {
        setModalAction(action);
        setSelectedService(service);
        if (action === "edit" && service) {
            setFormData({ type: service.type, description: service.description, price: service.price, status: service.status });
        } else if (action === "add") {
            setFormData({ type: "", description: "", price: "", status: "active" });
        }
        setModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedService(null);
        setFormData({ type: "", description: "", price: "", status: "" });
    };

    // Xử lý thêm dịch vụ
    const handleAdd = () => {
        const newService = {
            id: services.length + 1, // Giả lập ID
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            type: formData.type,
            description: formData.description,
            price: parseInt(formData.price),
            status: formData.status,
        };
        setServices([...services, newService]);
        closeModal();
    };

    // Xử lý sửa dịch vụ
    const handleEdit = () => {
        const updatedServices = services.map((service) =>
            service.id === selectedService.id
                ? { ...service, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
                : service
        );
        setServices(updatedServices);
        closeModal();
    };

    // Xử lý xóa dịch vụ
    const handleDelete = () => {
        const updatedServices = services.filter((service) => service.id !== selectedService.id);
        setServices(updatedServices);
        closeModal();
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
                <h2 className="complaint-title">QUẢN LÝ GIÁ DỊCH VỤ VIP</h2>

                {/* Nút thêm dịch vụ */}
                <button className="add-button" onClick={() => openModal("add")}>
                    Thêm dịch vụ
                </button>

                {/* Bảng danh sách dịch vụ */}
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày Tạo</th>
                            <th>Ngày Cập Nhật</th>
                            <th>Loại Dịch Vụ</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedServices.map((service) => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.createdAt}</td>
                                <td>{service.updatedAt}</td>
                                <td>{service.type}</td>
                                <td>{service.description}</td>
                                <td>{service.price.toLocaleString()} VNĐ</td>
                                <td>{service.status}</td>
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
                                    name="type"
                                    value={formData.type}
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
                                <label>Trạng thái:</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        ) : (
                            <p>Bạn có chắc chắn muốn xóa "{selectedService.type}" không?</p>
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