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
      '/oauth': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true
      },
      '/rest': {
        target: 'https://aip.baidubce.com',
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
