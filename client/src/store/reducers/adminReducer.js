// Initial state
const initialState = {
    users: [],
    loading: false,
    errorGetUsers: null,

    deleteSuccessMessage: null,
    deleteErrorMessage: null,

    lockSuccessMessage: null,
    lockErrorMessage: null,

    unlockSuccessMessage: null,
    unlockErrorMessage: null,

    servicePrices: [],
    successUpdateServicePrices: null,
    successDeleteServicePrices: null,
    successAddServicePrices: null,
    errorAddServicePrices: null,
    errorUpdateServicePrices: null,
    errorDeleteServicePrices: null,
    errorServicePrices: null,

    HistoryPayments: [],
    depositeHistories: [],
    errorHistoryPayments: null,
    errorDepositeHistories: null,

    errorReplyComplaint: null,
    successReplyComplaint: null,
    complaints: [],
    errorGetComplaints: null,

    repairBookingHistory: [],
    errorRepairBookingHistory: null,

    categories: [],
    successUpdateCategories: null,
    successDeleteCategories: null,
    successAddCategories: null,
    errorAddCategories: null,
    errorUpdateCategories: null,
    errorDeleteCategories: null,
    errorCategories: null,

    subcategories: [],
    successUpdateSubcategories: null,
    successDeleteSubcategories: null,
    successAddSubcategories: null,
    errorAddSubcategories: null,
    errorUpdateSubcategories: null,
    errorDeleteSubcategories: null,
    errorSubcategories: null,

    upgradeRequests: [],
    errorUpgradeRequests: null,
    errorVerifyUpgradeRequest: null,
    successVerifyUpgradeRequest: null,

    totalUsers: null,
    totalBannedUsers: null,
    totalRepairmen: null,
    totalCustomers: null,
    totalCompletedRequests: null,
    totalConfirmedRequests: null,
    totalPendingRequests: null,
    totalCancelledRequests: null,
    totalMakePaymentRequests: null,
    totalDealPriceRequests: null,
    totalPendingComplaints: null,
    totalPendingUpgradeRequests: null,
    totalServiceIndustries: null,
    totalServicesByIndustry: null,
    totalServicePrices: null,

    pendingRequests: [],
    errorPendingSupplementary: null,
    errorVerifySupplementary: null,
    successVerifySupplementary: null,

    totalsProfit: null, // Lưu object chứa các loại phí
    totalAll: 0, // Tổng tất cả giao dịch

    posts: [],
    guides: [],
};

