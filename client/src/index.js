import ReactDOM from 'react-dom/client';
import UserROUTERS from './router';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserROUTERS />
  </BrowserRouter>
);


