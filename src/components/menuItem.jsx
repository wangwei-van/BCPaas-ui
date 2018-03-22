import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';
import { util } from 'Util/util';

const isMenuItemAuth = (permission, auth) => {
  if (!util.isString(auth)) {
    return true;
  }
  return permission.indexOf(auth) !== -1;
}

const isSubMenuAuth = (permission, auth) => {
  if (!util.isArray(auth)) {
    return true;
  }
  for (let i=0,len=auth.length; i<len; i++) {
    if (permission.indexOf(auth[i]) !== -1) {
      return true;
    }
  }
  return false;
}

const renderMenuItem = ({key, title, icon, auth, ...props}, permission) => {
  if (isMenuItemAuth(permission, auth)) {
    return (
      <Menu.Item key={key} {...props}>
        <Link to={key}>
          {icon && <Icon type={icon} />}
          <span className="nav-text">{title}</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return null;
  }
}

const renderSubMenu = ({key, title, icon, auth, children, ...props}, permission) => {
  if (isSubMenuAuth(permission, auth)) {
    return (
      <Menu.SubMenu key={key}
        title={
          <span>
            {icon && <Icon type={icon} />}
            <span className="nav-text">{title}</span>
          </span>
        }
        {...props}
      >
        {children && children.map(
          item => {
            return item.children && item.children.length ? renderSubMenu(item, permission) : renderMenuItem(item, permission);
          }
        )}
      </Menu.SubMenu>
    )
  } else {
    return null;
  }
}

class MenuItem extends React.Component {
  render () {
    const {menus, permission, ...props} = this.props;
    return (
      <Menu {...props}>
        {
          menus && menus.map(
            item => {
              return item.children && item.children.length ? renderSubMenu(item, permission) : renderMenuItem(item, permission);
            }
          )
        }
      </Menu>
    )
  }
}

export default MenuItem;