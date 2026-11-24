/**
 * react-native-quick-crypto's podspec downloads OpenSSL.xcframework (and libsodium when
 * SODIUM_ENABLED=1) into its own package folder during `pod install`. On EAS this happens
 * after the initial fingerprint, changing the package dir hash and causing a runtime
 * version mismatch between local and EAS.
 *
 * @type {import('expo/fingerprint').Config}
 */
const config = {
  ignorePaths: [
    'node_modules/react-native-quick-crypto/OpenSSL.xcframework/**/*',
    'node_modules/react-native-quick-crypto/OpenSSL.xcframework.zip',
    'node_modules/react-native-quick-crypto/ios/**/*',
  ],
}

module.exports = config
