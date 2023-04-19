require('dotenv').config()
const {ANDROID_EMULATOR, IOS_SIMULATOR} = process.env
module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  skipLegacyWorkersInjection: true,
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type:  IOS_SIMULATOR
      }
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: ANDROID_EMULATOR
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
      build: 'xcodebuild -workspace ios/Neon.xcworkspace -configuration Release -scheme Neon-release -sdk iphonesimulator -derivedDataPath ios/build'
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