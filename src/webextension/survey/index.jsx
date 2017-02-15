// eslint-disable-next-line no-unused-vars
import styles from './styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app.jsx';
import store from './store.jsx';
import { sendMessage } from '../lib/util';

// We don't want to rely on React to send the `unloaded` event, in case there's
// an error in loading or if it's unloaded before React is able to set up.
window.submitted = null;
window.surveyId = null;
window.addEventListener('unload', () => {
  if (!window.submitted) {
    sendMessage('unloaded', { id: window.surveyId, type: 'user' });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
