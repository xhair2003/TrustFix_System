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
    errorFetchBalance: null,
    requestId: null,
    errorFindRepairman: null,
    errorViewRequest: null,
    successFindRepairman: null,
    request: null,
    errorDealPrice: null,
    successDealPrice: null,
    errorViewRepairmanDeal: null,
    repairmanDeals: [],

    errorMonthlyFee: null,
    successMonthlyFee: null,

    successPurchaseVip: null,
    errorPurchaseVip: null,

    errorSupplementary: null,
    successSupplementary: null,

    successMakePayment: null,
    errorMakePayment: null,

    successRating: null,
    errorRating: null,

    successRequest: null,
    errorRequest: null,
    customerRequest: null,

    successConfirmRequest: null,
    errorConfirmRequest: null,

    successConfirmRequestRepairman: null,
    errorConfirmRequestRepairman: null,

    requestStatus: null,
    errorRequestStatus: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER_INFO_REQUEST":
            return { ...state, loading: true };
        case "GET_USER_INFO_SUCCESS":
            return { ...state, loading: false, userInfo: action.payload, error: null };
        case "GET_USER_INFO_FAIL":
            return { ...state, loading: false, error: action.payload, userInfo: null };


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

            };
        case "FETCH_BALANCE_SUCCESS":
            return {
                ...state,
                loading: false,
                balance: action.payload, // Cập nhật số dư
                errorFetchBalance: null,
            };
        case "FETCH_BALANCE_FAIL":
            return {
                ...state,
                loading: false,
                errorFetchBalance: action.payload,
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
            return { ...state, loading: true };
        case 'SERVICE_INDUSTRY_TYPE_SUCCESS':
            return {
                ...state,
                loading: false,
                serviceTypes: action.payload, // Lưu danh sách loại dịch vụ vào store
                errorServiceTypes: null
            };
        case 'SERVICE_INDUSTRY_TYPE_FAIL':
            return {
                ...state,
                loading: false,
                serviceTypes: [],
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


        case "ADD_RATING_REQUEST":
            return { ...state, loading: true };
        case "ADD_RATING_SUCCESS":
            return {
                ...state,
                loading: false,
                successRating: action.payload, // "Đánh giá thành công!"
                errorRating: null,
            };
        case "ADD_RATING_FAIL":
            return {
                ...state,
                loading: false,
                successRating: null,
                errorRating: action.payload,
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
                //loading: true,
            };
        case "FIND_REPAIRMAN_SUCCESS":
            return {
                ...state,
                //loading: false,
                requestId: action.payload.requestId, // Lưu dữ liệu từ BE
                successFindRepairman: action.payload.message, // Lưu dữ liệu từ BE (VD: { EC: 1, EM: "Gửi yêu cầu thành công!" })
                errorFindRepairman: null,
            };
        case "FIND_REPAIRMAN_FAIL":
            return {
                ...state,
                //loading: false,
                successFindRepairman: null,
                requestId: null,
                errorFindRepairman: action.payload, // Lưu thông báo lỗi
            };


        case "VIEW_REQUEST_REQUEST":
            return {
                ...state,
                //loading: true,
            };
        case "VIEW_REQUEST_SUCCESS":
            return {
                ...state,
                //loading: false,
                request: action.payload, // Lưu request từ BE
                //errorViewRequest: null,
            };
        case "VIEW_REQUEST_FAIL":
            return {
                ...state,
                //loading: false,
                request: null,
                //errorViewRequest: action.payload, // Lưu thông báo lỗi
            };


        case "DEAL_PRICE_REQUEST":
            return {
                ...state,
                loading: true,
                successDealPrice: null,
                errorDealPrice: null,
            };
        case "DEAL_PRICE_SUCCESS":
            return {
                ...state,
                loading: false,
                successDealPrice: action.payload.message, // Lưu thông báo thành công
                errorDealPrice: null,
                // Nếu isDeal là true, cập nhật trạng thái request (nếu cần)
                request:
                    action.payload.isDeal === "true" && state.request
                        ? { ...state.request, status: "Done deal price" }
                        : state.request,
            };
        case "DEAL_PRICE_FAIL":
            return {
                ...state,
                loading: false,
                successDealPrice: null,
                errorDealPrice: action.payload, // Lưu thông báo lỗi
            };
        case "REMOVE_REQUEST":
            return {
                ...state,
                request: null, // Xóa request khỏi state khi hủy deal
            };


        case "VIEW_REPAIRMAN_DEAL_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "VIEW_REPAIRMAN_DEAL_SUCCESS":
            return {
                ...state,
                loading: false,
                repairmanDeals: action.payload, // Lưu danh sách repairmanDeals từ BE
                errorViewRepairmanDeal: null,
            };
        case "VIEW_REPAIRMAN_DEAL_FAIL":
            return {
                ...state,
                loading: false,
                errorViewRepairmanDeal: action.payload, // Lưu thông báo lỗi
            };


        case "PROCESS_MONTHLY_FEE_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "PROCESS_MONTHLY_FEE_SUCCESS":
            return {
                ...state,
                loading: false,
                successMonthlyFee: action.payload,
                errorMonthlyFee: null,
            };
        case "PROCESS_MONTHLY_FEE_FAIL":
            return {
                ...state,
                loading: false,
                errorMonthlyFee: action.payload,
                successMonthlyFee: null,
            };


        case "PURCHASE_VIP_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "PURCHASE_VIP_SUCCESS":
            return {
                ...state,
                loading: false,
                successPurchaseVip: action.payload,
                errorPurchaseVip: null,
            };
        case "PURCHASE_VIP_FAIL":
            return {
                ...state,
                loading: false,
                successPurchaseVip: null,
                errorPurchaseVip: action.payload,
            };


        case 'SUPPLEMENTARY_PRACTICE_CERTIFICATE_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'SUPPLEMENTARY_PRACTICE_CERTIFICATE_SUCCESS':
            return {
                ...state,
                loading: false,
                successSupplementary: action.payload,
                errorSupplementary: null,
            };
        case 'SUPPLEMENTARY_PRACTICE_CERTIFICATE_FAIL':
            return {
                ...state,
                loading: false,
                successSupplementary: null,
                errorSupplementary: action.payload,
            };


        case "ASSIGN_REPAIRMAN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "ASSIGN_REPAIRMAN_SUCCESS":
            return {
                ...state,
                loading: false,
                successMakePayment: action.payload,
                errorMakePayment: null,
            };
        case "ASSIGN_REPAIRMAN_FAIL":
            return {
                ...state,
                loading: false,
                successMakePayment: null,
                errorMakePayment: action.payload,
            };


        case "VIEW_CUSTOMER_REQUEST_REQUEST":
            return { ...state, loading: true, };
        case "VIEW_CUSTOMER_REQUEST_SUCCESS":
            return {
                ...state,
                loading: false,
                customerRequest: action.payload,
                successRequest: "Hiển thị thông tin khách hàng và đơn hàng thành công",
                errorRequest: null,
            };
        case "VIEW_CUSTOMER_REQUEST_FAIL":
            return {
                ...state,
                loading: false,
                customerRequest: null,
                successRequest: null,
                errorRequest: action.payload,
            };


        case "CONFIRM_REQUEST_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "CONFIRM_REQUEST_SUCCESS":
            return {
                ...state,
                loading: false,
                successConfirmRequest: action.payload,
                errorConfirmRequest: null
            };
        case "CONFIRM_REQUEST_FAIL":
            return {
                ...state,
                loading: false,
                successConfirmRequest: null,
                errorConfirmRequest: action.payload
            };



        case "FETCH_REQUEST_STATUS_REQUEST":
            return { ...state, loading: true };
        case "FETCH_REQUEST_STATUS_SUCCESS":
            return { ...state, loading: false, requestStatus: action.payload, errorRequestStatus: null };
        case "FETCH_REQUEST_STATUS_FAIL":
            return { ...state, loading: false, errorRequestStatus: action.payload, requestStatus: null };



        case "CONFIRM_REQUEST_REPAIRMAN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "CONFIRM_REQUEST_REPAIRMAN_SUCCESS":
            return {
                ...state,
                loading: false,
                successConfirmRequestRepairman: action.payload.EM,
                errorConfirmRequestRepairman: null,
            };
        case "CONFIRM_REQUEST_REPAIRMAN_FAIL":
            return {
                ...state,
                loading: false,
                successConfirmRequestRepairman: null,
                errorConfirmRequestRepairman: action.payload,
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
                errorFetchBalance: null,
                errorFindRepairman: null,
                errorViewRequest: null,
                errorDealPrice: null,
                errorViewRepairmanDeal: null,

                errorMonthlyFee: null,

                errorPurchaseVip: null,

                errorSupplementary: null,

                errorMakePayment: null,

                errorRating: null,

                errorRequest: null,

                errorConfirmRequest: null,

                errorConfirmRequestRepairman: null,

                errorRequestStatus: null
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

                successMonthlyFee: null,

                successPurchaseVip: null,

                successSupplementary: null,

                successMakePayment: null,

                successRating: null,

                successRequest: null,

                successConfirmRequest: null,

                successConfirmRequestRepairman: null,
            };
        default:
            return state;
    }
};

export default userReducer;
