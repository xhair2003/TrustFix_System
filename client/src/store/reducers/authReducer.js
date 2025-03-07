const initialState = {
    token: null,
    isAuthenticated: false,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                token: action.payload.accessToken,
                isAuthenticated: action.payload.isAuthenticated,
                error: null
            };
        case "LOGIN_FAIL":
            return {
                ...state,
                error: action.payload.error
            };
        case "LOGOUT":
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default authReducer;
