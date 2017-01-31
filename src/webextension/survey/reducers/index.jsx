import { combineReducers } from 'redux';

import formReducer from './form.jsx';

export default combineReducers({ form: formReducer });
