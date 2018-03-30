import React from 'react';

class ApplicationDetail extends React.Component {
  render () {
    return (
      <div>
        <span>id: {this.props.params.name}</span>
        app detail
      </div>
    )
  }
}

export default ApplicationDetail;