const initialState = {
    token: null || localStorage.getItem('token'),
    isAuthenticated: false || localStorage.getItem('isAuthenticated'),
    error: null,
    user: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                token: action.payload.accessToken,
                isAuthenticated: action.payload.isAuthenticated,
                error: null,
                user: action.payload.user
            };
        case "LOGIN_FAIL":
            return {
                ...state,
                error: action.payload.error
            };
        case "LOGOUT":
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
            };
        default:
            return state;
    }
};

export default authReducer;
