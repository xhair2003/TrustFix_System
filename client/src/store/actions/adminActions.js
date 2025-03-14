import axios from 'axios';

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