// actions/auth.js
import axios from 'axios';

export const login = (email, pass) => {
    return async (dispatch) => {
        dispatch({ type: "LOGIN_REQUEST" });
        try {
            const response = await axios.post('http://localhost:8080/api/authen/login', { email, pass });

            if (response.data.EC === 1) {
                const { accessToken } = response.data.DT;

                // Lưu token vào localStorage, không cần
                localStorage.setItem('token', accessToken);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('role', response.data.DT.roles[0]);
                // Đẩy action vào Redux
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: { accessToken, isAuthenticated: true, user: response.data.DT, successLogin: response.data.EM, role: response.data.DT.roles[0] }
                });
            } else {
                dispatch({
                    type: "LOGIN_FAIL",
                    payload: response.data.EM,
                });
            }
        } catch (error) {
            dispatch({
                type: "LOGIN_FAIL",
                payload: error?.response?.data?.EM || "Lỗi khi đăng nhập !",
            });
        }
    };
};

export const logout = () => {
    return (dispatch) => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem("closedRequests");
        // Đẩy action logout vào Redux
        dispatch({
            type: "LOGOUT",
        });
    };
};

export const registerUser = (userData) => async (dispatch) => {
    dispatch({ type: "REGISTER_REQUEST" });
    try {
        const response = await axios.post('http://localhost:8080/api/authen/register', userData);
        if (response.data.EC === 1) {
            dispatch({
                type: "REGISTER_SUCCESS",
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: "REGISTER_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "REGISTER_FAIL",
            payload: error.response.data.EM,
        });
    }
};

export const verifyRegister = (email, otp) => async (dispatch) => {
    dispatch({ type: "VERIFY_REGISTER_REQUEST" });
    try {
        const response = await axios.post('http://localhost:8080/api/authen/verify-register', {
            email,
            otp,
        });


        if (response.data.EC === 1) {
            // const { accessToken } = response.data.DT;

            // // Lưu token vào localStorage, không cần
            // localStorage.setItem('token', accessToken);
            // localStorage.setItem('isAuthenticated', true);

            dispatch({
                type: "VERIFY_REGISTER_SUCCESS",
                payload: response.data.EM,
            });
        } else {
            dispatch({
                type: "VERIFY_REGISTER_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "VERIFY_REGISTER_FAIL",
            payload: error.response.data.EM,
        });
    }
};

export const changePassword = (pass, newPass, confirmNewPass) => {
    return async (dispatch, getState) => {
        dispatch({ type: "CHANGE_PASSWORD_REQUEST" });
        const { auth } = getState(); // Lấy thông tin người dùng từ state
        const token = auth.token; // token trong state

        try {
            const response = await axios.post(
                'http://localhost:8080/api/authen/change-password',
                { pass, newPass, confirmNewPass },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.EC === 1) {
                dispatch({
                    type: "CHANGE_PASSWORD_SUCCESS",
                    payload: response.data,
                });
            } else {
                dispatch({
                    type: "CHANGE_PASSWORD_FAIL",
                    payload: response.data,
                });
            }
        } catch (error) {
            dispatch({
                type: "CHANGE_PASSWORD_FAIL",
                payload: error.response.data,
            });
        }
    };
};

const API_URL = 'http://localhost:8080/api/authen';

export const forgotPassword = (email) => async (dispatch) => {
    dispatch({ type: "FORGOT_PASSWORD_REQUEST" });
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        if (response.data.EC === 1) {
            dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: response.data });
        } else {
            dispatch({ type: "FORGOT_PASSWORD_FAIL", payload: response.data });
        }
    } catch (error) {
        dispatch({ type: "FORGOT_PASSWORD_FAIL", payload: error.response.data });
    }
};

export const verifyOtp = (email, otp) => async (dispatch) => {
    dispatch({ type: "VERIFY_OTP_REQUEST" });
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        if (response.data.EC === 1) {
            dispatch({ type: "VERIFY_OTP_SUCCESS", payload: response.data });
        } else {
            dispatch({ type: "VERIFY_OTP_FAIL", payload: response.data });
        }
    } catch (error) {
        dispatch({ type: "VERIFY_OTP_FAIL", payload: error.response.data });
    }
};

export const resetPassword = (resetToken, newPassword, confirmPassword) => async (dispatch) => {
    dispatch({ type: "RESET_PASSWORD_REQUEST" });
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { resetToken, newPassword, confirmPassword });
        if (response.data.EC === 1) {
            dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: response.data });
        } else {
            dispatch({ type: "RESET_PASSWORD_FAIL", payload: response.data });
        }
    } catch (error) {
        dispatch({ type: "RESET_PASSWORD_FAIL", payload: error.response.data });
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

// Fetch user role type action
export const getRole = () => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token;
    dispatch({ type: "FETCH_ROLE_TYPE_REQUEST" });
    try {
        // Gửi yêu cầu API để lấy loại (type) của user
        const response = await axios.get('http://localhost:8080/api/authen/get-role', {
            headers: {
                //Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.EC === 1) {
            // Dispatch action nếu lấy thành công
            dispatch({
                type: "FETCH_ROLE_TYPE_SUCCESS",
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: "FETCH_ROLE_TYPE_FAIL",
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: "FETCH_ROLE_TYPE_FAIL",
            payload: error.response.data.EM,
        });
    }
};

