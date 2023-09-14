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
          },
        },
      ],
      'react-native-reanimated/plugin',
      "@babel/plugin-proposal-async-generator-functions"
    ],
  }
}
