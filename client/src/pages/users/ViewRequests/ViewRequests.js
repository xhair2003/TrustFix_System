import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewRequest } from "../../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import "./ViewRequests.css";
import Loading from "../../../component/Loading/Loading";

const ViewRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, request, errorViewRequest } = useSelector((state) => state.user);

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
        <div className="repairman-requests-container">
            <h2>Danh sách đơn sửa chữa</h2>
            {request ? (
                <div className="request-card">
                    <p><strong>Mô tả:</strong> {request.description}</p>
                    <p><strong>Khu vực:</strong> {shortenAddress(request.address)}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                    {/* Hiển thị vùng giá minPrice - maxPrice */}
                    <p>
                        <strong>Vùng giá:</strong>{" "}
                        {request.minPrice?.toLocaleString() || "N/A"} -{" "}
                        {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
                    </p>
                    <button
                        className="view-detail-button"
                        onClick={() =>
                            navigate(`/repairman/detail-request/${request._id}`, {
                                state: { requestData: request },
                            })
                        }
                    >
                        Xem chi tiết
                    </button>
                </div>
            ) : (
                <p>Không có đơn sửa chữa nào.</p>
            )}
        </div>
    );
};

export default ViewRequests;