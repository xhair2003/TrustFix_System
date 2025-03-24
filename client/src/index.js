import ReactDOM from 'react-dom/client';
import UserROUTERS from './router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import NotificationPopup from '../src/component/users/NotificationPopup/NotificationPopup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <>
        <NotificationPopup /> {/* Popup hiển thị ở mọi trang */}
        <UserROUTERS />
      </>
    </BrowserRouter>
  </Provider>
);

