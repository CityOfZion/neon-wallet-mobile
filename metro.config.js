const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname)
  const { transformer, resolver } = config

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  }

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  }

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'buffer') {
      return context.resolveRequest(context, '@craftzdog/react-native-buffer', platform)
    }

    if (moduleName === 'crypto') {
      return context.resolveRequest(context, 'react-native-quick-crypto', platform)
    }

    if (moduleName === 'querystring') {
      return context.resolveRequest(context, 'querystring-es3', platform)
    }

    if (moduleName === 'stream') {
      return context.resolveRequest(context, 'readable-stream', platform)
    }

    return context.resolveRequest(context, moduleName, platform)
  }

  return withNativeWind(config, { input: './src/styles/global.css', inlineRem: 16 })
})()
