import {NativeModules} from 'react-native'

const {RNNeoSdkBindings, CalendarModule} = NativeModules

console.log('print de Native Modules => ', RNNeoSdkBindings)

export default RNNeoSdkBindings
