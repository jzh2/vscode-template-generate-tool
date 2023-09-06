const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  productionSourceMap: false,
  publicPath: '',
  pages: {
    index: 'src/main.js',
    'star-website': 'src/views/star-website/main.js'
  },
  devServer: {
    proxy: {
      '/oauth/2.0/token': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true
      },
      '/rest/2.0/ocr': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true
      },
      '/api/trans': {
        target: 'http://api.fanyi.baidu.com',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts']
    }
  }
})
