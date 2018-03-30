import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './login';
import home from './home';
import apps from './apps';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  home,
  apps,
})

export default reducers;