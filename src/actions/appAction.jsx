import request from 'Util/request';
import cookie from 'js-cookie';

import appService from '../services/appService';
import serviceService from '../services/serviceService';

const isAdmin = cookie.get('admin') === 'true';
const username = cookie.get('username');

const getAppAddr = (services, app) => {
  app.internalAddr = [], app.nodePort = [];

  services.forEach(function (service) {
    var selector = service.selector;
    var flag = true;
    for (var key in app.objectMeta.labels) {
      if (!selector || !selector[key] || selector[key] !== app.objectMeta.labels[key]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      service.internalEndpoint.ports.forEach(function (port) {
        app.internalAddr.push(service.clusterIP + ':' + port.port);
        if (service.type === 'NodePort') {
          app.nodePort.push(port.nodePort);
        }
      })
    }
  });
}

const getAppStatus = (app) => {
  app.runningStatus = 'failed';
  if (app.pods.failed > 0) {
    app.runningStatus = 'failed';
  } else if (app.pods.pending > 0) {
    app.runningStatus = 'pending';
  } else if (app.pods.running > 0 || app.pods.succeeded > 0) {
    app.runningStatus = 'running';
  }

  if (app.pods.running >= app.pods.desired) {
    app.runningStatus = 'running';
  }
  if (app.pods.running == 0 && app.pods.desired == 0) {
    app.runningStatus = 'pending';
  }

  if (app.pods.desired > 0 && app.pods.running == 0 && app.pods.pending == 0 && app.pods.succeeded == 0 && app.pods.failed == 0) {
    var failedCount = 1;
  } else {
    var failedCount = app.pods.failed;
  }

  app.statusMap = {
    running: (app.pods.running + app.pods.succeeded) || 0,
    pending: app.pods.pending || 0,
    failed: failedCount
  }
}

const getAppResource = (app) => {
  let cpuUsage = 0, memoryUsage = 0;
  app.podList.pods.forEach(function (pod) {
    if (pod.metrics) {
      cpuUsage += pod.metrics.cpuUsage;
      memoryUsage += pod.metrics.memoryUsage;
    }
  });
  app.cpuUsage = cpuUsage / 1000;
  app.memoryUsage = memoryUsage / 1024 / 1024;

  let podLength = app.podList.pods ? (app.podList.pods.length) : 0;
  app.totalCpu = 0, app.totalMemory = 0;;
  if (app.objectMeta.annotations && app.objectMeta.annotations.cpu) {
    app.totalCpu = parseFloat(app.objectMeta.annotations.cpu) * podLength;
  }
  if (app.objectMeta.annotations && app.objectMeta.annotations.memory) {
    app.totalMemory = parseFloat(app.objectMeta.annotations.memory) * podLength;
  }
}

const formatAppData = (services, apps) => {
  let res = [];

  for (let i=apps.length-1; i>=0; i--) {
    let app = apps[i];
    // let userFilter = !isProjectAdmin && !isAdmin && (!app.objectMeta.labels || app.objectMeta.labels.user != username);
    let userFilter = !isAdmin && (!app.objectMeta.labels || app.objectMeta.labels.user != username);
    let ingressFilter = app.objectMeta.labels && (
      app.objectMeta.labels['nginx-ingress-lb/name'] == 'nginx-ingress-lb' ||
      app.objectMeta.labels['k8s-app'] == 'default-http-backend');
    // 过滤掉定时任务创建的job
    let cronJobPodFilter = (app.typeMeta.kind == 'job') && app.objectMeta.annotations && app.objectMeta.annotations['kubernetes.io/created-by'];

    if (ingressFilter || cronJobPodFilter) {
      continue
    } else {
      getAppAddr(services, app);
      getAppStatus(app);
      getAppResource(app);
      res.unshift(app);
    }
  }
  return res;
}

const baseUrl = "/conductor/api/v1";

export const getAppList = (namespace) => {
  return {
    type: 'REQUESTAPPS',
    payload: serviceService.getServices(namespace).then(async function (serviceList) {
      let services = serviceList.services;
      let appList = await appService.getApps(namespace, true);
      let cronJobAppList = await appService.getCronJobApps(namespace);

      let apps = [].concat(appList.deploymentList.deployments, appList.statefulSetList.statefulSets, appList.daemonSetList.daemonSets, cronJobAppList.cronJobs);

      return { apps: formatAppData(services, apps) }
    })
  } 
}