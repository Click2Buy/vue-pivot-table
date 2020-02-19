const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const baseConfig = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader'
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'vue-style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer')
              ]
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

module.exports = env => {
  if (!env) {
    const devConfig = {
      mode: 'development',
      entry: './demo/main.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
      devServer: {
        hot: true,
        open: true,
        overlay: {
          warnings: false,
          errors: true
        },
        quiet: true
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'index.html',
          inject: true
        }),
        new FriendlyErrorsPlugin()
      ]
    }

    return merge(baseConfig, devConfig)
  } else {
    if (!env.browser) {
      const prodConfig = {
        mode: 'production',
        entry: './src/Pivot.vue',
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: 'vue-pivot-table.js',
          libraryTarget: 'umd'
        }
      }
    
      return merge(baseConfig, prodConfig)
    } else {
      const prodBrowserConfig = {
        mode: 'production',
        entry: './src/browser.js',
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: 'vue-pivot-table.browser.js',
          libraryTarget: 'window',
          library: 'VuePivot'
        }
      }
    
      return merge(baseConfig, prodBrowserConfig)
    }
  }
}