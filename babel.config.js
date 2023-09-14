module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~': './',
            '~src': './src/',
            'crypto': './node_modules/crypto-browserify',
            'node:crypto': './node_modules/crypto-browserify',
            '_stream_transform': './node_modules/readable-stream/transform',
            "_stream_transform": "./node_modules/readable-stream/transform",
            "_stream_readable": "./node_modules/readable-stream/readable",
            "_stream_writable": "./node_modules/readable-stream/writable",
            "_stream_duplex": "./node_modules/readable-stream/duplex",
            "_stream_passthrough": "./node_modules/readable-stream/passthrough",
            "stream": "./node_modules/stream-browserify",
            "net": "./node_modules/react-native-tcp",
            "zlib": "./node_modules/browserify-zlib",
            "http": "./node_modules/@tradle/react-native-http",
            "https": "./node_modules/https-browserify"
          },
        },
      ],
      'react-native-reanimated/plugin',
      "@babel/plugin-proposal-async-generator-functions"
    ],
  }
}
