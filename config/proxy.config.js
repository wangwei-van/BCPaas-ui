module.exports = {
  proxy: {
    '/apis/cmss.com/**': {
      target: "http://10.139.15.14:32045/apis/cmss.com/",
      pathRewrite: {
        '^/apis/cmss.com/': ''
      },
      secure: false,
      changeOrigin: true
    },
    '/conductor/api/v1/**': {
      target: "http://10.139.15.14:30499/api/v1/",
      pathRewrite: {
        '^/conductor/api/v1/': ''
      },
      secure: false,
      changeOrigin: true
    }
  }
}