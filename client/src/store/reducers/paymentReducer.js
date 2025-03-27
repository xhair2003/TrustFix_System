const initialState = {
    // New state for MoMo payment
    loadingMOMO: false,
    paymentMOMOUrl: null,
    successMOMOPayment: null,
    errorMOMOPayment: null,

    // New state for PayOS payment
    loadingPayOS: false,
    paymentPayOSUrl: null,
    payOSPayCode: null,
    successPayOSPayment: null,
    errorPayOSPayment: null,
};

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        // New cases for MoMo payment
        case "PAYMENT_MOMO_REQUEST":
            return { ...state, loadingMOMO: true, errorMOMOPayment: null, successMOMOPayment: null };
        case "PAYMENT_MOMO_SUCCESS":
            return {
                ...state,
                loadingMOMO: false,
                paymentMOMOUrl: action.payload.payUrl, // Store the MoMo payment URL
                successMOMOPayment: "Tạo link thanh toán MoMo thành công",
                errorMOMOPayment: null,
            };
        case "PAYMENT_MOMO_FAIL":
            return {
                ...state,
                loadingMOMO: false,
                paymentMOMOUrl: null,
                successMOMOPayment: null,
                errorMOMOPayment: action.payload,
            };
        case "PAYMENT_MOMO_RESET":
            return {
                ...state,
                loadingMOMO: false,
                paymentMOMOUrl: null,
                successMOMOPayment: null,
                errorMOMOPayment: null,
            };



        // New cases for PayOS payment
        case "PAYMENT_PAYOS_REQUEST":
            return { ...state, loadingPayOS: true, errorPayOSPayment: null, successPayOSPayment: null };
        case "PAYMENT_PAYOS_SUCCESS":
            return {
                ...state,
                loadingPayOS: false,
                paymentPayOSUrl: action.payload.paymentLink, // Store the PayOS payment URL
                payOSPayCode: action.payload.payCode, // Store the payCode
                successPayOSPayment: "Tạo link thanh toán PayOS thành công",
                errorPayOSPayment: null,
            };
        case "PAYMENT_PAYOS_FAIL":
            return {
                ...state,
                loadingPayOS: false,
                paymentPayOSUrl: null,
                payOSPayCode: null,
                successPayOSPayment: null,
                errorPayOSPayment: action.payload,
            };
        case "PAYMENT_PAYOS_RESET":
            return {
                ...state,
                loadingPayOS: false,
                paymentPayOSUrl: null,
                payOSPayCode: null,
                successPayOSPayment: null,
                errorPayOSPayment: null,
            };




        // Reset error and success for other actions (if needed)
        case "RESET_ERROR":
            return { ...state, errorMOMOPayment: null, errorPayOSPayment: null };
        case "RESET_SUCCESS":
            return { ...state, successMOMOPayment: null, successPayOSPayment: null };
        default:
            return state;
    }
};

export default paymentReducer;
