import React from 'react';
import { permission } from 'Constants/permission';

export default (Component, auth) => {
  return class extends React.Component {
    render () {
      if (permission.indexOf(auth) === -1) {
        return null;
      }
      return Component;
    }
  }
}