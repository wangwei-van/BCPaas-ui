import { browserHistory } from 'react-router';
import cookie from 'js-cookie';

import loginService from '../services/loginService';

export const loginUser = (credential) => {
  return {
    type: 'LOGIN',
    payload: loginService.login(credential).then(async (response) => {
      cookie.set('token', response);
      cookie.set('username', credential.username);

      await loginService.loginHarbor(credential);
      browserHistory.push('/dashboard');
      return null;
    })
  }
}