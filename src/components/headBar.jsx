import React from 'react';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import cookie from 'js-cookie';

const { Header } = Layout;


class HeadBar extends React.Component {
  render() {
    const username = cookie.get('username');
    const userMenu = (
      <Menu onClick={this.props.logout}>
        <Menu.Item key="1">用户中心</Menu.Item>
        <Menu.Item key="2">注销</Menu.Item>
      </Menu>
    );

    return (
      <Header style={{ backgroundColor: '#fff', padding: 0 }}>
        <Icon className="trigger"
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle} />
        <div className="user">
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon="user" />
          <Dropdown overlay={userMenu}>
            <a>
              <span style={{ marginRight: '10px' }}>{username}</span>
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
    )
  }
}

export default HeadBar;