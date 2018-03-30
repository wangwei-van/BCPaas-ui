import prodStore from './store.prod';
import devStore from './store.dev';
import initialState from '../reducer/initialState';

let store;

if (process.env.NODE_ENV === 'production') {
  store = prodStore(initialState);
} else {
  store = devStore(initialState);
}

export default store;