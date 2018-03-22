export const menus = [
  {key: '/dashboard', title: '概览', icon: 'home', auth: 'OVERVIEW'},
  {
    key: '/appManage', title: '应用管理', icon: 'appstore', auth: ['APP-LIST'], 
    children: [
      {key: '/appManage/application', title: '应用', icon: 'user', auth: 'APP-LIST'},
    ]
  },
  {key: '/operationManage', title: '运维管理', icon: 'user', auth: ['APPLOG-LIST', 'INGRESSLOG-LIST', 'APPMONITOR-LIST', 'INGRESSMONITOR-LIST'],
    children: [
      {key: '/operationManage/log', title: '日志', icon: 'user', auth: ['APPLOG-LIST', 'INGRESSLOG-LIST'],
        children: [
          {key: '/operationManage/log/app', title: '应用日志', icon: 'user', auth: 'APPLOG-LIST'},
          {key: '/operationManage/log/ingress', title: '负载均衡器日志', icon: 'user', auth: 'INGRESSLOG-LIST'},
        ]
      },
      {key: '/operationManage/monitor', title: '监控', icon: 'user', auth: ['APPMONITOR-LIST', 'INGRESSMONITOR-LIST'],
        children: [
          {key: '/operationManage/monitor/app', title: '应用监控', icon: 'user', auth: 'APPMONITOR-LIST'},
          {key: '/operationManage/monitor/ingress', title: '负载均衡器监控', icon: 'user', auth: 'INGRESSMONITOR-LIST'},
        ]
      },
    ]
  },
]