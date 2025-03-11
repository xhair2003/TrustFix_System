import axios from 'axios';

const API_URL = 'http://localhost:8080/api/authen'; // Địa chỉ API

export const getUserInfo = () => async (dispatch) => {
    dispatch({ type: "GET_USER_INFO_REQUEST" }); // Bắt đầu loading

    try {
        const response = await axios.get(`${API_URL}/user-info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
            },
        });
        if (response.data.EC === 1) {
            dispatch({
                type: "GET_USER_INFO_SUCCESS",
                payload: response.data.DT.user, // Lưu thông tin người dùng
            });
        } else {
            dispatch({
                type: "GET_USER_INFO_FAIL",
                payload: response.data.EM, // Lưu thông báo lỗi
            });
        }
    } catch (error) {
        dispatch({
            type: "GET_USER_INFO_FAIL",
            payload: error.response.data.EM, // Lưu thông báo lỗi
        });
    }
};
