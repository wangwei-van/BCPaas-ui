import request from 'Util/request';

export default {
  login: (credential) => {
    return request('/apis/cmss.com/v1/login', {
      method: 'POST',
      body: credential
    });
  },

  loginHarbor: (credential) => {
    return request('/image/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'principal=' + credential.username + '&password=' + credential.password
    })
  }
}