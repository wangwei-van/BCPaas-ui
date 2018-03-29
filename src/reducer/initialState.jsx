// 统一声明默认State
import cookie from 'js-cookie';

export default {
  auth: {
    isFetching: false,
    isLogged: cookie.get('token') ? true : false
  },
  home: {
    isFetching: false,
    authRequired: false,
    namespace: cookie.get('namespace')
  },
  apps: {
    isFetching: false,
    data: {}
  },
  users: {
    isFetching: false,
    meta: {
      total: 0,
      perPage: 10,
      page: 1
    },
    data: []
  }
};
