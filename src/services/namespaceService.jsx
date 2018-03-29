import request from 'Util/request';

const baseRawUrl = '/conductor/api/v1/_raw';

export default {
  getNamespaces: () => {
    return request(baseRawUrl + '/namespace', {method: 'GET'});
  },

  getUserNamespaces: (cluster, username) => {
    return request('/apis/cmss.com/v1/authority/user/' + username + '/conditions?cluster=' + cluster, {method: 'GET'})
  },
}