import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewRequest, viewCustomerRequest, resetError, resetSuccess } from "../../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./ViewRequests.css";

const ViewRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // States from userReducer (both viewRequest and viewCustomerRequest)
    const {
        loading,
        request,
        errorViewRequest,
        customerRequest,
        successRequest,
        errorRequest
    } = useSelector((state) => state.user);

    //console.log(request);

    useEffect(() => {
        // Dispatch both actions to fetch requests
        dispatch(viewRequest());
        dispatch(viewCustomerRequest());
    }, [dispatch]);

    // Handle successRequest with Swal
    // useEffect(() => {
    //     if (successRequest) {
    //         Swal.fire({
    //             icon: "success",
    //             title: "Thành công",
    //             text: successRequest,
    //             timer: 5000,
    //             timerProgressBar: true,
    //             showConfirmButton: false,
    //             showCloseButton: false,
    //         }).then(() => {
    //             dispatch(resetSuccess()); // Reset customer request state
    //         });
    //     }
    // }, [successRequest, dispatch]);

    // Handle errorRequest with Swal
    useEffect(() => {
        if (errorRequest) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorRequest,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset customer request state
            });
        }
    }, [errorRequest, dispatch]);

    // Handle errorViewRequest with Swal
    useEffect(() => {
        if (errorViewRequest) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorViewRequest,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset view request state
            });
        }
    }, [errorViewRequest, dispatch]);

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", ");
    };

    // Handle navigation to detail pages
    const handleViewRequestDetail = (requestData) => {
        navigate(`/repairman/detail-request/${requestData._id}`, {
            state: { requestData },
        });
    };

    const handleViewCustomerRequestDetail = (customerRequest) => {
        navigate(`/repairman/order-detail/${customerRequest._id}`, {
            state: { customerRequest },
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="repairman-requests-container">
            <h2 className="page-title">Danh sách đơn sửa chữa</h2>

            {/* Display customerRequest if it exists */}
            {customerRequest && customerRequest.status === "Proceed with repair" ? (
                <div className="request-card active-request">
                    <div className="request-header">
                        <h3 className="request-title">Đơn hàng đang thực hiện</h3>
                        <span className="request-status active">Thực hiện sửa chữa</span>
                    </div>
                    <p><strong>Mô tả:</strong> {customerRequest.description || "Không có mô tả"}</p>
                    <p><strong>Khu vực:</strong> {shortenAddress(customerRequest.address)}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(customerRequest.createdAt).toLocaleString()}</p>
                    <button
                        className="view-detail-button"
                        onClick={() => handleViewCustomerRequestDetail(customerRequest)}
                    >
                        Xem chi tiết
                    </button>
                </div>
            ) : request && (request.status === "Deal price" || request.status === "Done deal price") ? (
                <div className="request-card">
                    <div className="request-header">
                        <h3 className="request-title">Đơn hàng chờ chốt giá</h3>
                        <span className="request-status">Chờ bạn chốt giá</span>
                    </div>
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
                        onClick={() => handleViewRequestDetail(request)}
                    >
                        Xem chi tiết
                    </button>
                </div>
            ) : (
                <p className="no-requests">Không có đơn sửa chữa nào.</p>
            )}
        </div>
    );
};

export default ViewRequests;