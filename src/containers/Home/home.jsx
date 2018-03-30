import React  from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cookie from 'js-cookie';
import { Layout, Menu, Breadcrumb, Spin } from 'antd';

import Login from 'Containers/Login/login';
import HeadBar from 'Components/headBar';
import SideBar from 'Components/sideBar';
import { setNamespace } from 'Actions/homeAction';
import './home.scss'

const { Content } = Layout;

function mapStateToProps (state) {
  const { home } = state;
  return { home }
}

function mapDispatchToProps (dispatch) {
  return {
    changeNs: (ns) => {
      dispatch(setNamespace(ns));
    }
  }
}

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      collapsed: false,
      username: cookie.get('username')
    }
  }

  renderBC = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || route.noHref) ? <span>{route.breadcrumbName}</span> : <Link to={'/' + paths.join('/')}>{route.breadcrumbName}</Link>;
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  logout = ({key}) => {
    if (key === "logout") {
      cookie.remove('token');
      this.props.router.push('/login');
    }
  }

  handleNs = ({key}) => {
    if (this.props.namespace === key) {
      return;
    }
    cookie.set('namespace', key);
    this.props.changeNs(key);
  }
  

  render () {
    return (
      <Spin spinning={this.props.home.isFetching}>
        <Layout style={{ height:'100%' }}>
          <SideBar collapsed={this.state.collapsed} />
          <Layout>
            <HeadBar
              collapsed={this.state.collapsed}
              toggle={this.toggle}
              username={this.state.username}
              logout={this.logout}
              namespaceArr={this.props.home.namespaceArr}
              namespace={this.props.home.namespace}
              changeNs={this.handleNs}
            />
            <Content className="app-container">
              <Breadcrumb routes={this.props.routes} itemRender={this.renderBC} />
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
      </Spin>
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);