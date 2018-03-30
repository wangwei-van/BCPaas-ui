import React from 'react';
import {Router, Route, IndexRoute, Redirect} from 'react-router';
import cookie from 'js-cookie';

import store from 'Store';
import { getAuthRule } from 'Actions/homeAction';

import api from 'Constants/api';

import Login from 'Containers/Login/login';
import Home from 'Containers/Home/home';
import Application from 'Containers/Application/application';
import AppDetail from 'Containers/Application/applicationDetail';
import AppLog from 'Containers/Log/appLog';
import IngressLog from 'Containers/Log/ingressLog';
import AppMonitor from 'Containers/Monitor/appMonitor';
import IngressMonitor from 'Containers/Monitor/ingressMonitor';

import Dashboard from 'Components/Dashboard';
import Unknown from 'Components/unknown';
import Wrapper from 'Components/wrapper';

// 保证刷新页面获取权限后再进入页面
const loadAuth = (nextState, replaceState, next) => {
  if (!cookie.get('token')) {
    replaceState('/login');
    next();
    return;
  }
  let unsubscribe;
  const onStateChanged = () => {
    const state = store.getState();
    if (state.home.authRequired) {
      unsubscribe();
      next();
    }
  }
  unsubscribe = store.subscribe(onStateChanged);
  store.dispatch(getAuthRule());
}

const checkAuth = (nextState, replaceState) => {
  if (!cookie.get('token')) {
    replaceState('/login');
    return;
  }
  let pathname = '';
  nextState.routes.map((route, idx) => {
    idx!==0 && (pathname += `/${route.path}`);
  })

  var emit = false;
  for (var i=0,len=api.emitRoutes.length; i<len; i++) {
    if (pathname.indexOf(api.emitRoutes[i]) >= 0) {
      emit = true;
    }
  }

  if (!emit && api.allowedRoutes.indexOf(pathname) === -1) {
    replaceState('/unknown');
  }
}

class Routes extends React.Component {
  render () {
    return (
      <Router history={this.props.history}>
        <Route path="/login" component={Login} />
        <Route noHref breadcrumbName="主页" path="/" component={Home} onEnter={loadAuth}>
          <IndexRoute noHref breadcrumbName="概览" component={Dashboard} />
          <Route breadcrumbName="概览" path="dashboard" component={Dashboard} onEnter={checkAuth} />
          <Route noHref breadcrumbName="应用管理" path="appManage" component={Wrapper}>
            <Route breadcrumbName="应用" path="application" component={Application} onEnter={checkAuth}>
              <Route breadcrumbName="详情" path=":name" component={AppDetail} onEnter={checkAuth} />
            </Route>
          </Route>
          <Route noHref breadcrumbName="运维管理" path="operationManage" component={Wrapper}>
            <Route noHref breadcrumbName="日志管理" path="log" component={Wrapper}>
              <Route breadcrumbName="应用日志" path="app" component={AppLog} onEnter={checkAuth} />
              <Route breadcrumbName="ingress日志" path="ingress" component={IngressLog} onEnter={checkAuth} />
            </Route>
            <Route noHref breadcrumbName="监控管理" path="monitor" component={Wrapper}>
              <Route breadcrumbName="应用监控" path="app" component={AppMonitor} onEnter={checkAuth} />
              <Route breadcrumbName="ingress监控" path="ingress" component={IngressMonitor} onEnter={checkAuth} />
            </Route>
          </Route>
          <Route breadcrumbName="页面错误" path="*" component={Unknown} />
        </Route>
      </Router>
    )
  }
}

export default Routes;