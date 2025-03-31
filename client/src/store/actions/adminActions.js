import axios from 'axios';
const API_URL_ADMIN = 'http://localhost:8080/api/admin';

// Fetch users action
export const fetchUsers = () => async (dispatch, getState) => {
    const token = getState().auth.token; // Lấy token từ state auth

    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
        const response = await axios.get('http://localhost:8080/api/admin/view-all-users', {
            headers: {
                //Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
                Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_USERS_SUCCESS",
                payload: response.data.DT, // assuming the API response contains the data in 'DT'
            });
        } else {
            dispatch({
                type: "FETCH_USERS_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_USERS_FAIL",
            payload: error.response.data.EM,
        });
    }
};

// Action để gửi yêu cầu xóa tài khoản người dùng
export const deleteUser = (userId, reason) => async (dispatch, getState) => {
    const token = getState().auth.token; // Lấy token từ state (hoặc từ localStorage)

    dispatch({ type: 'DELETE_USER_REQUEST' });

    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/delete-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            },
            data: { reason }
        });

        if (response.data.EC === 1) {
            dispatch({
                type: 'DELETE_USER_SUCCESS',
                payload: response.data.EM, // Chứa thông báo thành công
            });
        } else {
            dispatch({
                type: 'DELETE_USER_FAIL',
                payload: response.data.EM, // Chứa thông báo lỗi
            });
        }
    } catch (error) {
        dispatch({
            type: 'DELETE_USER_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi xóa tài khoản.',
        });
    }
};

// Action để khóa tài khoản người dùng
export const lockUser = (userId, reason) => async (dispatch, getState) => {
    const token = getState().auth.token; // Lấy token từ state (hoặc từ localStorage)

    dispatch({ type: 'LOCK_USER_REQUEST' });

    try {
        const response = await axios.put(`http://localhost:8080/api/admin/lock-user/${userId}`,
            { reason }, // Passing the reason directly in the body
            {
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem('token')}`,
                }
            }
        );


        if (response.data.EC === 1) {
            dispatch({
                type: 'LOCK_USER_SUCCESS',
                payload: response.data.EM, // Chứa thông báo thành công
            });
        } else {
            dispatch({
                type: 'LOCK_USER_FAIL',
                payload: response.data.EM, // Chứa thông báo lỗi
            });
        }
    } catch (error) {
        dispatch({
            type: 'LOCK_USER_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi xóa tài khoản.',
        });
    }
};

// Action để khóa tài khoản người dùng
export const unlockUser = (userId) => async (dispatch, getState) => {
    const token = getState().auth.token; // Lấy token từ state (hoặc từ localStorage)

    dispatch({ type: 'UNLOCK_USER_REQUEST' });

    try {
        const response = await axios.put(`http://localhost:8080/api/admin/unlock-user/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem('token')}`,
                },
            });

        if (response.data.EC === 1) {
            dispatch({
                type: 'UNLOCK_USER_SUCCESS',
                payload: response.data.EM, // Chứa thông báo thành công
            });
        } else {
            dispatch({
                type: 'UNLOCK_USER_FAIL',
                payload: response.data.EM, // Chứa thông báo lỗi
            });
        }
    } catch (error) {
        dispatch({
            type: 'UNLOCK_USER_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi mở khóa tài khoản.',
        });
    }
};




// Fetch service prices action
export const fetchSevicePrices = () => async (dispatch, getState) => {
    const token = getState().auth.token; // Lấy token từ state auth

    dispatch({ type: "FETCH_SERVICE_PRICES_REQUEST" });
    try {
        const response = await axios.get('http://localhost:8080/api/admin/service/all-price', {
            headers: {
                //Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
                Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "FETCH_SERVICE_PRICES_SUCCESS",
                payload: response.data.DT, // assuming the API response contains the data in 'DT'
            });
        } else {
            dispatch({
                type: "FETCH_SERVICE_PRICES_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_SERVICE_PRICES_FAIL",
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy bảng giá dịch vụ đề xuất !',
        });
    }
};

export const addServicePrice = (serviceName, price, description) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        const response = await axios.post(
            `http://localhost:8080/api/admin/service/add-price`,
            { serviceName, price, description },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'ADD_SERVICE_PRICE_SUCCESS',
                payload: response.data.EM // Payload with the service price data
            });
        } else {
            dispatch({
                type: 'ADD_SERVICE_PRICE_FAIL',
                payload: response.data.EM // Error response.data.EM from the backend
            });
        }
    } catch (error) {
        console.error("Error adding service price:", error);
        dispatch({
            type: 'ADD_SERVICE_PRICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi thêm dịch vụ đề xuất !',
        });
    }
};

