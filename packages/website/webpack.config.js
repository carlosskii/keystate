const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanTerminalPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  stats: "errors-warnings"
};