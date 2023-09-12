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
          },
        },
      ],
      'react-native-reanimated/plugin',
      "@babel/plugin-proposal-async-generator-functions"
    ],
  }
}
