import { NativeModules } from 'react-native'
import { Platform } from 'react-native'
const { RNNeoSdkBindings, getWifWithKeyAndPasspharase, } = NativeModules

let NativeFunc;

if (Platform.OS === 'ios') {
    NativeFunc = getWifWithKeyAndPasspharase
} else {
    NativeFunc = RNNeoSdkBindings
}

export default NativeFunc
