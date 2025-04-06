// actions/auth.js
import axios from 'axios';
import socket from '../../socket';

export const login = (email, pass) => {
    return async (dispatch) => {
        dispatch({ type: "LOGIN_REQUEST" });
        try {
            const response = await axios.post('http://localhost:8080/api/authen/login', { email, pass });

            if (response.data.EC === 1) {
                const { accessToken } = response.data.DT;
                const newUserId = response.data.DT._id;
                // Lưu token vào localStorage, không cần
                localStorage.setItem('token', accessToken);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('role', response.data.DT.roles[0]);
                localStorage.setItem('user_id', newUserId);

                if (socket && socket.connected) {
                    socket.emit('join', newUserId.toString()); // Tham gia room mới
                }

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

export const logout = () => async (dispatch, getState) => {
    const oldUserId = getState().auth.user_id || localStorage.getItem('user_id');

    try {
        // Gửi yêu cầu đến API logout để cập nhật status trong RepairmanUpgradeRequest
        const token = getState().auth.token || localStorage.getItem('token'); // Lấy token từ state auth hoặc localStorage
        if (token) {
            await axios.post(
                'http://localhost:8080/api/authen/logout', // Đường dẫn API logout
                {}, // Body trống vì userId được lấy từ token
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        // Rời room socket nếu có
        if (oldUserId && socket) {
            socket.emit('leave', oldUserId.toString());
        }

        // Xóa thông tin khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('closedRequests');
        localStorage.removeItem('user_id');

        // Dispatch action LOGOUT để reset state Redux
        dispatch({
            type: 'LOGOUT',
        });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        // Vẫn dispatch LOGOUT ngay cả khi API thất bại để đảm bảo client-side logout
        dispatch({
            type: 'LOGOUT',
        });
    }
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

