import axios from 'axios';

const API_URL_CUSTOMER = 'http://localhost:8080/api/customer'; // Địa chỉ API

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

        if (response.data.EC === 0) {
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

        if (response.data.EC === 0) {
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

        if (response.data.EC === 0) {
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




