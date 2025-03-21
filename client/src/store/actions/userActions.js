import axios from 'axios';

const API_URL_CUSTOMER = 'http://localhost:8080/api/customer'; // Địa chỉ API
const API_URL_REPAIRMAN = 'http://localhost:8080/api/repairman'; // Địa chỉ API

export const getUserInfo = () => async (dispatch, getState) => {
    dispatch({ type: "GET_USER_INFO_REQUEST" }); // Bắt đầu loading

    // Lấy token từ Redux store
    const { auth } = getState(); // Lấy state auth từ Redux
    const token = auth.token; // Giả sử token được lưu trong state.auth.token

    //console.log('Token from Redux:', token); // In ra token để kiểm tra

    try {
        const response = await axios.get(`${API_URL_CUSTOMER}/user-info`, {
            headers: {
                //Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
                Authorization: `Bearer ${token}`, // Sử dụng token từ Redux
            },
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "GET_USER_INFO_SUCCESS",
                payload: response.data.DT, // Lưu thông tin người dùng
            });
        } else {
            dispatch({
                type: "GET_USER_INFO_FAIL",
                payload: response.data.EM, // Lưu thông báo lỗi
            });
        }

        return response.data; // Trả về dữ liệu từ API

    } catch (error) {
        dispatch({
            type: "GET_USER_INFO_FAIL",
            payload: error.response.data.EM, // Lưu thông báo lỗi
        });

        return error.response.data; // Trả về dữ liệu từ API nếu lỗi
    }
};

export const submitComplaint = (complaintData) => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    dispatch({ type: "SUBMIT_COMPLAINT_REQUEST" });

    try {
        const formData = new FormData();
        // Thêm các thuộc tính khác vào FormData
        formData.append('request_id', complaintData.request_id);
        formData.append('complaintType', complaintData.complaintType);
        formData.append('complaintContent', complaintData.complaintContent);
        formData.append('requestResolution', complaintData.requestResolution);

        // Kiểm tra xem userData.image có phải là một file không
        if (complaintData.image instanceof File) {
            formData.append('image', complaintData.image); // File ảnh
        } else {
            console.error("userData.image is not a valid file");
        }

        const response = await axios.post('http://localhost:8080/api/customer/complaints', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Đặt header cho FormData
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "SUBMIT_COMPLAINT_SUCCESS",
                payload: response.data.EM, // Thông báo thành công
            });
        } else {
            dispatch({
                type: "SUBMIT_COMPLAINT_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "SUBMIT_COMPLAINT_FAIL",
            payload: error.response?.data?.EM || 'Lỗi khi gửi khiếu nại',
        });
    }
};

// Action để cập nhật thông tin người dùng
export const updateUserInfo = (userData) => async (dispatch, getState) => {
    // Lấy token từ Redux store
    const { auth } = getState(); // Lấy state auth từ Redux
    const token = auth.token; // Giả sử token được lưu trong state.auth.token

    //console.log('Token from Redux:', token); // In ra token để kiểm tra

    try {
        dispatch({ type: "UPDATE_USER_INFO_REQUEST" });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // Vì có upload file ảnh
                //Authorization: `Bearer ${localStorage.getItem('token')}`, // Token từ localStorage
                Authorization: `Bearer ${token}`, // Sử dụng token từ Redux
            },
        };

        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        if (userData.email) formData.append('email', userData.email);
        if (userData.firstName) formData.append('firstName', userData.firstName);
        if (userData.lastName) formData.append('lastName', userData.lastName);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.address) formData.append('address', userData.address);
        if (userData.description) formData.append('description', userData.description);

        // Append the image file if it exists
        if (userData.imgAvt instanceof File) {
            formData.append('image', userData.imgAvt); // Ensure this is the file object
        }

        const { data } = await axios.post(`${API_URL_CUSTOMER}/manage-infor`, formData, config);

        if (data.EC === 1) {
            dispatch({ type: "UPDATE_USER_INFO_SUCCESS", payload: data });
        } else {
            throw new Error(data.EM);
        }
    } catch (error) {
        dispatch({
            type: "UPDATE_USER_INFO_FAIL",
            payload: error.response?.data?.EM || 'Cập nhật thông tin thất bại',
        });
    }
};



// Action để reset lỗi
export const resetError = () => {
    return {
        type: "RESET_ERROR",
    };
};

// Action để reset thành công
export const resetSuccess = () => {
    return {
        type: "RESET_SUCCESS",
    };
};



export const fetchDepositHistory = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    dispatch({ type: "FETCH_DEPOSIT_HISTORY_REQUEST" });

    try {
        const response = await axios.get('http://localhost:8080/api/customer/depositeHistory', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_DEPOSIT_HISTORY_SUCCESS",
                payload: response.data.DT, // Dữ liệu lịch sử nạp tiền
            });
        } else {
            dispatch({
                type: "FETCH_DEPOSIT_HISTORY_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_DEPOSIT_HISTORY_FAIL",
            payload: error.response?.data?.EM || 'Lỗi khi lấy lịch sử nạp tiền',
        });
    }
};

