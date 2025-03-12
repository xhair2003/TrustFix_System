const initialState = {
    loading: false,
    userInfo: null,
    error: null,
    updateInfoSuccess: null, // Thêm trạng thái loading cho update
    updateInfoError: null, // Thêm trạng thái lỗi cho update
    paymentTransactions: [],
    depositeTransactions: [],
    vips: [],
    balance: null,
    complaintMessage: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER_INFO_REQUEST":
            return { ...state, loading: true, error: null };
        case "GET_USER_INFO_SUCCESS":
            return { ...state, loading: false, userInfo: action.payload };
        case "GET_USER_INFO_FAIL":
            return { ...state, loading: false, error: action.payload };


        // Xử lý updateUserInfo
        case 'UPDATE_USER_INFO_REQUEST':
            return { ...state, loading: true, updateInfoSuccess: null, updateInfoError: null };
        case 'UPDATE_USER_INFO_SUCCESS':
            return {
                ...state,
                updateInfoSuccess: action.payload.EM,
                //userInfo: action.payload.DT.userResponse, // Cập nhật userInfo với dữ liệu mới
                loading: false,
                updateInfoError: null, // Đặt lại lỗi thành null khi thành công
            };
        case 'UPDATE_USER_INFO_FAIL':
            return { ...state, loading: false, updateInfoSuccess: null, updateInfoError: action.payload };


        case "RESET_ERROR":
            return {
                ...state,
                updateInfoError: null,
                error: null,
                complaintError: null,
            };
        case "RESET_SUCCESS":
            return {
                ...state,
                updateInfoSuccess: null,
                complaintMessage: null,
            };


        case "FETCH_DEPOSIT_HISTORY_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_DEPOSIT_HISTORY_SUCCESS":
            return {
                ...state,
                loading: false,
                depositeTransactions: action.payload,
            };
        case "FETCH_DEPOSIT_HISTORY_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case "FETCH_HISTORY_PAYMENT_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_HISTORY_PAYMENT_SUCCESS":
            return {
                ...state,
                loading: false,
                paymentTransactions: action.payload,
            };
        case "FETCH_HISTORY_PAYMENT_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case "FETCH_VIPS_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_VIPS_SUCCESS":
            return {
                ...state,
                loading: false,
                vips: action.payload,
            };
        case "FETCH_VIPS_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case "FETCH_BALANCE_REQUES":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "FETCH_BALANCE_SUCCESS":
            return {
                ...state,
                loading: false,
                balance: action.payload, // Cập nhật số dư
            };
        case "FETCH_BALANCE_FAIL":
            return {
                ...state,
                loading: false,
                complaintError: null,
                complaintMessage: null,
            };


        case "SUBMIT_COMPLAINT_REQUEST":
            return {
                ...state,
                loading: true,
                complaintError: null,
                complaintMessage: null,
            };
        case "SUBMIT_COMPLAINT_SUCCESS":
            return {
                ...state,
                loading: false,
                complaintMessage: action.payload, // Thông báo thành công
                complaintError: null,
            };
        case "SUBMIT_COMPLAINT_FAIL":
            return {
                ...state,
                loading: false,
                complaintError: action.payload,
                complaintMessage: null,
            };

        default:
            return state;
    }
};

export default userReducer;