export const updateServicePrice = (serviceName, price, description) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        const response = await axios.put(
            `http://localhost:8080/api/admin/service/update`,
            { serviceName, price, description },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'UPDATE_SERVICE_PRICE_SUCCESS',
                payload: response.data.EM // Payload with the updated service price data
            });
        } else {
            dispatch({
                type: 'UPDATE_SERVICE_PRICE_FAIL',
                payload: response.data.EM // Error response.data.EM from the backend
            });
        }
    } catch (error) {
        console.error("Error updating service price:", error);
        dispatch({
            type: 'UPDATE_SERVICE_PRICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi cập nhật dịch vụ đề xuất !',
        });
    }
};

export const deleteServicePrice = (serviceId) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        const response = await axios.delete(
            `http://localhost:8080/api/admin/service/delete-price/${serviceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'DELETE_SERVICE_PRICE_SUCCESS',
                payload: response.data.EM // Send back the service ID to update the state
            });
        } else {
            dispatch({
                type: 'DELETE_SERVICE_PRICE_FAIL',
                payload: response.data.EM // Error response.data.EM from the backend
            });
        }
    } catch (error) {
        console.error("Error deleting service price:", error);
        dispatch({
            type: 'DELETE_SERVICE_PRICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi xóa dịch vụ đề xuất !',
        });
    }
};




// Fetch transaction action
// fetchPaymentHistory
export const fetchPaymentHistory = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        // Dispatch request start action (optional, useful for showing loading state)
        dispatch({ type: 'FETCH_PAYMENT_HISTORY_REQUEST' });

        const response = await axios.get(
            'http://localhost:8080/api/admin/view-history-payment',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'FETCH_PAYMENT_HISTORY_SUCCESS',
                payload: response.data.DT
            });
        } else {
            dispatch({
                type: 'FETCH_PAYMENT_HISTORY_FAIL',
                payload: response.data.EM
            });
        }
    } catch (error) {
        console.error("Error fetching payment history:", error);
        dispatch({
            type: 'FETCH_PAYMENT_HISTORY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách lịch sử thanh toán !',
        });
    }
};

// fetchDepositHistory
export const fetchDepositHistory = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        // Dispatch request start action (optional, useful for showing loading state)
        dispatch({ type: 'FETCH_DEPOSIT_HISTORY_REQUEST' });

        const response = await axios.get(
            'http://localhost:8080/api/admin/view-deposite-history',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'FETCH_DEPOSIT_HISTORY_SUCCESS',
                payload: response.data.DT
            });
        } else {
            dispatch({
                type: 'FETCH_DEPOSIT_HISTORY_FAIL',
                payload: response.data.EM
            });
        }
    } catch (error) {
        console.error("Error fetching deposit history:", error);
        dispatch({
            type: 'FETCH_DEPOSIT_HISTORY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách lịch sử nạp tiền !',
        });
    }
};




// Fetch Complaints action
// API reply to complaint
export const replyToComplaint = (complaintId, complaintContent) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        dispatch({ type: 'REPLY_TO_COMPLAINT_REQUEST' });

        const response = await axios.post(
            `http://localhost:8080/api/admin/complaints/${complaintId}/replies`,
            { complaintContent },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'REPLY_TO_COMPLAINT_SUCCESS',
                payload: response.data.EM
            });
        } else {
            dispatch({
                type: 'REPLY_TO_COMPLAINT_FAIL',
                payload: response.data.EM
            });
        }
    } catch (error) {
        console.error("Error replying to complaint:", error);
        dispatch({
            type: 'REPLY_TO_COMPLAINT_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi phản hồi khiếu nại !',
        });
    }
};

