import initialState from './initialState';
import reducersGenerate from './reducerGenerator';

const LOGIN = 'LOGIN';

export default reducersGenerate(LOGIN, initialState.auth, {
  'LOGIN_PENDING': (state) => {
    return Object.assign({}, state, {
      isFetching: true
    });
  },
  'LOGIN_FULFILLED': (state, action) => {
    return Object.assign({}, state, {
      isFetching: false
    });
  },
  'LOGIN_REJECTED': (state, action) => {
    return Object.assign({}, state, {
      isFetching: false
    });
  },
});
