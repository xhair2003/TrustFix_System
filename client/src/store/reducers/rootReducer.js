import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import adminReducer from './adminReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
});

export default rootReducer;