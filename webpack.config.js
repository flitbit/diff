module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'deep-diff.min.js'
  }
};
