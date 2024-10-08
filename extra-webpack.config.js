const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'process': 'process/browser', // Alias para resolver 'process'
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'), // Polyfill para crypto
      vm: require.resolve('vm-browserify'),        // Polyfill para vm
      stream: require.resolve('stream-browserify') // Polyfill para stream
    }
  },
  plugins: [
    // Añade el plugin ProvidePlugin para los polyfills
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};

