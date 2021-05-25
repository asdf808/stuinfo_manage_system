const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 去掉注释
// const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 开启压缩
// const { HashedModuleIdsPlugin } = require('webpack');

// const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: { '^/api': '' }
      }
    }
  },
  // lintOnSave: false,
  // publicPath: './',
  // assetsDir: 'assets',
  // productionSourceMap: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/globalColor.less')]
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true
        },
        javascriptEnabled: true
      }
    }
  }
};
