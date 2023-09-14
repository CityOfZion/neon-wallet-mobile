const { getDefaultConfig } = require('metro-config')

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig()
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraModules: {
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
      }
    },
  }
})()
