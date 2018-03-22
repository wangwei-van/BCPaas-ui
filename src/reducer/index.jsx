import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './login';
import user from './user';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  user
})

export default reducers;