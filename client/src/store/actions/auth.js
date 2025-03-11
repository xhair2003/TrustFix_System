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
                // Đẩy action vào Redux
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: { accessToken, isAuthenticated: true, user: response.data.DT }
                });
            } else {
                dispatch({
                    type: "LOGIN_FAIL",
                    payload: response.data,
                });
            }
        } catch (error) {
            dispatch({
                type: "LOGIN_FAIL",
                payload: error.response.data
            });
        }
    };
};

export const logout = () => {
    return (dispatch) => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        // Đẩy action logout vào Redux
        dispatch({
            type: "LOGOUT",
            payload: { isAuthenticated: false }
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
                payload: response.data,
            });
        } else {
            dispatch({
                type: "REGISTER_FAIL",
                payload: response.data,
            });
        }
    } catch (error) {
        dispatch({
            type: "REGISTER_FAIL",
            payload: error.response.data,
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
            const { accessToken } = response.data.DT;

            // Lưu token vào localStorage, không cần
            localStorage.setItem('token', accessToken);
            localStorage.setItem('isAuthenticated', true);

            dispatch({
                type: "VERIFY_REGISTER_SUCCESS",
                payload: { accessToken, isAuthenticated: true, user: response.data.DT }
            });
        } else {
            dispatch({
                type: "VERIFY_REGISTER_FAIL",
                payload: response.data,
            });
        }
    } catch (error) {
        dispatch({
            type: "VERIFY_REGISTER_FAILURE",
            payload: error.response.data,
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



