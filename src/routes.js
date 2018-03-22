import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import cookie from 'js-cookie';

import Login from 'Containers/Login/login';
import Home from 'Containers/Home/home';
import Application from 'Containers/Application/application';
import AppLog from 'Containers/Log/appLog';
import IngressLog from 'Containers/Log/ingressLog';
import AppMonitor from 'Containers/Monitor/appMonitor';
import IngressMonitor from 'Containers/Monitor/ingressMonitor';

import Dashboard from 'Components/Dashboard';
import Wrapper from 'Components/wrapper';

const checkAuth = (nextState, replaceState) => {
  if (!cookie.get('token')) {
    replaceState('/login');
  }
}

class Routes extends React.Component {
  render () {
    return (
      <Router history={this.props.history}>
        <Route path="/login" component={Login} />
        <Route noHref breadcrumbName="主页" path="/" component={Home} onEnter={checkAuth}>
          <IndexRoute noHref breadcrumbName="概览" component={Dashboard} />
          <Route noHref breadcrumbName="概览" path="/dashboard" component={Dashboard} />
          <Route noHref breadcrumbName="应用管理" path="/appManage" component={Wrapper}>
            <Route breadcrumbName="应用" path="application" component={Application} />
          </Route>
          <Route noHref breadcrumbName="运维管理" path="/operationManage" component={Wrapper}>
            <Route noHref breadcrumbName="日志管理" path="log" component={Wrapper}>
              <Route breadcrumbName="应用日志" path="app" component={AppLog} />
              <Route breadcrumbName="ingress日志" path="ingress" component={IngressLog} />
            </Route>
            <Route noHref breadcrumbName="监控管理" path="monitor" component={Wrapper}>
              <Route breadcrumbName="应用监控" path="app" component={AppMonitor} />
              <Route breadcrumbName="ingress监控" path="ingress" component={IngressMonitor} />
            </Route>
          </Route>
        </Route>
      </Router>
    )
  }
}

export default Routes;