module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  skipLegacyWorkersInjection: true,
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type:  'iPhone 14'
      }
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_6_API_31"
      }
    }
  },
  apps: {
    "android.release": {
      type: "android.apk",
      binaryPath: "./android/app/build/outputs/apk/release/app-release.apk",
      build: "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release  && cd .."
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/neon.app',
      build: 'yarn build:ios && cd ios && pod install && cd .. && xcodebuild -workspace ./ios/Neon.xcworkspace -scheme Neon-release archive -archivePath ./Neon.xcarchive'
    },
  },
  configurations: {
    "android.emu.release": {
      device: "emulator",
      app: "android.release"
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    }
  }
}