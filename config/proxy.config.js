module.exports = {
  proxy: {
    '/apis/cmss.com/**': {
      target: "http://10.139.15.14:32045/apis/cmss.com/",
      pathRewrite: {
        '^/apis/cmss.com/': ''
      },
      secure: false,
      changeOrigin: true
    }
  }
}