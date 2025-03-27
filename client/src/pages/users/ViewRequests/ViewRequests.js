import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewRequest } from "../../../store/actions/userActions";
import "./ViewRequests.css";
import Loading from "../../../component/Loading/Loading";
import DetailRequest from "../DetailRequest/DetailRequest";

const ViewRequests = () => {
    const dispatch = useDispatch();
    const { loading, request, errorViewRequest } = useSelector((state) => state.user);
    const [selectedRequest, setSelectedRequest] = useState(null); // State để quản lý modal

    useEffect(() => {
        dispatch(viewRequest());
    }, [dispatch]);

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", ");
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="history-container">
            <div className="history-form">
            <h2 className="complaint-title">DANH SÁCH ĐƠN HÀNG</h2>
            {request ? (
                <div className="request-card">
                    <p><strong>Mô tả:</strong> {request.description}</p>
                    <p><strong>Khu vực:</strong> {shortenAddress(request.address)}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                    <p>
                        <strong>Vùng giá:</strong>{" "}
                        {request.minPrice?.toLocaleString() || "N/A"} -{" "}
                        {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
                    </p>
                    <button
                        className="view-detail-button"
                        onClick={() => setSelectedRequest(request)} // Mở modal
                    >
                        Xem chi tiết
                    </button>
                </div>
            ) : (
                <p>Không có đơn sửa chữa nào.</p>
            )}

            {/* Hiển thị modal khi có request được chọn */}
            {selectedRequest && (
                <DetailRequest
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)} // Đóng modal
                />
            )}

            </div>
        </div>
    );
};

export default ViewRequests;