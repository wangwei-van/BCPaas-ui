import React from 'react';
import { Layout } from 'antd';

import MenuItem from 'Components/menuItem';
import { menus } from 'Constants/menu';
import { permission } from 'Constants/permission';
const { Sider } = Layout;

class SideBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedKeys: '',
      openKeys: [] 
    }
  }

  componentDidMount () {
    this.initMenuKeys();
  }

  initMenuKeys = () => {
    let pathname = window.location.pathname.replace(/^\//, ''),
      arr = pathname.split('/'), openKeys, selectedKeys;
    // 假定最多三级导航
    if (arr.length > 2) {
      openKeys = [['', arr[0]].join('/'), ['', arr[0], arr[1]].join('/')];
      selectedKeys = ['', arr[0], arr[1], arr[2]].join('/');
    } else if (arr.length > 1) {
      openKeys = [['', arr[0]].join('/')];
      selectedKeys = ['', arr[0], arr[1]].join('/');
    } else {
      openKeys = [['', arr[0]].join('/')];
      selectedKeys = ['', arr[0]].join('/');
    }
    this.setState({openKeys, selectedKeys})
  }

  /* 点击子菜单项 */
  handleClick = (e) => {
    this.setState({
      selectedKeys: e.key,
      openKeys: e.keyPath.reverse().slice(0, e.keyPath.length-1)
    });
  }

  /* 展开/收缩导航栏 */
  handleChange = (keys) => {
    let len = keys.length,
      initKeys = keys.slice(0, len-1).sort(),
      newKey = keys[len-1],
      openKeys;

    // 切换或者关闭一级导航
    if (len === 1 || (newKey && newKey.indexOf(initKeys[0]) === -1 && initKeys[0].indexOf(newKey) === -1)) {
      openKeys = initKeys.slice(1, len-1).concat(newKey);
    // 切换到二级导航
    } else if (len === 0 || len === 2) {
      openKeys = keys;
    }  else if (len === 3) {
      openKeys = initKeys.concat(newKey).filter((item, idx) => idx !== 1);
    }

    this.setState({openKeys});
  }

  render () {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        style={{ overflowY: 'auto' }}
      >
        <div className="logo" />
        <MenuItem
          permission={permission}
          menus={menus}
          theme="dark"
          mode="inline"
          selectedKeys={[this.state.selectedKeys]}
          openKeys={this.state.openKeys}
          onClick={this.handleClick}
          onOpenChange={this.handleChange}
        />
      </Sider>
    )
  }
}

export default SideBar;