let api = {
  menus: [
    { key: '/dashboard', title: '概览', icon: 'home' },
    {
      key: '/appManage', title: '应用管理', icon: 'appstore', auth: 6,
      children: [
        { key: '/appManage/application', title: '应用', icon: 'user', auth: 6 },
      ]
    },
    {
      key: '/operationManage', title: '运维管理', icon: 'user', auth: [18, 80, 22, 23],
      children: [
        {
          key: '/operationManage/log', title: '日志', icon: 'user', auth: [18, 80],
          children: [
            { key: '/operationManage/log/app', title: '应用日志', icon: 'user', auth: 80 },
            { key: '/operationManage/log/ingress', title: '负载均衡器日志', icon: 'user', auth: 80 },
          ]
        },
        {
          key: '/operationManage/monitor', title: '监控', icon: 'user', auth: [22, 23],
          children: [
            { key: '/operationManage/monitor/app', title: '应用监控', icon: 'user', auth: 22 },
            { key: '/operationManage/monitor/ingress', title: '负载均衡器监控', icon: 'user', auth: 23 },
          ]
        },
      ]
    },
  ],
  'emitRoutes': ['/dashboard'],
  'routeFilter': {
    '查看概况': '/dashboard',
    '查看应用': '/appManage/application',
    '创建应用': '/appManage/application/create',
    '修改应用': '/appManage/application/detail',

    '查看应用日志': '/operationManage/log/app',
    // '查看负载均衡器日志': '/operationManage/log/ingress',

    // '查看应用监控': '/operationManage/monitor/app',
    '查看路由监控': '/operationManage/monitor/ingress',
  },

  namespaceArr: [],
  // 权限项id
  ruleArr: [],
  // 可进入路由路径
  allowedRoutes: []
}

export default api;