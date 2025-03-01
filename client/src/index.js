import ReactDOM from 'react-dom/client';
import UserROUTERS from './router';
import { BrowserRouter } from 'react-router-dom';
import "./assets/styles/reset.scss";
import "./assets/styles/global.scss";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserROUTERS />
  </BrowserRouter>
);