// API get all complaints
export const fetchAllComplaints = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        // Dispatch request start action (optional, useful for showing loading state)
        dispatch({ type: 'FETCH_COMPLAINTS_REQUEST' });

        const response = await axios.get(
            'http://localhost:8080/api/admin/complaints',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'FETCH_COMPLAINTS_SUCCESS',
                payload: response.data.DT
            });
        } else {
            dispatch({
                type: 'FETCH_COMPLAINTS_FAIL',
                payload: response.data.EM
            });
        }
    } catch (error) {
        console.error("Error fetching complaints:", error);
        dispatch({
            type: 'FETCH_COMPLAINTS_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách khiếu nại !',
        });
    }
};




// Fetch repair booking history
export const fetchRepairBookingHistory = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        // Dispatch request start action (optional, useful for showing loading state)
        dispatch({ type: 'FETCH_REPAIR_BOOKING_HISTORY_REQUEST' });

        const response = await axios.get(
            'http://localhost:8080/api/admin/list-repair-booking-history',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'FETCH_REPAIR_BOOKING_HISTORY_SUCCESS',
                payload: response.data.DT
            });
        } else {
            dispatch({
                type: 'FETCH_REPAIR_BOOKING_HISTORY_FAIL',
                payload: response.data.EM
            });
        }
    } catch (error) {
        console.error("Error fetching repair booking history:", error);
        dispatch({
            type: 'FETCH_REPAIR_BOOKING_HISTORY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách đơn đặt lịch sửa chữa !',
        });
    }
};




// Fetch service industry action
// create service industry
export const createServiceIndustry = (type) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        dispatch({ type: 'CREATE_SERVICE_INDUSTRY_REQUEST' });

        const response = await axios.post(
            'http://localhost:8080/api/admin/service-industries',
            { type },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'CREATE_SERVICE_INDUSTRY_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'CREATE_SERVICE_INDUSTRY_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error creating service industry:', error);
        dispatch({
            type: 'CREATE_SERVICE_INDUSTRY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy tạo loại hình dịch vụ mới !',
        });
    }
};

// create getAllServiceIndustries
export const getAllServiceIndustries = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        dispatch({ type: 'GET_ALL_SERVICE_INDUSTRIES_REQUEST' });

        const response = await axios.get('http://localhost:8080/api/admin/service-industries', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: 'GET_ALL_SERVICE_INDUSTRIES_SUCCESS',
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: 'GET_ALL_SERVICE_INDUSTRIES_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error fetching service industries:', error);
        dispatch({
            type: 'GET_ALL_SERVICE_INDUSTRIES_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách loại hình dịch vụ !',
        });
    }
};

// updateServiceIndustry
export const updateServiceIndustry = (id, type) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        dispatch({ type: 'UPDATE_SERVICE_INDUSTRY_REQUEST' });

        const response = await axios.put(
            `http://localhost:8080/api/admin/service-industries/${id}`,
            { type },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'UPDATE_SERVICE_INDUSTRY_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'UPDATE_SERVICE_INDUSTRY_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error updating service industry:', error);
        dispatch({
            type: 'UPDATE_SERVICE_INDUSTRY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi cập nhật loại hình dịch vụ !',
        });
    }
};

// deleteServiceIndustry
export const deleteServiceIndustry = (id) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');

        dispatch({ type: 'DELETE_SERVICE_INDUSTRY_REQUEST' });

        const response = await axios.delete(
            `http://localhost:8080/api/admin/service-industries/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'DELETE_SERVICE_INDUSTRY_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'DELETE_SERVICE_INDUSTRY_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error deleting service industry:', error);
        dispatch({
            type: 'DELETE_SERVICE_INDUSTRY_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi xóa loại hình dịch vụ !',
        });
    }
};




// Fetch service action
// create service 
export const createService = (id, type) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'CREATE_SERVICE_REQUEST' });

        const response = await axios.post(
            `http://localhost:8080/api/admin/services/${id}`,
            { type },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'CREATE_SERVICE_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'CREATE_SERVICE_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error creating service:', error);
        dispatch({
            type: 'CREATE_SERVICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi tạo dịch vụ mới !',
        });
    }
};

// getAllServices
export const getAllServices = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'GET_ALL_SERVICES_REQUEST' });

        const response = await axios.get('http://localhost:8080/api/admin/services', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: 'GET_ALL_SERVICES_SUCCESS',
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: 'GET_ALL_SERVICES_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        dispatch({
            type: 'GET_ALL_SERVICES_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi lấy danh sách dịch vụ !',
        });
    }
};

