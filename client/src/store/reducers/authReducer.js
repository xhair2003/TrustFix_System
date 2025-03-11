const initialState = {
    token: null || localStorage.getItem('token'),
    isAuthenticated: false || localStorage.getItem('isAuthenticated'),
    error: null,
    user: null,
    success: null,
    loading: false,
    resetToken: null,
    errorRegister: null,
    errorVerifyRegister: null,
    errorChangePassword: null,
    errorResetPassword: null,
    errorVerifyOTP: null,
    errorForgotPassword: null,
    errorLogin: null,
    successResetPassword: null,
    successForgotPassword: null,
    successChangePassword: null,
    successRegister: null,
    successVerifyOTP: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
        case "REGISTER_REQUEST":
        case "FORGOT_PASSWORD_REQUEST":
        case "VERIFY_OTP_REQUEST":
        case "RESET_PASSWORD_REQUEST":
        case "CHANGE_PASSWORD_REQUEST":
        case "VERIFY_REGISTER_REQUEST":
            return { ...state, loading: true };

        case "LOGIN_SUCCESS":
            return {
                ...state,
                token: action.payload.accessToken,
                isAuthenticated: action.payload.isAuthenticated,
                errorLogin: null,
                user: action.payload.user,
                loading: false,
            };

        case "LOGOUT":
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                user: null,
            };

        case "VERIFY_REGISTER_SUCCESS":
            return {
                ...state,
                //user: action.payload.user,
                errorVerifyRegister: null,
                //token: action.payload.accessToken,
                //isAuthenticated: action.payload.isAuthenticated,
                loading: false,
            };

        case "VERIFY_OTP_SUCCESS":
            return {
                ...state,
                errorVerifyOTP: null,
                resetToken: action.payload.DT.resetToken,
                successVerifyOTP: action.payload.EM,
                loading: false,
            };

        case "REGISTER_SUCCESS":
            return { ...state, loading: false, successRegister: action.payload.EM, errorRegister: null };
        case "CHANGE_PASSWORD_SUCCESS":
            return { ...state, loading: false, successChangePassword: action.payload.EM, errorChangePassword: null };
        case "FORGOT_PASSWORD_SUCCESS":
            return { ...state, loading: false, successForgotPassword: action.payload.EM, errorForgotPassword: null };
        case "RESET_PASSWORD_SUCCESS":
            return { ...state, loading: false, successResetPassword: action.payload.EM, errorResetPassword: null };


        case "LOGIN_FAIL":
            return { ...state, loading: false, errorLogin: action.payload.EM };
        case "FORGOT_PASSWORD_FAIL":
            return { ...state, loading: false, errorForgotPassword: action.payload.EM, successForgotPassword: null };
        case "VERIFY_OTP_FAIL":
            return { ...state, loading: false, errorVerifyOTP: action.payload.EM, successVerifyOTP: null };
        case "RESET_PASSWORD_FAIL":
            return { ...state, loading: false, errorResetPassword: action.payload.EM, successResetPassword: null };
        case "CHANGE_PASSWORD_FAIL":
            return { ...state, loading: false, errorChangePassword: action.payload.EM, successChangePassword: null };
        case "VERIFY_REGISTER_FAIL":
            return { ...state, loading: false, errorVerifyRegister: action.payload.EM };
        case "REGISTER_FAIL":
            return { ...state, loading: false, errorRegister: action.payload.EM, successRegister: null };

        default:
            return state;
    }
};

export default authReducer;
