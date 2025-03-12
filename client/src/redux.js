import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './store/reducers/rootReducer';


export const store = createStore(rootReducer, applyMiddleware(thunk)); // Thêm middleware ở đây nếu cần

