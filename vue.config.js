const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  publicPath: process.env.NODE_ENV === 'production'
  ? '/vue-video-player/dist'
  : '/',
  parallel: require('os').cpus().length > 1,
  devServer: {
    open: process.platform === 'darwin',
    host: '',
    port: 8080,
    hotOnly: false,
    disableHostCheck: true,
  },
  configureWebpack: config => {
    config.performance = {
      hints: false,
    };
    config.resolve.alias = {'@': resolve('')};
  },
};
