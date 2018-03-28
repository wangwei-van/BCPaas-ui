import request from 'Util/request';

const baseUrl = '/conductor/api/v1';
const baseRawUrl = '/conductor/api/v1/_raw';

export default {
  // admin用户获取根目录'/'下的子应用组
  getRootAppGroups: (namespace) => {
    return request(baseUrl + '/app/namespace/' + namespace, {method: 'GET'})
  },

  // 用户获取某个目录下的子应用组
  getChildAppGroups: (namespace, user, group, admin) => {
    let params = {
      'app-group': group
    }
    if (admin) {
      params.role = 'admin';
    }
    return request(baseUrl + '/app/namespace/' + namespace + '/user/' + user, {
      method: 'GET',
      body: params
    });
  },

  getContainedAppGroups: (namespace, user, group, admin) => {
    let params = {
      'app-group': group
    }
    if (admin) {
      params.role = 'admin';
    }
    return request(baseUrl + '/app/namespace/' + namespace + '/user/' + user + '/fuzzy', {
      method: 'GET',
      body: params
    });
  },

  createAppGroup: (namespace, user, data) => {
    return $http(baseUrl + '/app/namespace/' + namespace + '/user/' + user, {
      method: 'POST',
      body: data
    })
  },

  editAppGroup: (namespace, user, data) => {
    return request(baseUrl + '/app/namespace/' + namespace + '/user/' + user, {
      method: 'PUT',
      body: data
    });
  },

  batchEditAppGroup: (namespace, user, data) => {
    return request(baseUrl + '/app/namespace/' + namespace + '/user/' + user + '/fuzzy', {
      method: 'PUT',
      body: data
    });
  },

  deleteAppGroup: (namespace, user, group, admin) => {
    let params = {
      'app-group': group,
      force: true
    }
    if (admin) {
      params.role = 'admin';
    }
    return request(baseUrl + '/app/namespace/' + namespace + '/user/' + user + '/fuzzy', {
      method: 'DELETE',
      body: params
    });
  },


  getAllApps: () => {
    return request(baseUrl + "/workload", {method: 'GET'});
  },
  getApps: (namespace, flag) => {
    let url = baseUrl + "/workload/" + namespace;
    if (flag) {
      url += '?metrics=true';
    }
    return request(url, {method: 'GET'});
  },

  getAllCronJobs: () => {
    return request(baseUrl + "/cronjob", {method: 'GET'});
  },

  getCronJobApps: (namespace) => {
    return request(baseUrl + "/cronjob/" + namespace, {method: 'GET'});
  },

  // 获取原生数据格式，方便进行编辑更新
  editApp: (namespace, name, kind) => {
    return request(baseRawUrl + '/' + kind + "/namespace/" + namespace + "/name/" + name, {method: 'GET'});
  },

  // 更新
  updateApp: (app) => {
    return request(baseRawUrl + '/' + app.kind.toLowerCase() + '/namespace/' + app.metadata.namespace + '/name/' + app.metadata.name, {
      method: "PUT",
      body: app
    });
  },


  getAppDetail: (namespace, name, kind, flag) => {
    let url = baseUrl + "/" + kind + "/" + namespace + "/" + name;
    if (kind === 'statefulset') {
      url = baseUrl + "/" + kind + "/" + namespace;
    }
    if (flag) {
      url += '?metrics=true';
    }
    return request(url, {method: 'GET'});
  },

  validateAppName: (name, namespace, kind) => {
    return request(baseUrl + '/appdeployment/validate/name', {
      method: 'POST',
      body: {
        name: name, namespace: namespace, kind: kind
      }
    });
  },

  getCsrfToken: () => {
    return request(baseUrl + '/csrftoken/appdeploymentfromfile', {method: 'GET'});
  },

  createApp: (data, token) => {
    return request(baseUrl + '/appdeploymentfromfile', {
      method: "POST",
      headers: {
        'X-CSRF-TOKEN': token
      },
      body: {
        content: JSON.stringify(data)
      }
    })
  },

  batchEditApp: (data, token) => {
    return request(baseUrl + '/appdeploymentfromfile', {
      method: "PUT",
      headers: {
        'X-CSRF-TOKEN': token
      },
      body: {
        content: JSON.stringify(data)
      }
    })
  },

  createStatefulSetApp: (namespace, data) => {
    return request(baseRawUrl + '/statefulset/namespace/' + namespace, {
      method: 'POST',
      data: data
    })
  },

  deleteApp: (namespace, name, kind) => {
    return request(baseRawUrl + "/" + kind + "/namespace/" + namespace + "/name/" + name, {
      method: "DELETE"
    });
  },

  getReplicasets: (namespace) => {
    return request(baseUrl + '/replicaset/' + namespace, {method: 'GET'});
  },

  deleteReplicaset: (namespace, name) => {
    return request(baseRawUrl + "/replicaset/namespace/" + namespace + "/name/" + name + '?orphanDependents=false', {
      method: "DELETE"
    });
  },

}