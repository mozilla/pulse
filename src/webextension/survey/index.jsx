// eslint-disable-next-line no-unused-vars
import styles from './styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app.jsx';
import store from './store.jsx';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
