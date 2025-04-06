import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dealPrice,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./DetailRequest.css";
import { useLocation, useNavigate } from "react-router-dom";

const DetailRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, errorDealPrice, successDealPrice } = useSelector((state) => state.user);
  const [dealPriceValue, setDealPriceValue] = useState("");
  const { requestData, status } = location.state || {};

  const storedDealPrices = JSON.parse(localStorage.getItem("deal_prices") || "{}");
  const storedDealPrice = storedDealPrices[requestData.parentRequest];

  useEffect(() => {
    if (status !== false) {
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
        const updatedDealPrices = {
          ...storedDealPrices,
          [requestData.parentRequest]: dealPriceValue,
        };
        const keys = Object.keys(updatedDealPrices);
        if (keys.length > 100) {
          delete updatedDealPrices[keys[0]];
        }
        localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
        dispatch(resetSuccess());
        navigate("/repairman/view-requests");
      }
    }
  }, [errorDealPrice, successDealPrice, dispatch, navigate, status, dealPriceValue, requestData.parentRequest, storedDealPrices]);

  const shortenAddress = (address) => {
    const parts = address.split(", ");
    return parts.slice(1, 4).join(", ");
  };

  const handleDealSubmit = () => {
    Swal.fire({
      title: "Xác nhận Deal giá?",
      text: `Bạn có chắc muốn deal với giá ${dealPriceValue} VNĐ không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const dealData = {
          deal_price: dealPriceValue,
          isDeal: "true",
        };
        dispatch(dealPrice(requestData.parentRequest, dealData));
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Xác nhận hủy bỏ?",
      text: "Bạn có chắc muốn hủy bỏ deal giá không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const dealData = {
          isDeal: "false",
        };
        setDealPriceValue("");
        dispatch(dealPrice(requestData.parentRequest, dealData));
        const updatedDealPrices = { ...storedDealPrices };
        delete updatedDealPrices[requestData.parentRequest];
        localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
        navigate(-1);
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1); // Đóng modal bằng cách quay lại trang trước
  };

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div
        className="request-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="request-title">
          Chi tiết đơn sửa chữa #{requestData._id.slice(-6)}
        </h2>

        <section className="request-section">
          <h3>Thông tin cơ bản</h3>
          <div className="request-info-grid">
            <p>
              <strong>Mô tả vấn đề:</strong> {requestData.description}
            </p>
            <p>
              <strong>Khu vực:</strong> {shortenAddress(requestData.address)}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(requestData.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              {
                requestData.status === "Completed" ? "Đã hoàn thành" :
                  requestData.status === "Confirmed" ? "Đã xác nhận" :
                    requestData.status === "Pending" ? "Đang chờ xử lý" :
                      requestData.status === "Cancelled" ? "Đã hủy" :
                        requestData.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                          requestData.status === "Deal price" ? "Thỏa thuận giá" :
                            requestData.status === "Done deal price" ? "Đã chốt giá" :
                              requestData.status === "Make payment" ? "Chờ thanh toán" :
                                requestData.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                                  requestData.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                    "Trạng thái không xác định"
              }
            </p>
          </div>
        </section>

        <section className="request-section">
          <h3>Hình ảnh minh họa</h3>
          <div className="image-list">
            {requestData.image && requestData.image.length > 0 ? (
              requestData.image.map((img, index) => (
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

        {status !== false ? (
          <section className="request-section deal-section">
            <h3>Deal giá</h3>
            <div className="deal-info">
              <p>
                <strong>Khoảng giá đề xuất:</strong>{" "}
                {requestData.minPrice?.toLocaleString() || "N/A"} -{" "}
                {requestData.maxPrice?.toLocaleString() || "N/A"} VNĐ
              </p>
              <div className="deal-input-group">
                <input
                  type="number"
                  value={dealPriceValue}
                  onChange={(e) => setDealPriceValue(e.target.value)}
                  placeholder="Nhập giá deal (VND)"
                  className="deal-input"
                />
                <div className="deal-buttons-container">
                  <div className="deal-buttons">
                    <button onClick={handleDealSubmit} className="confirm-button">
                      Xác nhận
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                      Hủy bỏ
                    </button>
                  </div>
                  <button onClick={handleClose} className="close-button">
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="request-section deal-section">
            <h3>Thông tin Deal</h3>
            <div className="deal-info">
              <p>
                <strong>Giá đã Deal:</strong>{" "}
                {storedDealPrice ? `${Number(storedDealPrice).toLocaleString()} VNĐ` : "Chưa có thông tin giá deal"}
              </p>
              <button onClick={handleBack} className="back-button">
                Trở về
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DetailRequest;