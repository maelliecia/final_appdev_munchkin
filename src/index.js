import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './munchkin-theme.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);