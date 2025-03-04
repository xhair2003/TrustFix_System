import ReactDOM from 'react-dom/client';
import UserROUTERS from './router';
import { BrowserRouter } from 'react-router-dom';
//import { Provider } from 'react-redux';
//import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Provider store={store}>
  <BrowserRouter>
    <UserROUTERS />
  </BrowserRouter>
  // </Provider>
);

// import ReactDOM from 'react-dom/client';
// import UserROUTERS from './router';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from "react-redux";
// import store from './store'; // Ensure this is the correct path to your Redux store

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <UserROUTERS />
//     </BrowserRouter>
//   </Provider>
// );

