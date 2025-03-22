const initialState = {
    token: null || localStorage.getItem('token'),
    isAuthenticated: false || localStorage.getItem('isAuthenticated'),
    role: null || localStorage.getItem('role'),
    user: null,
    loading: false,
    resetToken: null,

    error: null,
    errorRegister: null,
    errorVerifyRegister: null,
    errorChangePassword: null,
    errorResetPassword: null,
    errorVerifyOTP: null,
    errorForgotPassword: null,
    errorLogin: null,
    errorGetRole: null,

    success: null,
    successResetPassword: null,
    successForgotPassword: null,
    successChangePassword: null,
    successRegister: null,
    successVerifyOTP: null,
    successLogin: null,
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
                successLogin: action.payload.successLogin,
                role: action.payload.role,
            };

        case "LOGOUT":
            return {
                ...initialState,
            };

        case "VERIFY_REGISTER_SUCCESS":
            return {
                ...state,
                //user: action.payload.user,
                errorVerifyRegister: null,
                successVerifyRegister: action.payload,
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
            return { ...state, loading: false, successRegister: action.payload, errorRegister: null };
        case "CHANGE_PASSWORD_SUCCESS":
            return { ...state, loading: false, successChangePassword: action.payload.EM, errorChangePassword: null };
        case "FORGOT_PASSWORD_SUCCESS":
            return { ...state, loading: false, successForgotPassword: action.payload.EM, errorForgotPassword: null };
        case "RESET_PASSWORD_SUCCESS":
            return { ...state, loading: false, successResetPassword: action.payload.EM, errorResetPassword: null };


        case "LOGIN_FAIL":
            return { ...state, loading: false, errorLogin: action.payload.EM, successLogin: null };
        case "FORGOT_PASSWORD_FAIL":
            return { ...state, loading: false, errorForgotPassword: action.payload.EM, successForgotPassword: null };
        case "VERIFY_OTP_FAIL":
            return { ...state, loading: false, errorVerifyOTP: action.payload.EM, successVerifyOTP: null };
        case "RESET_PASSWORD_FAIL":
            return { ...state, loading: false, errorResetPassword: action.payload.EM, successResetPassword: null };
        case "CHANGE_PASSWORD_FAIL":
            return { ...state, loading: false, errorChangePassword: action.payload.EM, successChangePassword: null };
        case "VERIFY_REGISTER_FAIL":
            return { ...state, loading: false, errorVerifyRegister: action.payload, successVerifyRegister: null };
        case "REGISTER_FAIL":
            return { ...state, loading: false, errorRegister: action.payload, successRegister: null };


        case "FETCH_ROLE_TYPE_REQUEST":
            return {
                ...state,
                loading: true,
                errorGetRole: null,
            };
        case "FETCH_ROLE_TYPE_SUCCESS":
            return {
                ...state,
                loading: false,
                role: action.payload,
            };
        case "FETCH_ROLE_TYPE_FAIL":
            return {
                ...state,
                loading: false,
                errorGetRole: action.payload,
            };
















        case "RESET_ERROR":
            return {
                ...state,
                error: null,
                errorRegister: null,
                errorVerifyRegister: null,
                errorChangePassword: null,
                errorResetPassword: null,
                errorVerifyOTP: null,
                errorForgotPassword: null,
                errorLogin: null,
                errorGetRole: null,
            };
        case "RESET_SUCCESS":
            return {
                ...state,
                success: null,
                successResetPassword: null,
                successForgotPassword: null,
                successChangePassword: null,
                successRegister: null,
                successVerifyOTP: null,
                successLogin: null,
            };

        default:
            return state;
    }
};

export default authReducer;
