import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { DatabaseProvider } from './database';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <DatabaseProvider>
        <App />
      </DatabaseProvider>
    </Provider>
  </StrictMode>,
);
