import { browserHistory } from 'react-router';
import cookie from 'js-cookie';

import loginService from '../services/loginService';

export const loginUser = (credential, cb) => {
  return {
    type: 'LOGIN',
    fallback: cb,
    payload: loginService.login(credential).then(async (response) => {
      cookie.set('token', response);
      await loginService.loginHarbor(credential);
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