import cookie from 'js-cookie';
import store from 'Store';

import api from 'Constants/api';
import namespaceService from 'Services/namespaceService';
import privilegeService from 'Services/privilegeService';

// 获取namespaces、authRules
export const getAuthRule = () => {
  return {
    type: 'GETAUTHRULE',
    payload: new Promise(async (resolve) => {
      let isAdmin = cookie.get('admin') == 'true',
        namespace = cookie.get('namespace') || '',
        namespaceArr = [],
        cluster = 'cluster-1';
      cookie.set('cluster', cluster);

      let username = cookie.get('username'),
        deletedNamespace = cookie.get('deletedNamespace'),
        emitNamespace = ['default', 'kube-public'];
      const namespaceList = isAdmin ? (await namespaceService.getNamespaces()) : (await namespaceService.getUserNamespaces(cluster, username));
      if (isAdmin) {
        namespaceList.items.forEach(function (namespace) {
          let nsName = namespace.metadata.name
          if ((!deletedNamespace || nsName != deletedNamespace) &&
            emitNamespace.indexOf(nsName) < 0) {
            namespaceArr.push(namespace.metadata.name);
          }
        })
      } else {
        namespaceList.forEach(function (namespace) {
          let nsName = JSON.parse(namespace).namespace;
          if ((!deletedNamespace || nsName != deletedNamespace) &&
            JSON.parse(namespace).cluster == cluster &&
            emitNamespace.indexOf(nsName) < 0) {
            namespaceArr.push(nsName);
          }
        });
      }
      /*
       * namespace和namespaceArr 会受后面域管理模块影响，故放在state中
       * 同时方便在header中切换ns时，触发对应主模块重新请求
      */
      store.dispatch(setNamespaceArr(namespaceArr));

      if (namespaceArr.length === 0) {
        namespace = '';
      } else if (namespaceArr.indexOf(namespace) === -1){
        namespace = namespaceArr[0];
      }
      cookie.remove('deletedNamespace');
      cookie.set('namespace', namespace);
      store.dispatch(setNamespace(namespace));


      /**
       * routeFilter 根据名称获取路由路径
       * ruleArr 控制操作按钮
       * routeArr 控制路由
       */
      let ruleList = await privilegeService.getAvailRules(cluster, namespace, username);

      let routeFilter = api.routeFilter,
        ruleArr = [], routeArr = [], projectAdminLabel = false;
      ruleList.forEach(function (rule) {
        ruleArr.push(rule.rule_id);
        if (routeFilter[rule.name]) {
          if (typeof routeFilter[rule.name] === 'string') {
            routeArr.push(routeFilter[rule.name])
          } else {
            routeArr = routeArr.concat(routeFilter[rule.name]);
          }
        }

        (rule.name == '查看域内应用') && (projectAdminLabel = true);
      });

      projectAdminLabel ? cookie.set('projectAdmin', 'true') : cookie.remove('projectAdmin');
      api.ruleArr = ruleArr;
      api.allowedRoutes = routeArr;

      return resolve('');
    })
  }
}

export const setNamespaceArr = (arr) => {
  return {
    type: 'SETNAMESPACEARR',
    payload: arr
  }
}

export const setNamespace = (ns) => {
  return {
    type: 'SETNAMESPACE',
    payload: ns
  }
}