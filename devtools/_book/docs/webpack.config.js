const path = require('path');

module.exports = {
  entry: './static/js/entry.js',
  output: {
    path: path.join(__dirname, 'static/js'),
    filename: 'bundle.js',
    library: 'devtools'
  },
  resolve: {
    root: path.join(__dirname, '../..')
  }
}