// Reducer function
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_USERS_REQUEST":
            return {
                ...state,
                loading: true,
                errorGetUsers: null
            };
        case "FETCH_USERS_SUCCESS":
            return {
                ...state,
                loading: false,
                users: action.payload,
            };
        case "FETCH_USERS_FAIL":
            return {
                ...state,
                loading: false,
                errorGetUsers: action.payload,
            };


        case 'DELETE_USER_REQUEST':
            return {
                ...state,
                loading: true,
                deleteSuccessMessage: null,
                deleteErrorMessage: null,
            };
        case 'DELETE_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                deleteSuccessMessage: action.payload,
                deleteErrorMessage: null,
            };
        case 'DELETE_USER_FAIL':
            return {
                ...state,
                loading: false,
                deleteErrorMessage: action.payload,
                deleteSuccessMessage: null,
            };


        case 'LOCK_USER_REQUEST':
            return {
                ...state,
                loading: true,
                lockErrorMessage: null,
                lockSuccessMessage: null,
            };
        case 'LOCK_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                lockSuccessMessage: action.payload,
                lockErrorMessage: null,
            };
        case 'LOCK_USER_FAIL':
            return {
                ...state,
                loading: false,
                lockErrorMessage: action.payload,
                lockSuccessMessage: null,
            };


        case 'UNLOCK_USER_REQUEST':
            return {
                ...state,
                loading: true,
                unlockErrorMessage: null,
                unlockSuccessMessage: null,
            };
        case 'UNLOCK_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                unlockSuccessMessage: action.payload,
                unlockErrorMessage: null,
            };
        case 'UNLOCK_USER_FAIL':
            return {
                ...state,
                loading: false,
                unlockErrorMessage: action.payload,
                unlockSuccessMessage: null,
            };


        case 'FETCH_SERVICE_PRICES_REQUEST':
            return {
                ...state,
                loading: true,
                errorServicePrices: null,
            };
        case 'FETCH_SERVICE_PRICES_SUCCESS':
            return {
                ...state,
                loading: false,
                servicePrices: action.payload,
            };
        case 'FETCH_SERVICE_PRICES_FAIL':
            return {
                ...state,
                loading: false,
                errorServicePrices: action.payload,
            };


        case 'ADD_SERVICE_PRICE_REQUEST':
            return {
                ...state,
                loading: true,
                successAddServicePrices: null,
                errorAddServicePrices: null,
            };
        case 'ADD_SERVICE_PRICE_SUCCESS':
            return {
                ...state,
                loading: false,
                successAddServicePrices: action.payload,
                errorAddServicePrices: null,
            };
        case 'ADD_SERVICE_PRICE_FAIL':
            return {
                ...state,
                loading: false,
                errorAddServicePrices: action.payload,
                successAddServicePrices: null,
            };


        case 'UPDATE_SERVICE_PRICE_REQUEST':
            return {
                ...state,
                loading: true,
                successUpdateServicePrices: null,
                errorUpdateServicePrices: null,
            };
        case 'UPDATE_SERVICE_PRICE_SUCCESS':
            return {
                ...state,
                loading: false,
                successUpdateServicePrices: action.payload,
                errorUpdateServicePrices: null,
            };
        case 'UPDATE_SERVICE_PRICE_FAIL':
            return {
                ...state,
                loading: false,
                errorUpdateServicePrices: action.payload,
                successUpdateServicePrices: null,
            };


        case 'DELETE_SERVICE_PRICE_REQUEST':
            return {
                ...state,
                loading: true,
                successDeleteServicePrices: null,
                errorDeleteServicePrices: null,
            };
        case 'DELETE_SERVICE_PRICE_SUCCESS':
            return {
                ...state,
                loading: false,
                successDeleteServicePrices: action.payload,
                errorDeleteServicePrices: null,
            };
        case 'DELETE_SERVICE_PRICE_FAIL':
            return {
                ...state,
                loading: false,
                errorDeleteServicePrices: action.payload,
                successDeleteServicePrices: null,
            };


        case 'FETCH_PAYMENT_HISTORY_REQUEST':
            return { ...state, loading: true, errorHistoryPayments: null };
        case 'FETCH_PAYMENT_HISTORY_SUCCESS':
            return { ...state, loading: false, HistoryPayments: action.payload };
        case 'FETCH_PAYMENT_HISTORY_FAIL':
            return { ...state, loading: false, errorHistoryPayments: action.payload };


        case 'FETCH_DEPOSIT_HISTORY_REQUEST':
            return { ...state, loading: true, errorDepositeHistories: null };
        case 'FETCH_DEPOSIT_HISTORY_SUCCESS':
            return { ...state, loading: false, depositeHistories: action.payload };
        case 'FETCH_DEPOSIT_HISTORY_FAIL':
            return { ...state, loading: false, errorDepositeHistories: action.payload };


        case 'REPLY_TO_COMPLAINT_REQUEST':
            return { ...state, loading: true, errorReplyComplaint: null, successReplyComplaint: null };
        case 'REPLY_TO_COMPLAINT_SUCCESS':
            return { ...state, loading: false, successReplyComplaint: action.payload };
        case 'REPLY_TO_COMPLAINT_FAIL':
            return { ...state, loading: false, errorReplyComplaint: action.payload };


        case 'FETCH_COMPLAINTS_REQUEST':
            return { ...state, loading: true, errorGetComplaints: null };
        case 'FETCH_COMPLAINTS_SUCCESS':
            return { ...state, loading: false, complaints: action.payload };
        case 'FETCH_COMPLAINTS_FAIL':
            return { ...state, loading: false, errorGetComplaints: action.payload };


        case 'FETCH_REPAIR_BOOKING_HISTORY_REQUEST':
            return { ...state, loading: true, errorRepairBookingHistory: null };
        case 'FETCH_REPAIR_BOOKING_HISTORY_SUCCESS':
            return { ...state, loading: false, repairBookingHistory: action.payload };
        case 'FETCH_REPAIR_BOOKING_HISTORY_FAIL':
            return { ...state, loading: false, errorRepairBookingHistory: action.payload };


        case 'CREATE_SERVICE_INDUSTRY_REQUEST':
            return { ...state, loading: true, errorAddCategories: null, successAddCategories: null };
        case 'CREATE_SERVICE_INDUSTRY_SUCCESS':
            return { ...state, loading: false, successAddCategories: action.payload };
        case 'CREATE_SERVICE_INDUSTRY_FAIL':
            return { ...state, loading: false, errorAddCategories: action.payload };


        case 'UPDATE_SERVICE_INDUSTRY_REQUEST':
            return { ...state, loading: true, errorUpdateCategories: null, successUpdateCategories: null };
        case 'UPDATE_SERVICE_INDUSTRY_SUCCESS':
            return { ...state, loading: false, successUpdateCategories: action.payload };
        case 'UPDATE_SERVICE_INDUSTRY_FAIL':
            return { ...state, loading: false, errorUpdateCategories: action.payload };


        case 'DELETE_SERVICE_INDUSTRY_REQUEST':
            return { ...state, loading: true, errorDeleteCategories: null, successDeleteCategories: null };
        case 'DELETE_SERVICE_INDUSTRY_SUCCESS':
            return { ...state, loading: false, successDeleteCategories: action.payload };
        case 'DELETE_SERVICE_INDUSTRY_FAIL':
            return { ...state, loading: false, errorDeleteCategories: action.payload };


        case 'GET_ALL_SERVICE_INDUSTRIES_REQUEST':
            return { ...state, loading: true, errorCategories: null };
        case 'GET_ALL_SERVICE_INDUSTRIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'GET_ALL_SERVICE_INDUSTRIES_FAIL':
            return { ...state, loading: false, errorCategories: action.payload };


        case 'CREATE_SERVICE_REQUEST':
            return { ...state, loading: true, errorAddSubcategories: null, successAddSubcategories: null };
        case 'CREATE_SERVICE_SUCCESS':
            return { ...state, loading: false, successAddSubcategories: action.payload };
        case 'CREATE_SERVICE_FAIL':
            return { ...state, loading: false, errorAddSubcategories: action.payload };


        case 'UPDATE_SERVICE_REQUEST':
            return { ...state, loading: true, errorUpdateSubcategories: null, successUpdateSubcategories: null };
        case 'UPDATE_SERVICE_SUCCESS':
            return { ...state, loading: false, successUpdateSubcategories: action.payload };
        case 'UPDATE_SERVICE_FAIL':
            return { ...state, loading: false, errorUpdateSubcategories: action.payload };


        case 'DELETE_SERVICE_REQUEST':
            return { ...state, loading: true, errorDeleteSubcategories: null, successDeleteSubcategories: null };
        case 'DELETE_SERVICE_SUCCESS':
            return { ...state, loading: false, successDeleteSubcategories: action.payload };
        case 'DELETE_SERVICE_FAIL':
            return { ...state, loading: false, errorDeleteSubcategories: action.payload };


        case 'GET_ALL_SERVICES_REQUEST':
            return { ...state, loading: true, errorSubcategories: null };
        case 'GET_ALL_SERVICES_SUCCESS':
            return { ...state, loading: false, subcategories: action.payload };
        case 'GET_ALL_SERVICES_FAIL':
            return { ...state, loading: false, errorSubcategories: action.payload };


        case 'GET_PENDING_UPGRADE_REQUESTS_REQUEST':
            return { ...state, loading: true, errorUpgradeRequests: null };
        case 'GET_PENDING_UPGRADE_REQUESTS_SUCCESS':
            return {
                ...state,
                loading: false,
                upgradeRequests: action.payload,
            };
        case 'GET_PENDING_UPGRADE_REQUESTS_FAIL':
            return {
                ...state,
                loading: false,
                errorUpgradeRequests: action.payload,
            };



        // VERIFY REPAIRMAN UPGRADE REQUEST
        case 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_REQUEST':
            return { ...state, loading: true, errorVerifyUpgradeRequest: null, successVerifyUpgradeRequest: null };
        case 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_SUCCESS':
            return {
                ...state,
                loading: false,
                successVerifyUpgradeRequest: action.payload,
            };
        case 'VERIFY_REPAIRMAN_UPGRADE_REQUEST_FAIL':
            return {
                ...state,
                loading: false,
                errorVerifyUpgradeRequest: action.payload,
            };



        // DASHBOARD
        case "REQUEST_TOTAL_USERS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_USERS":
            return { ...state, totalUsers: action.payload, loading: false };

        case "ERROR_TOTAL_USERS":
            return { ...state, error: action.payload, loading: false };

        // Similarly for other action types...
        case "REQUEST_TOTAL_BANNED_USERS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_BANNED_USERS":
            return { ...state, totalBannedUsers: action.payload, loading: false };

        case "ERROR_TOTAL_BANNED_USERS":
            return { ...state, error: action.payload, loading: false };

        case "REQUEST_TOTAL_REPAIRMEN":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_REPAIRMEN":
            return { ...state, totalRepairmen: action.payload, loading: false };

        case "ERROR_TOTAL_REPAIRMEN":
            return { ...state, error: action.payload, loading: false };

        // Handle total customers
        case "REQUEST_TOTAL_CUSTOMERS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_CUSTOMERS":
            return { ...state, totalCustomers: action.payload, loading: false };

        case "ERROR_TOTAL_CUSTOMERS":
            return { ...state, error: action.payload, loading: false };

        // Handle total completed requests
        case "REQUEST_TOTAL_COMPLETED_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_COMPLETED_REQUESTS":
            return { ...state, totalCompletedRequests: action.payload, loading: false };

        case "ERROR_TOTAL_COMPLETED_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total confirmed requests
        case "REQUEST_TOTAL_CONFIRMED_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_CONFIRMED_REQUESTS":
            return { ...state, totalConfirmedRequests: action.payload, loading: false };

        case "ERROR_TOTAL_CONFIRMED_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total pending requests
        case "REQUEST_TOTAL_PENDING_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_PENDING_REQUESTS":
            return { ...state, totalPendingRequests: action.payload, loading: false };

        case "ERROR_TOTAL_PENDING_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total cancelled requests
        case "REQUEST_TOTAL_CANCELLED_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_CANCELLED_REQUESTS":
            return { ...state, totalCancelledRequests: action.payload, loading: false };

        case "ERROR_TOTAL_CANCELLED_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total make payment requests
        case "REQUEST_TOTAL_MAKE_PAYMENT_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_MAKE_PAYMENT_REQUESTS":
            return { ...state, totalMakePaymentRequests: action.payload, loading: false };

        case "ERROR_TOTAL_MAKE_PAYMENT_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total deal price requests
        case "REQUEST_TOTAL_DEAL_PRICE_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_DEAL_PRICE_REQUESTS":
            return { ...state, totalDealPriceRequests: action.payload, loading: false };

        case "ERROR_TOTAL_DEAL_PRICE_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total pending complaints
        case "REQUEST_TOTAL_PENDING_COMPLAINTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_PENDING_COMPLAINTS":
            return { ...state, totalPendingComplaints: action.payload, loading: false };

        case "ERROR_TOTAL_PENDING_COMPLAINTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total pending upgrade requests
        case "REQUEST_TOTAL_PENDING_UPGRADE_REQUESTS":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_PENDING_UPGRADE_REQUESTS":
            return { ...state, totalPendingUpgradeRequests: action.payload, loading: false };

        case "ERROR_TOTAL_PENDING_UPGRADE_REQUESTS":
            return { ...state, error: action.payload, loading: false };

        // Handle total service industries
        case "REQUEST_TOTAL_SERVICE_INDUSTRIES":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_SERVICE_INDUSTRIES":
            return { ...state, totalServiceIndustries: action.payload, loading: false };

        case "ERROR_TOTAL_SERVICE_INDUSTRIES":
            return { ...state, error: action.payload, loading: false };

        // Handle total services by industry
        case "REQUEST_TOTAL_SERVICES_BY_INDUSTRY":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_SERVICES_BY_INDUSTRY":
            return {
                ...state,
                totalServicesByIndustry: Array.isArray(action.payload) ? action.payload : [],
                loading: false
            };
        case "ERROR_TOTAL_SERVICES_BY_INDUSTRY":
            return {
                ...state,
                error: action.payload,
                loading: false,
                totalServicesByIndustry: [] // Reset để tránh dữ liệu cũ gây lỗi
            };


        case "GET_MOST_USED_VIP_SERVICE_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "GET_MOST_USED_VIP_SERVICE_SUCCESS":
            return {
                ...state,
                loading: false,
                mostUsedVipService: action.payload,
                error: null,
            };
        case "GET_MOST_USED_VIP_SERVICE_FAIL":
            return {
                ...state,
                loading: false,
                mostUsedVipService: null,
                error: action.payload,
            };


        // Handle total service prices
        case "REQUEST_TOTAL_SERVICE_PRICES":
            return { ...state, loading: true };

        case "SUCCESS_TOTAL_SERVICE_PRICES":
            return { ...state, totalServicePrices: action.payload, loading: false };

        case "ERROR_TOTAL_SERVICE_PRICES":
            return { ...state, error: action.payload, loading: false };



        case 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_SUCCESS':
            return {
                ...state,
                loading: false,
                pendingRequests: action.payload,
                errorPendingSupplementary: null,
            };
        case 'GET_PENDING_SUPPLEMENTARY_CERTIFICATE_REQUESTS_FAIL':
            return {
                ...state,
                loading: false,
                errorPendingSupplementary: action.payload,
            };

        // Xác minh yêu cầu
        case 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_SUCCESS':
            return {
                ...state,
                loading: false,
                successVerifySupplementary: action.payload,
                errorVerifySupplementary: null,
            };
        case 'VERIFY_SUPPLEMENTARY_CERTIFICATE_REQUEST_FAIL':
            return {
                ...state,
                loading: false,
                successVerifySupplementary: null,
                errorVerifySupplementary: action.payload,
            };


        case "GET_ALL_PROFIT_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "GET_ALL_PROFIT_SUCCESS":
            return {
                ...state,
                loading: false,
                totalsProfit: action.payload.totalsProfit,
                totalAll: action.payload.totalAll,
            };
        case "GET_ALL_PROFIT_FAIL":
            return {
                ...state,
                loading: false,
                totalsProfit: null,
                totalAll: 0,
            };


        case "GET_YEARLY_PROFIT_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "GET_YEARLY_PROFIT_SUCCESS":
            return {
                ...state,
                loading: false,
                yearlyProfit: action.payload.yearlyProfit,
                totalAllByYear: action.payload.totalAll,
            };
        case "GET_YEARLY_PROFIT_FAIL":
            return {
                ...state,
                loading: false,
                yearlyProfit: {},
                totalAllByYear: {},
                error: action.payload,
            };



        // Get Posts (Admin)
        case "GET_POSTS_REQUEST":
            return { ...state, loading: true, error: null };
        case "GET_POSTS_SUCCESS":
            return {
                ...state,
                loading: false,
                posts: action.payload,
                error: null,
            };
        case "GET_POSTS_FAILURE":
            return { ...state, loading: false, error: action.payload };

        // Moderate Post
        case "MODERATE_POST_REQUEST":
            return { ...state, loading: true, error: null, success: null };
        case "MODERATE_POST_SUCCESS":
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload
            };
        case "MODERATE_POST_FAILURE":
            return { ...state, loading: false, error: action.payload, success: null };



        case 'GET_GUIDES_REQUEST':
            return { ...state, loading: true, error: null };
        case 'GET_GUIDES_SUCCESS':
            return { ...state, loading: false, guides: action.payload, error: null };
        case 'GET_GUIDES_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'ADD_GUIDE_REQUEST':
            return { ...state, loading: true, error: null, success: null };
        case 'ADD_GUIDE_SUCCESS':
            return {
                ...state,
                loading: false,
                guides: [...state.guides, action.payload.DT],
                error: null,
                success: action.payload.EM
            };
        case 'ADD_GUIDE_FAIL':
            return { ...state, loading: false, error: action.payload, success: null };

        case 'UPDATE_GUIDE_REQUEST':
            return { ...state, loading: true, error: null, success: null };
        case 'UPDATE_GUIDE_SUCCESS':
            return {
                ...state,
                loading: false,
                guides: state.guides.map((guide) =>
                    guide._id === action.payload.DT._id ? action.payload.DT : guide
                ),
                error: null,
                success: action.payload.EM
            };
        case 'UPDATE_GUIDE_FAIL':
            return { ...state, loading: false, error: action.payload, success: null };

        case 'DELETE_GUIDE_REQUEST':
            return { ...state, loading: true, error: null, success: null };
        case 'DELETE_GUIDE_SUCCESS':
            return {
                ...state,
                loading: false,
                guides: state.guides.filter((guide) => guide._id !== action.payload.id),
                error: null,
                success: action.payload.data.EM
            };
        case 'DELETE_GUIDE_FAIL':
            return { ...state, loading: false, error: action.payload, success: null };





        case "RESET_ERROR":
            return {
                ...state,
                errorGetUsers: null,
                deleteErrorMessage: null,

                lockErrorMessage: null,
                unlockErrorMessage: null,

                errorAddServicePrices: null,
                errorUpdateServicePrices: null,
                errorDeleteServicePrices: null,
                errorServicePrices: null,

                errorDepositeHistories: null,
                errorHistoryPayments: null,

                errorReplyComplaint: null,
                errorGetComplaints: null,

                errorRepairBookingHistory: null,

                errorAddSubcategories: null,
                errorUpdateSubcategories: null,
                errorDeleteSubcategories: null,
                errorSubcategories: null,

                errorAddCategories: null,
                errorUpdateCategories: null,
                errorDeleteCategories: null,
                errorCategories: null,

                errorUpgradeRequests: null,
                errorVerifyUpgradeRequest: null,

                errorPendingSupplementary: null,
                errorVerifySupplementary: null,
            };


        case "RESET_SUCCESS":
            return {
                ...state,
                deleteSuccessMessage: null,

                unlockSuccessMessage: null,
                lockSuccessMessage: null,

                successUpdateServicePrices: null,
                successDeleteServicePrices: null,
                successAddServicePrices: null,

                successReplyComplaint: null,

                successUpdateSubcategories: null,
                successDeleteSubcategories: null,
                successAddSubcategories: null,

                successUpdateCategories: null,
                successDeleteCategories: null,
                successAddCategories: null,

                successVerifyUpgradeRequest: null,

                successVerifySupplementary: null,
            };


        default:
            return state;
    }
};

export default adminReducer;
