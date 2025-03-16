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
            };


        default:
            return state;
    }
};

export default adminReducer;
