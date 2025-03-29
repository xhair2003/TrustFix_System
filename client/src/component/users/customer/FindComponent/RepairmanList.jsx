import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewRepairmanDeal } from "../../../../store/actions/userActions.js";
import RepairmanInfoModal from "../../RepairmanInforModal/RepairmanInforModal.js";
import "./RepairmanList.css";

const RepairmanList = ({ requestId }) => {
    const dispatch = useDispatch();
    const { loading, repairmanDeals, errorViewRepairmanDeal } = useSelector(state => state.user);

    const [selectedRepairman, setSelectedRepairman] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log("requestId", requestId);
    console.log("repairmanDeals", repairmanDeals);

    useEffect(() => {
        if (requestId && (!repairmanDeals || repairmanDeals.length === 0)) {
            dispatch(viewRepairmanDeal(requestId));
        }
    }, [dispatch, requestId, repairmanDeals]);

    // useEffect(() => {
    //     console.log("repairmanDeals thay đổi:", repairmanDeals); // Chỉ log khi repairmanDeals thay đổi
    // }, [repairmanDeals]);

    const handleViewDetails = (repairman) => {
        const formattedRepairman = {
            repairmanId: repairman.repairman._id,
            fullName: `${repairman.repairman.firstName} ${repairman.repairman.lastName}`,
            profileImage: repairman.repairman.imgAvt || null,
            description: repairman.repairman.description || "Không có mô tả",
            dealPrice: repairman.dealPrice?.priceToPay || 0,
            certificationImages: repairman.certificationImages || [],
            bookingCount: repairman.bookingCount || 0,
            reviews: repairman.ratings.map(rating => ({
                reviewerName: "Ẩn danh",
                date: new Date(rating.createdAt).toLocaleDateString("vi-VN"),
                rating: rating.rate,
                comment: rating.comment,
            })),
        };
        const formattedRequest = {
            requestId: repairman.request._id,
            address: repairman.request.address,
            image: repairman.request.image || null,
            descriptions: repairman.request.description || "Không có mô tả",
            status: repairman.request.status,
            createdAt: new Date(repairman.request.createdAt).toLocaleDateString("vi-VN"),
        };
        setSelectedRepairman(formattedRepairman);
        setSelectedRequest(formattedRequest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRepairman(null);
        setSelectedRequest(null);
    };

    if (loading) {
        return <p>Đang tải danh sách thợ...</p>;
    }

    return (
        <div className="repairman-list">
            <h3>Danh sách thợ đã deal giá</h3>
            {repairmanDeals && repairmanDeals.length > 0 ? (
                <ul>
                    {repairmanDeals.map((repairman, index) => (
                        <li key={index} className="repairman-item">
                            <div className="repairman-info">
                                <span className="repairman-name">
                                    {repairman.repairman.firstName} {repairman.repairman.lastName}
                                </span>
                                <span className="repairman-service">
                                    {repairman.repairman.description || "Không có mô tả dịch vụ"}
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

export default React.memo(RepairmanList, (prevProps, nextProps) => {
    return prevProps.requestId === nextProps.requestId;
});