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
    repairHistory: null,
    errorRepairHistory: null,
    errorUgrade: null,
    successUpgrade: null,
    serviceTypes: [], // Mảng chứa các loại dịch vụ
    status: null,
    errorToggleStatus: null,
    errorGetStatus: null,

    errorFindRepairman: null,
    errorViewRequest: null,
    successFindRepairman: null,
    request: null,
    errorDealPrice: null,
    successDealPrice: null,

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

        // Add these cases to your reducer
        case 'GET_REPAIR_HISTORY_REQUEST':
            return { ...state, loading: true, errorRepairHistory: null, repairHistory: null };
        case 'GET_REPAIR_HISTORY_SUCCESS':
            return { ...state, loading: false, repairHistory: action.payload };
        case 'GET_REPAIR_HISTORY_FAIL':
            return { ...state, loading: false, errorRepairHistory: action.payload };


        case 'REPAIRMAN_UPGRADE_REQUEST':
            return { ...state, loading: true, errorUgrade: null, successUpgrade: null };
        case 'REPAIRMAN_UPGRADE_SUCCESS':
            return {
                ...state,
                loading: false,
                successUpgrade: action.payload,
            };
        case 'REPAIRMAN_UPGRADE_FAIL':
            return {
                ...state,
                loading: false,
                errorUgrade: action.payload,
            };



        case 'SERVICE_INDUSTRY_TYPE_REQUEST':
            return { ...state, loading: true, errorServiceTypes: null };
        case 'SERVICE_INDUSTRY_TYPE_SUCCESS':
            return {
                ...state,
                loading: false,
                serviceTypes: action.payload, // Lưu danh sách loại dịch vụ vào store
            };
        case 'SERVICE_INDUSTRY_TYPE_FAIL':
            return {
                ...state,
                loading: false,
                errorServiceTypes: action.payload, // Lưu lỗi vào store nếu có
            };


        case "GET_STATUS_REPAIRMAN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "GET_STATUS_REPAIRMAN_SUCCESS":
            return {
                ...state,
                loading: false,
                status: action.payload, // Storing the status
            };
        case "GET_STATUS_REPAIRMAN_FAIL":
            return {
                ...state,
                loading: false,
                errorGetStatus: action.payload, // Storing error message
            };


        case "TOGGLE_STATUS_REPAIRMAN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "TOGGLE_STATUS_REPAIRMAN_SUCCESS":
            return {
                ...state,
                loading: false,
                status: action.payload, // Updated status after toggling
            };
        case "TOGGLE_STATUS_REPAIRMAN_FAIL":
            return {
                ...state,
                loading: false,
                errorToggleStatus: action.payload, // Storing error message
            };


        case "FIND_REPAIRMAN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "FIND_REPAIRMAN_SUCCESS":
            return {
                ...state,
                loading: false,
                successFindRepairman: action.payload, // Lưu dữ liệu từ BE (VD: { EC: 1, EM: "Gửi yêu cầu thành công!" })
                errorFindRepairman: null,
            };
        case "FIND_REPAIRMAN_FAIL":
            return {
                ...state,
                loading: false,
                successFindRepairman: null,
                errorFindRepairman: action.payload, // Lưu thông báo lỗi
            };


        case "VIEW_REQUEST_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "VIEW_REQUEST_SUCCESS":
            return {
                ...state,
                loading: false,
                request: action.payload, // Lưu request từ BE
                errorViewRequest: null,
            };
        case "VIEW_REQUEST_FAIL":
            return {
                ...state,
                loading: false,
                request: null,
                errorViewRequest: action.payload, // Lưu thông báo lỗi
            };


        case "DEAL_PRICE_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "DEAL_PRICE_SUCCESS":
            return {
                ...state,
                loading: false,
                successDealPrice: action.payload, // Lưu dữ liệu từ BE (EC, EM, DT)
                errorDealPrice: null,
            };
        case "DEAL_PRICE_FAIL":
            return {
                ...state,
                loading: false,
                successDealPrice: null,
                errorDealPrice: action.payload, // Lưu thông báo lỗi
            };


        case "RESET_ERROR":
            return {
                ...state,
                updateInfoError: null,
                error: null,
                complaintError: null,
                errorRepairHistory: null,
                errorUgrade: null,
                errorServiceTypes: null,
                errorToggleStatus: null,
                errorGetStatus: null,

                errorFindRepairman: null,
                errorViewRequest: null,
                errorDealPrice: null,

            };
        case "RESET_SUCCESS":
            return {
                ...state,
                updateInfoSuccess: null,
                complaintMessage: null,
                repairHistory: null,
                successUpgrade: null,

                successFindRepairman: null,
                successDealPrice: null,

            };
        default:
            return state;
    }
};

export default userReducer;