export const updateService = (id, serviceIndustry_id, type) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'UPDATE_SERVICE_REQUEST' });

        const response = await axios.put(
            `http://localhost:8080/api/admin/services/${id}`,
            { serviceIndustry_id, type }, // Gửi cả serviceIndustry_id và type
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'UPDATE_SERVICE_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'UPDATE_SERVICE_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        dispatch({
            type: 'UPDATE_SERVICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi cập nhật dịch vụ !',
        });
    }
};


// deleteService
export const deleteService = (id) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'DELETE_SERVICE_REQUEST' });

        const response = await axios.delete(
            `http://localhost:8080/api/admin/services/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'DELETE_SERVICE_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'DELETE_SERVICE_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        dispatch({
            type: 'DELETE_SERVICE_FAIL',
            payload: error.response ? error.response.data.EM : 'Có lỗi xảy ra khi xóa dịch vụ !',
        });
    }
};




// Fetch upgrade requests action
// Action to fetch all pending repairman upgrade requests
export const getPendingUpgradeRequests = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'GET_PENDING_UPGRADE_REQUESTS_REQUEST' });

        const response = await axios.get(
            'http://localhost:8080/api/admin/repairman-upgrade-requests/pending',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'GET_PENDING_UPGRADE_REQUESTS_SUCCESS',
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: 'GET_PENDING_UPGRADE_REQUESTS_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error fetching pending upgrade requests:', error);
        dispatch({
            type: 'GET_PENDING_UPGRADE_REQUESTS_FAIL',
            payload: error.response.data.EM || 'An error occurred while fetching pending upgrade requests.',
        });
    }
};

// Action to approve or reject a repairman upgrade request
export const verifyRepairmanUpgradeRequest = (requestId, action, rejectReason) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_REQUEST' });

        const response = await axios.put(
            `http://localhost:8080/api/admin/repairman-upgrade-requests/${requestId}/verify`,
            { action, rejectReason },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_SUCCESS',
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error verifying upgrade request:', error);
        dispatch({
            type: 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_FAIL',
            payload: error.response.data.EM || 'An error occurred while verifying the upgrade request.',
        });
    }
};




// Action Dashboard

// Loading action type is handled by REQUEST actions
const request = (type) => ({
    type: type
});

// Fetch total users
export const totalUsers = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_USERS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_USERS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_USERS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_USERS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total banned users
export const totalBannedUsers = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_BANNED_USERS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-banned-users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_BANNED_USERS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_BANNED_USERS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_BANNED_USERS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total repairmen
export const totalRepairmen = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_REPAIRMEN"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-repairmen', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_REPAIRMEN",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_REPAIRMEN",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_REPAIRMEN",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total customers
export const totalCustomers = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_CUSTOMERS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-customers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_CUSTOMERS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_CUSTOMERS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_CUSTOMERS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total completed requests
export const totalCompletedRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_COMPLETED_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-completed-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_COMPLETED_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_COMPLETED_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_COMPLETED_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total confirmed requests
export const totalConfirmedRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_CONFIRMED_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-confirmed-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_CONFIRMED_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_CONFIRMED_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_CONFIRMED_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total pending requests
export const totalPendingRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_PENDING_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-pending-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_PENDING_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_PENDING_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_PENDING_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total cancelled requests
export const totalCancelledRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_CANCELLED_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-cancelled-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_CANCELLED_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_CANCELLED_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_CANCELLED_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total make payment requests
export const totalMakePaymentRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_MAKE_PAYMENT_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-make-payment-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_MAKE_PAYMENT_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_MAKE_PAYMENT_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_MAKE_PAYMENT_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total deal price requests
export const totalDealPriceRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_DEAL_PRICE_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-deal-price-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_DEAL_PRICE_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_DEAL_PRICE_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_DEAL_PRICE_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total pending complaints
export const totalPendingComplaints = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_PENDING_COMPLAINTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-pending-complaints', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_PENDING_COMPLAINTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_PENDING_COMPLAINTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_PENDING_COMPLAINTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total pending upgrade requests
export const totalPendingUpgradeRequests = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_PENDING_UPGRADE_REQUESTS"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-pending-upgrade-requests', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_PENDING_UPGRADE_REQUESTS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_PENDING_UPGRADE_REQUESTS",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_PENDING_UPGRADE_REQUESTS",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total service industries
export const totalServiceIndustries = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_SERVICE_INDUSTRIES"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-service-industries', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_SERVICE_INDUSTRIES",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_SERVICE_INDUSTRIES",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_SERVICE_INDUSTRIES",
            payload: error.response.data.EM,
        });
    }
};

