import React  from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cookie from 'js-cookie';
import { Layout, Menu, Breadcrumb } from 'antd';

import Routes from '../../routes';
import Login from 'Containers/Login/login';
import HeadBar from 'Components/headBar';
import SideBar from 'Components/sideBar';
import { logout } from 'Actions/authAction';
import './home.scss'

const { Content } = Layout;

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  renderBC = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || route.noHref) ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  logout = ({key}) => {
    if (key === "2") {
      cookie.remove('token');
      this.props.router.push('/login');
      this.props.handleLogout();
    }
  }

  render () {
    const userMenu = (
      <Menu onClick={this.logout}>
        <Menu.Item key="userInfo">用户中心</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ height:'100%' }}>
        <SideBar collapsed={this.state.collapsed} />
        <Layout>
          <HeadBar collapsed={this.state.collapsed} toggle={this.toggle} logout={this.logout} />
          <Content className="app">
            <Breadcrumb routes={this.props.routes} itemRender={this.renderBC} />
            { this.props.children }
          </Content>
        </Layout>
      </Layout>
    )
  };
}

function mapStateToProps (state) {
  const {auth, routing} = state;
  return {
    isLogged: auth.isLogged
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => {
      dispatch(logout());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);