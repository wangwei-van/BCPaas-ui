import React from 'react';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';

const { Header } = Layout;


class HeadBar extends React.Component {
  render() {
    const namespaceArr = this.props.namespaceArr;

    const namespaceMenu = (
      <Menu onClick={this.props.changeNs}>
        {
          namespaceArr.map((ns) => (
            <Menu.Item key={ns}>{ns}</Menu.Item>
          ))
        }
      </Menu>
    );

    const userMenu = (
      <Menu onClick={this.props.logout}>
        <Menu.Item key="userInfo">用户中心</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    );

    return (
      <Header style={{ backgroundColor: '#fff', padding: 0 }}>
        <Icon className="trigger"
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle} />

        <Dropdown trigger={['click']} overlay={namespaceMenu}>
          <a>
            <span>{this.props.namespace}</span>
            <Icon type="down" />
          </a>
        </Dropdown>

        <div className="user">
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon="user" />
          <Dropdown trigger={['click']} overlay={userMenu}>
            <a>
              <span style={{ marginRight: '10px' }}>{this.props.username}</span>
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
    )
  }
}

export default HeadBar;