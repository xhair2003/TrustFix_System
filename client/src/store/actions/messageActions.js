import axios from 'axios';

// Action gửi tin nhắn
export const sendMessage = (receiverId, message, senderId, requestId) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'SEND_MESSAGE_REQUEST' });

        // Lấy token từ state hoặc localStorage
        const token = getState().auth.token || localStorage.getItem('token');

        // Cấu hình request với header Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // Gửi request POST tới API
        const response = await axios.post(
            'http://localhost:8080/api/chat/send-message',
            { receiverId, message, requestId },
            config
        );

        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: 'SEND_MESSAGE_SUCCESS',
                payload: {
                    senderId,
                    receiverId,
                    message: response.data.DT,
                    timestamp: new Date().toISOString(),
                },
            });
        } else {
            dispatch({
                type: 'SEND_MESSAGE_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: 'SEND_MESSAGE_FAIL',
            payload:
                error.response && error.response.data.EM
                    ? error.response.data.EM
                    : error.message,
        });
    }
};

// Action lấy lịch sử tin nhắn
// export const getChatHistory = (opponent) => async (dispatch, getState) => {
//     try {
//         dispatch({ type: 'GET_CHAT_HISTORY_REQUEST' });

//         // Lấy token từ state hoặc localStorage
//         const token = getState().auth.token || localStorage.getItem('token');

//         // Cấu hình request với header Authorization
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         };

//         // Gửi request GET tới API 
//         const response = await axios.get(
//             `http://localhost:8080/api/chat/get-chat-history/${opponent}`,
//             config
//         );

//         if (response.data.EC === 1) {
//             // Dispatch success với dữ liệu từ BE
//             dispatch({
//                 type: 'GET_CHAT_HISTORY_SUCCESS',
//                 payload: response.data.DT,
//             });
//         } else {
//             dispatch({
//                 type: 'GET_CHAT_HISTORY_FAIL',
//                 payload: response.data.EM,
//             });
//         }
//     } catch (error) {
//         dispatch({
//             type: 'GET_CHAT_HISTORY_FAIL',
//             payload:
//                 error.response && error.response.data.EM
//                     ? error.response.data.EM
//                     : error.message,
//         });
//     }
// };

export const getChatHistory = (opponent, requestId) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'GET_CHAT_HISTORY_REQUEST' });

        // Lấy token từ state hoặc localStorage
        const token = getState().auth.token || localStorage.getItem('token');

        // Cấu hình request với header Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // Xây dựng URL dựa trên opponent hoặc requestId
        let url;
        if (opponent) {
            url = `http://localhost:8080/api/chat/get-chat-history/${opponent}`;
        } else if (requestId) {
            url = `http://localhost:8080/api/chat/get-chat-history/request/${requestId}`;
        } else {
            url = `http://localhost:8080/api/chat/get-chat-history`;
        }

        // Gửi request GET tới API
        const response = await axios.get(url, config);

        //console.log(response.data.DT);

        if (response.data.EC === 1) {
            // Dispatch success với dữ liệu từ BE
            dispatch({
                type: 'GET_CHAT_HISTORY_SUCCESS',
                payload: response.data.DT,
            });
        } else {
            dispatch({
                type: 'GET_CHAT_HISTORY_FAIL',
                payload: response.data.EM,
            });
        }
    } catch (error) {
        dispatch({
            type: 'GET_CHAT_HISTORY_FAIL',
            payload:
                error.response && error.response.data.EM
                    ? error.response.data.EM
                    : error.message,
        });
    }
};

// Action để reset lỗi
export const resetErrorMessage = () => {
    return {
        type: "RESET_ERROR",
    };
};