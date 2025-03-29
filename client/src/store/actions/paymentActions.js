import axios from 'axios';

// Action for MoMo payment
export const paymentMOMO = (amount) => async (dispatch, getState) => {
    try {
        dispatch({ type: "PAYMENT_MOMO_REQUEST" });

        // Get token from state or localStorage
        const token = getState().auth.token || localStorage.getItem('token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const body = {
            amount,
            transaction_type: "MOMO", // Hardcode to ensure correct transaction type
        };

        const { data } = await axios.post(
            `http://localhost:8080/api/paymentMOMO`,
            body,
            config
        );

        if (data.message === "Link thanh toán được tạo thành công !") {
            dispatch({
                type: "PAYMENT_MOMO_SUCCESS",
                payload: data.response,
            });
        } else {
            dispatch({
                type: "PAYMENT_MOMO_FAIL",
                payload: data.message || "Có lỗi xảy ra khi tạo link thanh toán MoMo",
            });
        }
    } catch (error) {
        dispatch({
            type: "PAYMENT_MOMO_FAIL",
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : 'Có lỗi xảy ra khi xử lý thanh toán MoMo',
        });
    }
};

// Reset MoMo payment state
export const resetMOMOPayment = () => (dispatch) => {
    dispatch({ type: "PAYMENT_MOMO_RESET" });
};



// 
// Action for PayOS payment
export const paymentPayOS = (amount) => async (dispatch, getState) => {
    try {
        dispatch({ type: "PAYMENT_PAYOS_REQUEST" });

        // Get token from state or localStorage
        const token = getState().auth.token || localStorage.getItem('token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const body = {
            amount,
            transaction_type: "PayOS", // Hardcode to ensure correct transaction type
        };

        const { data } = await axios.post(
            `http://localhost:8080/api/payment`,
            body,
            config
        );

        dispatch({
            type: "PAYMENT_PAYOS_SUCCESS",
            payload: {
                paymentLink: data.paymentlink, // Store the PayOS payment URL
                payCode: data.payCode, // Store the payCode for reference
            },
        });
    } catch (error) {
        dispatch({
            type: "PAYMENT_PAYOS_FAIL",
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : 'Có lỗi xảy ra khi xử lý thanh toán PayOS',
        });
    }
};

// Reset PayOS payment state (optional, for cleanup after success/error)
export const resetPayOSPayment = () => (dispatch) => {
    dispatch({ type: "PAYMENT_PAYOS_RESET" });
};