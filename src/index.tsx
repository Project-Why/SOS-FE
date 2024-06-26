import store from 'store';

import App from 'pages/App';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
