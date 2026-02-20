import type { ConfigContext, ExpoConfig } from 'expo/config'

import pkg from './package.json'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: pkg.name.at(0)?.toUpperCase() + pkg.name.slice(1),
  slug: pkg.name,
  version: pkg.version,
  orientation: 'portrait',
  owner: 'cityofzion.io',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  primaryColor: '#4CFFB3',
  newArchEnabled: true,
  jsEngine: 'hermes',
  platforms: ['ios', 'android'],
  scheme: ['neon', 'neon3', 'wc'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'io.cityofzion.neon',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    allowBackup: false,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1f2b2d',
    },
    softwareKeyboardLayoutMode: 'resize',
    package: 'io.cityofzion.neon',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.NFC',
    ],
  },
  splash: {
    backgroundColor: '#1A2026',
  },
  extra: {
    eas: {
      projectId: '8fd4811a-e4b2-4657-a66f-ab6f91af9880',
    },
  },
  runtimeVersion: {
    policy: 'fingerprint',
  },
  updates: {
    url: 'https://u.expo.dev/8fd4811a-e4b2-4657-a66f-ab6f91af9880',
    checkAutomatically: 'NEVER',
  },
  plugins: [
    [
      'expo-font',
      {
        fonts: [
          './src/assets/fonts/sofiapro-bold.otf',
          './src/assets/fonts/sofiapro-medium.otf',
          './src/assets/fonts/sofiapro-regular.otf',
          './src/assets/fonts/sofiapro-regularitalic.otf',
          './src/assets/fonts/sofiapro-semibold.otf',
          './src/assets/fonts/sofiapro-light.otf',
        ],
      },
    ],
    'expo-secure-store',
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission:
          'Allowing $(PRODUCT_NAME) to access your camera will let you quickly and securely scan QR codes containing wallet keys or Connection URIs',
        recordAudioAndroid: false,
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#1A2026',
        image: './assets/icon.png',
      },
    ],
    [
      '@sfourdrinier/react-native-ble-plx',
      {
        bluetoothAlwaysPermission:
          'Giving $(PRODUCT_NAME) access to bluetooth will allow you to connect to hardware wallets',
      },
    ],
    './plugins/withUsb',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#4CFFB3',
      },
    ],
    [
      'react-native-nfc-manager',
      {
        nfcPermission: 'Giving $(PRODUCT_NAME) access to NFC will allow you to connect to NFIs',
        includeNdefEntitlement: false,
        selectIdentifiers: ['D2760000850100', 'D2760000850101'],
      },
    ],
    [
      'expo-media-library',
      {
        savePhotosPermission: 'Giving $(PRODUCT_NAME) access to save photos will allow you to save QR codes.',
        preventAutomaticLimitedAccessAlert: true,
        granularPermissions: ['photo'],
      },
    ],
  ],
})
