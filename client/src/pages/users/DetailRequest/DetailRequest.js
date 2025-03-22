import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { dealPrice, resetError } from "../../../store/actions/userActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./DetailRequest.css";

const DetailRequest = () => {
    const { requestId } = useParams();
    const location = useLocation(); // Lấy dữ liệu từ state của navigate
    const dispatch = useDispatch();
    const { loading, errorViewRequest, errorDealPrice, successDealPrice } = useSelector((state) => state.user);
    const [dealPriceValue, setDealPriceValue] = useState("");
    const [isCancelHovered, setIsCancelHovered] = useState(false);

    // Lấy dữ liệu request từ state của navigate
    const request = location.state?.requestData;

    useEffect(() => {
        if (errorViewRequest) {
            Swal.fire({
                title: "Lỗi",
                text: errorViewRequest,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
        if (errorDealPrice) {
            Swal.fire({
                title: "Lỗi",
                text: errorDealPrice,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
        if (successDealPrice) {
            Swal.fire({
                title: "Thành công",
                text: successDealPrice,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
    }, [errorDealPrice, successDealPrice, errorViewRequest, dispatch]);

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", ");
    };

    const handleDealSubmit = () => {
        const dealData = {
            deal_price: dealPriceValue,
            isDeal: "true", // Gửi isDeal là true khi xác nhận deal
        };
        dispatch(dealPrice(request.parentRequest, dealData));
    };

    const handleCancel = () => {
        const dealData = {
            isDeal: "false", // Gửi isDeal là false khi hủy deal
        };
        setDealPriceValue('');
        dispatch(dealPrice(request.parentRequest, dealData));
    };

    if (loading) return <Loading />;
    if (!request || request._id !== requestId) return <p>Không tìm thấy đơn hàng.</p>;

    return (
        <div className="request-detail-wrapper">
            <div className="request-detail-container animate-fade-in">
                <h2 className="request-title">Chi tiết đơn sửa chữa #{request._id.slice(-6)}</h2>

                <section className="request-section">
                    <h3>Thông tin cơ bản</h3>
                    <div className="request-info-grid">
                        <p><strong>Mô tả vấn đề:</strong> {request.description}</p>
                        <p><strong>Khu vực:</strong> {shortenAddress(request.address)}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                        <p><strong>Trạng thái:</strong> {request.status}</p>
                        <p><strong>Loại dịch vụ:</strong> {request.serviceIndustry_id}</p>
                        <p><strong>Mã đơn gốc:</strong> {request.parentRequest}</p>
                    </div>
                </section>

                <section className="request-section">
                    <h3>Hình ảnh minh họa</h3>
                    <div className="image-list">
                        {request.image && request.image.length > 0 ? (
                            request.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Ảnh ${index}`}
                                    className="request-image animate-image-load"
                                />
                            ))
                        ) : (
                            <p>Không có hình ảnh.</p>
                        )}
                    </div>
                </section>

                <section className="request-section deal-section">
                    <h3>Deal giá</h3>
                    <div className="deal-info">
                        <p>
                            <strong>Khoảng giá đề xuất:</strong>
                            {" "} {request.minPrice?.toLocaleString() || "N/A"} -{" "}
                            {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
                        </p>
                        <div className="deal-input-group">
                            <input
                                type="number"
                                value={dealPriceValue}
                                onChange={(e) => setDealPriceValue(e.target.value)}
                                placeholder="Nhập giá deal (VND)"
                                className="deal-input animate-input-focus"
                            />
                            <div className="deal-buttons">
                                <button onClick={handleDealSubmit} className="confirm-button animate-button">
                                    Xác nhận
                                </button>
                                <button
                                    onClick={handleCancel}
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "1rem",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s ease, transform 0.2s ease",
                                        backgroundColor: isCancelHovered ? "#c82333" : "#dc3545", // Hover: #c82333, normal: #dc3545
                                        color: "white",
                                        transform: isCancelHovered ? "translateY(-2px)" : "none", // Hover: nâng lên 2px
                                    }}
                                    onMouseEnter={() => setIsCancelHovered(true)}
                                    onMouseLeave={() => setIsCancelHovered(false)}
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DetailRequest;


