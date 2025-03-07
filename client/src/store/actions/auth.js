// actions/auth.js
import axios from 'axios';

export const login = (email, pass) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://localhost:8080/api/authen/login', { email, pass });
            const { accessToken } = response.data.DT;

            // Lưu token vào localStorage, không cần
            localStorage.setItem('token', accessToken);
            localStorage.setItem('isAuthenticated', true);

            // Đẩy action vào Redux
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { accessToken, isAuthenticated: true, user: response.data.DT }
            });
        } catch (error) {
            dispatch({
                type: "LOGIN_FAIL",
                payload: { error: error.response.data.EM }
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