export const fetchtHistoryPayment = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    dispatch({ type: "FETCH_HISTORY_PAYMENT_REQUEST" });

    try {
        const response = await axios.get('http://localhost:8080/api/customer/historyPayment', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_HISTORY_PAYMENT_SUCCESS",
                payload: response.data.DT, // Dữ liệu lịch sử nạp tiền
            });
        } else {
            dispatch({
                type: "FETCH_HISTORY_PAYMENT_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_HISTORY_PAYMENT_FAIL",
            payload: error.response?.data?.EM || 'Lỗi khi lấy lịch sử thanh toán',
        });
    }
};



export const fetchAllVips = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    dispatch({ type: "FETCH_VIPS_REQUEST" });

    try {
        const response = await axios.get('http://localhost:8080/api/repairman/list-vips', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_VIPS_SUCCESS",
                payload: response.data.DT, // Dữ liệu VIP
            });
        } else {
            dispatch({
                type: "FETCH_VIPS_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_VIPS_FAIL",
            payload: error.response?.data?.EM || 'Lỗi khi lấy danh sách VIP',
        });
    }
};

export const fetchBalance = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    dispatch({ type: "FETCH_BALANCE_REQUEST" });

    try {
        const response = await axios.get('http://localhost:8080/api/customer/getBalance', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_BALANCE_SUCCESS",
                payload: response.data.DT, // Dữ liệu số dư
            });
        } else {
            dispatch({
                type: "FETCH_BALANCE_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_BALANCE_FAIL",
            payload: error.response?.data?.EM || 'Lỗi khi lấy số dư',
        });
    }
};

export const getRepairHistory = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token;

    dispatch({ type: "GET_REPAIR_HISTORY_REQUEST" });

    try {
        const response = await axios.get(`${API_URL_CUSTOMER}/view-repair-history`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "GET_REPAIR_HISTORY_SUCCESS",
                payload: response.data.DT, // Assuming the data is in DT
            });
        } else {
            dispatch({
                type: "GET_REPAIR_HISTORY_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "GET_REPAIR_HISTORY_FAIL",
            payload: error.response?.data?.EM || 'Failed to fetch repair history',
        });
    }
};

export const requestRepairmanUpgrade = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'REPAIRMAN_UPGRADE_REQUEST' });

        const { auth } = getState();
        const token = auth.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
                'Content-Type': 'multipart/form-data', // Gửi file
            },
        };

        // Gửi yêu cầu lên API
        const response = await axios.post(`${API_URL_REPAIRMAN}/repairman-upgrade-request`, formData, config);

        if (response.data.EC === 1) {
            dispatch({
                type: 'REPAIRMAN_UPGRADE_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: "GET_REPAIR_HISTORY_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: 'REPAIRMAN_UPGRADE_FAIL',
            payload: error.response.data.EM,
        });
    }
};

export const getServiceIndustryTypes = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token; // Lấy token từ Redux store

    try {
        dispatch({ type: 'SERVICE_INDUSTRY_TYPE_REQUEST' });

        const response = await axios.get(`${API_URL_REPAIRMAN}/get-type-service-industry`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: 'SERVICE_INDUSTRY_TYPE_SUCCESS',
                payload: response.data.DT, // DT trả về là mảng các loại dịch vụ
            });
        } else {
            dispatch({
                type: 'SERVICE_INDUSTRY_TYPE_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        dispatch({
            type: 'SERVICE_INDUSTRY_TYPE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra.',
        });
    }
};

// Action to get repairman's current status
export const getStatusRepairman = () => async (dispatch, getState) => {
    const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage
    try {
        dispatch({ type: "GET_STATUS_REPAIRMAN_REQUEST" });

        const response = await axios.get(`${API_URL_REPAIRMAN}/get-status`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "GET_STATUS_REPAIRMAN_SUCCESS",
                payload: response.data.DT, // The status
            });
        } else {
            dispatch({
                type: 'GET_STATUS_REPAIRMAN_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        dispatch({
            type: "GET_STATUS_REPAIRMAN_FAIL",
            payload: error.response ? error.response.data.EM : 'Lỗi hệ thống, vui lòng thử lại!',
        });
    }
};

// Action to toggle repairman's status
export const toggleStatusRepairman = () => async (dispatch, getState) => {
    const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage
    try {
        dispatch({ type: "TOGGLE_STATUS_REPAIRMAN_REQUEST" });

        const response = await axios.put(`${API_URL_REPAIRMAN}/toggle-status`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "TOGGLE_STATUS_REPAIRMAN_SUCCESS",
                payload: response.data.DT, // Updated status request data
            });
        } else {
            dispatch({
                type: 'TOGGLE_STATUS_REPAIRMAN_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        dispatch({
            type: "TOGGLE_STATUS_REPAIRMAN_FAIL",
            payload: error.response ? error.response.data.EM : 'Lỗi hệ thống, vui lòng thử lại!',
        });
    }
};




