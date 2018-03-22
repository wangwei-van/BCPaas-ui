import { browserHistory } from 'react-router';
import request from 'Util/request';
import cookie from 'js-cookie';

export const loginUser = (credential, cb) => {
  return {
    type: 'LOGIN',
    fallback: cb,
    payload: request("/apis/cmss.com/v1/login", {
      method: 'POST',
      body: credential
    }).then(response => {
      cookie.set('token', response);
      cookie.set('username', credential.username);
      browserHistory.push('/');
      return response;
    })
  } 
}

export const logout = () => {
  return {
    type: 'LOGOUT'
  }
}