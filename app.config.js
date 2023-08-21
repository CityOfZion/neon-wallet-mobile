module.exports = {
  expo: {
    name: 'Neon',
    slug: 'neon',
    version: '1.2.5',
    orientation: 'portrait',
    android: {
      package: 'io.cityofzion.neon',
      versionCode: 1256,
      adaptiveIcon: { foregroundImage: 'src/assets/ic_launcher_foreground.png', backgroundColor: '#1f2b2d' },
      googleServicesFile: './google-services.json',
    },
    ios: {
      buildNumber: "9",
      infoPlist: {
        NSFaceIDUsageDescription:
          'This app uses face ID to authenticate the user when dealing with sensitive transactions.',
        requireFullScreen: true,
      },
      bundleIdentifier: 'io.cityofzion.neon',
      googleServicesFile: './GoogleService-Info.plist',
    },
    splash: { image: 'src/assets/splash-darker.png', resizeMode: 'cover', backgroundColor: '#1f2830' },
    icon: 'src/assets/ic_launcher.png',
    primaryColor: '#4cffb3',
    assetBundlePatterns: ['**/*'],
    packagerOpts: {
      config: 'metro.config.js',
      sourceExts: ['expo.ts', 'expo.tsx', 'expo.js', 'expo.jsx', 'ts', 'tsx', 'js', 'jsx', 'json', 'wasm', 'svg'],
    },
    web: {
      config: {
        firebase: {
          apiKey: 'AIzaSyC6x5g6ng7oGxPmCpKxZJ9xFeurMp-Th3I',
          measurementId: 'G-HC3YF0FT0J',
          authDomain: 'neon-wallet-2ec5d.firebaseapp.com',
          appId: '1:209775750653:web:7f2744867295dfd8c17d94',
          messagingSenderId: '209775750653',
          databaseURL: 'https://neon-wallet-2ec5d.firebaseio.com',
          projectId: 'neon-wallet-2ec5d',
          storageBucket: 'neon-wallet-2ec5d.appspot.com',
        },
      },
    },
    owner: 'endkeycodersimpli',
    ...(process.env.MODE !== "dev" ? {
      extra: {
        eas: {
          projectId: "e3527b9c-81e6-4b6b-a770-342d8b0a96bb"
        }
      },
      updates: {
        url: "https://u.expo.dev/e3527b9c-81e6-4b6b-a770-342d8b0a96bb",
        requestHeaders: {
          "expo-channel": "preview",
        }
      },
      runtimeVersion: "1.0.0"
    } : {}),
    "plugins": ["expo-splash-screen"]
  },
}
