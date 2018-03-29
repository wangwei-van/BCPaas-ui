import request from 'Util/request';

export default {
  getAvailRules: (cluster, namespace, username) => {
    return request('/apis/cmss.com/v1/user/'+username+'/avlrules?cluster='+cluster+'&namespace='+namespace, {method:'GET'})
  }
}