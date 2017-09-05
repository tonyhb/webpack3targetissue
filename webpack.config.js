const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const configs = {
  'process.env': {
    NODE_ENV: JSON.stringify(env),
    // config.PORT is the port in which server-side rendering process listens
    PORT: process.env.PORT || 3000,
  }
};


const common = {
  devtool: isProd ? 'hidden-source-map' : 'eval',
  context: __dirname,
  output: {
    path: path.join(__dirname, './static/assets/'),
    publicPath: '/static/',
    filename: '[name].js',
  },

  // devServer allows us to run webpack-dev-server with real, in place hot
  // module reloading.
  //
  // HOST env variable:
  // If you're running inside a virtual machine set the HOST environment
  // variable to the IP of your VM.
  devServer: {
    hot: true,
    host: "0.0.0.0",
    allowedHosts: [process.env.HOST],
    contentBase: './static/',
    publicPath: `https://${process.env.HOST}:8080/static/`,
    historyApiFallback: true,
    stats: {
      assets: false,
      chunks: false,
      colors: false,
      modules: false, // hides JS and CSS info
    },
  },

  module: {
    rules: [
      // preloader so we bail fast with syntax errors
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["eslint-loader"],
      },
      // JS should be the first loader for dev-server.js
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: isProd ? 'babel-loader' : 'babel-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      // everything in `src` should overwrite node_modules repos
      path.resolve('./src'),
      'node_modules'
    ]
  }
};

const server = Object.assign({}, common, {
  entry: {
    server: ['./src/entry.server.js'],
  },
  target: 'node',
});

const client = Object.assign({}, common, {
  entry: {
    client: ['./src/entry.client.js'],
  },
  target: 'web',
});

module.exports = [server, client];
