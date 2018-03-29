import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './login';
import home from './home';
import apps from './apps';
import user from './user';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  home,
  apps,
  user
})

export default reducers;