// Fetch total services by industry
export const totalServicesByIndustry = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_SERVICES_BY_INDUSTRY"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-services-by-industry', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response for totalServicesByIndustry:', response.data); // Log để kiểm tra
        if (response.data.EC === 1) {
            // Chuẩn hóa dữ liệu thành mảng
            const data = Array.isArray(response.data.DT) ? response.data.DT : [];
            dispatch({
                type: "SUCCESS_TOTAL_SERVICES_BY_INDUSTRY",
                payload: data,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_SERVICES_BY_INDUSTRY",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_SERVICES_BY_INDUSTRY",
            payload: error.response?.data?.EM || 'Lỗi không xác định',
        });
    }
};
// Fetch total service prices
export const totalServicePrices = () => async (dispatch, getState) => {
    try {
        dispatch(request("REQUEST_TOTAL_SERVICE_PRICES"));
        const token = getState().auth.token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/total-service-prices', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "SUCCESS_TOTAL_SERVICE_PRICES",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "ERROR_TOTAL_SERVICE_PRICES",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "ERROR_TOTAL_SERVICE_PRICES",
            payload: error.response.data.EM,
        });
    }
};


// Action để lấy danh sách các yêu cầu bổ sung chứng chỉ đang pending
export const getPendingSupplementaryCertificateRequests = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_REQUEST' });

        const response = await axios.get(
            `${API_URL_ADMIN}/pending-2nd-certification`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_SUCCESS',
                payload: response.data.DT, // Dữ liệu danh sách yêu cầu
            });
        } else {
            dispatch({
                type: 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error fetching pending supplementary certificate requests:', error);
        dispatch({
            type: 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_FAIL',
            payload:
                error.response?.data?.EM ||
                'An error occurred while fetching pending supplementary certificate requests.',
        });
    }
};

// Action để xác minh (approve/reject) một yêu cầu bổ sung chứng chỉ
export const verifySupplementaryCertificateRequest = (requestId, action, rejectionReason) => async (
    dispatch,
    getState
) => {
    try {
        const token = getState().auth.token || localStorage.getItem('token');
        dispatch({ type: 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_REQUEST' });

        const response = await axios.post(
            `${API_URL_ADMIN}/verify-2nd-certification`,
            { requestId, action, rejectionReason }, // action: 'approve' hoặc 'reject', rejectionReason nếu từ chối
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.EC === 1) {
            dispatch({
                type: 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_SUCCESS',
                payload: response.data.EM,
            });
            // Sau khi verify thành công, gọi lại danh sách pending để cập nhật
            dispatch(getPendingSupplementaryCertificateRequests());
        } else {
            dispatch({
                type: 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        console.error('Error verifying supplementary certificate request:', error);
        dispatch({
            type: 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_FAIL',
            payload:
                error.response?.data?.EM ||
                'An error occurred while verifying the supplementary certificate request.',
        });
    }
};

// Action to get the most used VIP service
export const getMostUsedVipService = () => async (dispatch, getState) => {
    const token = getState().auth.token || localStorage.getItem("token"); // Get token from state or localStorage
    try {
        dispatch({ type: "GET_MOST_USED_VIP_SERVICE_REQUEST" });

        const response = await axios.get(`${API_URL_ADMIN}/view-vip-services/most-used`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            dispatch({
                type: "GET_MOST_USED_VIP_SERVICE_SUCCESS",
                payload: response.data.DT, // The most used VIP service data
            });
        } else {
            dispatch({
                type: "GET_MOST_USED_VIP_SERVICE_FAIL",
                payload: response.data.EM, // Error message from API
            });
        }
    } catch (error) {
        dispatch({
            type: "GET_MOST_USED_VIP_SERVICE_FAIL",
            payload: error.response ? error.response.data.EM : "Lỗi hệ thống, vui lòng thử lại!",
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