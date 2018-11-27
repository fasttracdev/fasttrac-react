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
          }
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
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
      src: path.resolve(__dirname, 'src')
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