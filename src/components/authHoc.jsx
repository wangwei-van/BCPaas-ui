import React from 'react';
import PropTypes from 'prop-types';
import api from 'Constants/api';

export default (Component) => {
  class WrappedComponent extends React.Component {
    render () {
      const {auth, ...others} = this.props;
      if (api.ruleArr.indexOf(auth) === -1) {
        return null;
      }
      return <Component {...others} />;
    }
  }

  WrappedComponent.propTypes = {
    auth: PropTypes.number.isRequired
  }

  return WrappedComponent; 
}