import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import adminReducer from './adminReducer';
import paymentReducer from './paymentReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
    payment: paymentReducer,
    message: messageReducer,
});

export default rootReducer;