import initialState from './initialState';
import reducersGenerate from './reducerGenerator';

const GETAUTHRULE = 'GETAUTHRULE';

export default reducersGenerate(GETAUTHRULE, initialState.home, {
  'GETAUTHRULE_PENDING': (state) => {
    return Object.assign({}, state, {
      isFetching: true,
      authRequired: false
    });
  },
  'GETAUTHRULE_FULFILLED': (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      authRequired: true
    });
  },
  'GETAUTHRULE_REJECTED': (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      authRequired: false
    });
  },
  'SETNAMESPACE': (state, action) => {
    return Object.assign({}, state, {
      namespace: action.payload
    })
  }
});