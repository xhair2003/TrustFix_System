// Initial state
const initialState = {
    users: [],
    loading: false,
    errorGetUsers: null,
    deleteSuccessMessage: null,
    deleteErrorMessage: null,
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

















        case "RESET_ERROR":
            return {
                ...state,
                errorGetUsers: null,
                deleteErrorMessage: null,
            };
        case "RESET_SUCCESS":
            return {
                ...state,
                deleteSuccessMessage: null,
            };


        default:
            return state;
    }
};

export default adminReducer;
