import React, { Component } from 'react';

class Wrapper extends Component {
  render () {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default Wrapper;