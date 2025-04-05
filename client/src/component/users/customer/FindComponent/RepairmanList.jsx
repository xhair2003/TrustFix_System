import React, { useState } from "react";
import RepairmanInfoModal from "../../RepairmanInforModal/RepairmanInforModal.js";
import "./RepairmanList.css";

const RepairmanList = ({ repairmanDeals }) => {
    const [selectedRepairman, setSelectedRepairman] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //console.log(repairmanDeals);

    // Xử lý hiển thị chi tiết thợ
    const handleViewDetails = (repairman) => {
        const formattedRepairman = {
            repairmanId: repairman.repairman._id,
            email: repairman.repairman.user_id.email || "Không có email",
            phone: repairman.repairman.user_id.phone || "Không có số điện thoại",
            fullName: `${repairman.repairman.user_id.firstName} ${repairman.repairman.user_id.lastName}`,
            profileImage: repairman.repairman.user_id.imgAvt || null,
            description: repairman.repairman.user_id.description || "Không có mô tả",
            dealPrice: repairman.dealPrice?.priceToPay || 0,
            certificationImages: repairman.repairman.certificationImages || [],
            bookingCount: repairman.repairman.bookingCount || 0,
            reviews: repairman.ratings.map((rating) => ({
                reviewerName: "Ẩn danh",
                date: new Date(rating.createdAt).toLocaleDateString("vi-VN"),
                rating: rating.rate,
                comment: rating.comment,
            })),
        };
        const formattedRequest = {
            requestId: repairman.request._id,
            address: repairman.request.address,
            image: repairman.request.image || [],
            descriptions: repairman.request.description || "Không có mô tả",
            status: repairman.request.status,
            createdAt: new Date(repairman.request.createdAt).toLocaleDateString("vi-VN"),
            parentRequest: repairman.request.parentRequest || null,
        };
        setSelectedRepairman(formattedRepairman);
        setSelectedRequest(formattedRequest);
        setIsModalOpen(true);
        //console.log("selectedRepairman", selectedRepairman);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRepairman(null);
        setSelectedRequest(null);
    };

    return (
        <div className="repairman-list">
            <h3>Danh sách thợ đã deal giá</h3>
            {repairmanDeals && repairmanDeals.length > 0 ? (
                <ul>
                    {repairmanDeals.map((repairman, index) => (
                        <li key={index} className="repairman-item">
                            <div className="repairman-info">
                                <span className="repairman-name">
                                    {repairman.repairman.user_id.firstName} {repairman.repairman.user_id.lastName}
                                </span>
                                <span className="repairman-service">
                                    {repairman.repairman.user_id.description || "Không có mô tả"}
                                </span>
                            </div>
                            <div className="repairman-price">
                                <span>{repairman.dealPrice?.priceToPay.toLocaleString("vi-VN") || 0} VNĐ</span>
                                <button className="deal-button" onClick={() => handleViewDetails(repairman)}>
                                    Xem chi tiết
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Chưa có thợ nào deal giá.</p>
            )}

            <RepairmanInfoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                repairman={selectedRepairman}
                request={selectedRequest}
            />
        </div>
    );
};

export default RepairmanList;