const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

let isProdMode = false

let baseConfig = {
  entry: {
    app: ['./src/index.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: true
            }
          },
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, 'scss/_variables.scss'),
                path.resolve(__dirname, 'scss/mixins.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      { test: /\.(png|jpg|jpeg|gif|woff|svg)$/, use: 'url-loader?limit=8192' },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'assets'),
      common: path.resolve(__dirname, 'src/common'),
      utilities: path.resolve(__dirname, 'src/common/utilities'),
      '@console': path.resolve(__dirname, 'src/console'),
      '@groups': path.resolve(__dirname, 'src/groups'),
      '@ListingExperience': path.resolve(__dirname, 'src/ListingExperience'),
      '@local-insights': path.resolve(__dirname, 'src/local-insights')
    }
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    publicPath: '/',
    path: __dirname + '/dist'
  },
  plugins: [
    new Dotenv({
      path: path.resolve(
        __dirname,
        `env/.${process.env.NODE_ENV || 'development'}`
      )
    })
  ]
}

const devConfig = merge(baseConfig, {
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'templates/dev.html')
    }),
    new CaseSensitivePathsPlugin()
  ]
})

const prodConfig = merge(baseConfig, {
  devtool: 'hidden-source-map',
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'templates/prod.html')
    }),
    new CaseSensitivePathsPlugin()
  ]
})

if (!isProdMode) {
  module.exports = devConfig
} else {
  module.exports = prodConfig
}