// API Find repairman to book repairment
// Action Creator để tìm thợ sửa chữa
export const findRepairman = (requestData, imageFiles) => async (dispatch, getState) => {
    try {
        dispatch({ type: "FIND_REPAIRMAN_REQUEST" });

        // Lấy token từ state 
        const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage

        // Chuẩn bị FormData để gửi dữ liệu multipart/form-data
        const formData = new FormData();
        formData.append("serviceIndustry_id", requestData.serviceIndustry_id);
        formData.append("description", requestData.description);
        formData.append("address", requestData.address);
        formData.append("radius", requestData.radius);
        formData.append("minPrice", requestData.minPrice);
        formData.append("maxPrice", requestData.maxPrice);

        // Thêm các file ảnh vào FormData
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("image", file); // "image" phải khớp với upload.array('image') ở BE
            });
        }

        // Gửi request tới API
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Token từ Redux state
                // Không cần "Content-Type" vì FormData tự động set multipart/form-data
            },
        };

        const response = await axios.post(
            "http://localhost:8080/api/customer/requests/find-repairman",
            formData,
            config
        );
        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: "FIND_REPAIRMAN_SUCCESS",
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'FIND_REPAIRMAN_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        // Dispatch fail với thông báo lỗi từ BE hoặc mặc định
        dispatch({
            type: "FIND_REPAIRMAN_FAIL",
            payload: error.response && error.response.data.EM
                ? error.response.data.EM
                : error.message,
        });
    }
};

//API hiển thị thông tin đơn hàng khách hàng tạo yêu cầu tìm thợ sửa chữa(Thợ xem)
export const viewRequest = () => async (dispatch, getState) => {

    try {
        dispatch({ type: "VIEW_REQUEST_REQUEST" });

        // Lấy token từ state 
        const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage

        // Cấu hình request với header Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Gửi request GET tới API
        const response = await axios.get(
            "http://localhost:8080/api/repairman/viewRequest",
            config
        );

        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: "VIEW_REQUEST_SUCCESS",
                payload: response.data.DT, // Lưu dealPriceRequest từ response
            });
        } else {
            dispatch({
                type: 'VIEW_REQUEST_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        // Dispatch fail với thông báo lỗi từ BE hoặc mặc định
        dispatch({
            type: "VIEW_REQUEST_FAIL",
            payload:
                error.response && error.response.data.EM
                    ? error.response.data.EM
                    : error.message,
        });
    }
};

// api deal giá của thợ tới khách hàng
export const dealPrice = (requestId, dealData) => async (dispatch, getState) => {
    try {
        dispatch({ type: "DEAL_PRICE_REQUEST" });

        // Lấy token từ state (giả sử lưu trong Redux từ quá trình đăng nhập)
        const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage

        // Cấu hình request với header Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        // Gửi request POST tới API với requestId trong path
        const response = await axios.post(
            `http://localhost:8080/api/repairman/deal-price/${requestId}`,
            dealData,
            config
        );

        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: "DEAL_PRICE_SUCCESS",
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'DEAL_PRICE_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        // Dispatch fail với thông báo lỗi từ BE hoặc mặc định
        dispatch({
            type: "DEAL_PRICE_FAIL",
            payload:
                error.response && error.response.data.EM
                    ? error.response.data.EM
                    : error.message,
        });
    }
};

// api xem các danh sách thợ đã deal giá cho đơn hàng sửa chữa đã tạo kèm mức giá deal
export const viewRepairmanDeal = (requestId) => async (dispatch, getState) => {
    try {
        dispatch({ type: "VIEW_REPAIRMAN_DEAL_REQUEST" });

        // Lấy token từ state (giả sử lưu trong Redux từ quá trình đăng nhập)
        const token = getState().auth.token || localStorage.getItem('token');

        // Cấu hình request với header Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Gửi request GET tới API với requestId trong path
        const response = await axios.get(
            `http://localhost:8080/api/customer/viewRepairmanDeal/${requestId}`,
            config
        );

        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: "VIEW_REPAIRMAN_DEAL_SUCCESS",
                payload: response.data.DT, // Lưu danh sách repairmanDeals từ response
            });
        } else {
            dispatch({
                type: 'DEAL_PRICE_FAIL',
                payload: response.data.EM, // Lỗi từ API
            });
        }
    } catch (error) {
        // Dispatch fail với thông báo lỗi từ BE hoặc mặc định
        dispatch({
            type: "VIEW_REPAIRMAN_DEAL_FAIL",
            payload:
                error.response && error.response.data.EM
                    ? error.response.data.EM
                    : error.message,
        });
    }
};