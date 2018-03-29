import React from 'react';
import {Icon} from 'antd';

export default class extends React.Component {
  render () {
    return (
      <div style={{ position: 'relative' }}>
        <div className="unknown-page">
          <Icon type="frown-o" />
          <span>请求页面未找到</span>
        </div>
      </div>
    )
  }
}