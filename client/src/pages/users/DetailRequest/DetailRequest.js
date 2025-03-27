import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dealPrice, resetError } from "../../../store/actions/userActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./DetailRequest.css";

const DetailRequest = ({ request, onClose }) => {
    const dispatch = useDispatch();
    const { loading, errorViewRequest, errorDealPrice, successDealPrice } = useSelector((state) => state.user);
    const [dealPriceValue, setDealPriceValue] = useState("");

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
            onClose(); // Đóng modal khi thành công
        }
    }, [errorDealPrice, successDealPrice, errorViewRequest, dispatch, onClose]);

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", ");
    };

    const handleDealSubmit = () => {
        const dealData = {
            deal_price: dealPriceValue,
            isDeal: "true",
        };
        dispatch(dealPrice(request.parentRequest, dealData));
    };

    const handleCancel = () => {
        const dealData = {
            isDeal: "false",
        };
        setDealPriceValue("");
        dispatch(dealPrice(request.parentRequest, dealData));
        onClose(); // Đóng modal
    };

    if (loading) return <Loading />;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="request-detail-container" onClick={(e) => e.stopPropagation()}>
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
                                    className="request-image"
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
                            <strong>Khoảng giá đề xuất:</strong>{" "}
                            {request.minPrice?.toLocaleString() || "N/A"} -{" "}
                            {request.maxPrice?.toLocaleString() || "N/A"} VNĐ
                        </p>
                        <div className="deal-input-group">
                            <input
                                type="number"
                                value={dealPriceValue}
                                onChange={(e) => setDealPriceValue(e.target.value)}
                                placeholder="Nhập giá deal (VND)"
                                className="deal-input"
                            />
                            <div className="deal-buttons">
                                <button onClick={handleDealSubmit} className="confirm-button">
                                    Xác nhận
                                </button>
                                <button onClick={handleCancel} className="cancel-button">
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