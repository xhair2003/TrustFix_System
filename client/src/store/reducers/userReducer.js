const initialState = {
    loading: false,
    userInfo: null,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER_INFO_REQUEST":
            return { ...state, loading: true, error: null };
        case "GET_USER_INFO_SUCCESS":
            return { ...state, loading: false, userInfo: action.payload };
        case "GET_USER_INFO_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default userReducer;
