import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './login';
import apps from './apps';
import user from './user';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  apps,
  user
})

export default reducers;