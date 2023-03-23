import { NativeModules } from 'react-native'
import { wallet as walletNeo3 } from '@cityofzion/neon-js'
import {wallet as walletNeoLegacy} from '@cityofzion/neo-legacy-neon-js'
const { RNNeoSdkBindings } = NativeModules

async function decryptNep2JS(key, password) {
    alert('Using javascript to decrypt!')
    return await walletNeo3.decrypt(key, password)
}

async function decryptNep2LegacyJS(key, password) {
    alert('Using javascript to decrypt!')
    return await walletNeoLegacy.decrypt(key, password)
}

export async function decryptNep2Android(key, password) {
    const wif = RNNeoSdkBindings ? await RNNeoSdkBindings.decryptNep2(key, password) : decryptNep2JS(key, password)
    return wif
}

export async function decryptNep2IOS(key, password, callback) {
    if (RNNeoSdkBindings) {
        return RNNeoSdkBindings.decryptNep2(key, password, callback)
    }
    const wif = await decryptNep2JS(key, password)
    callback(wif)
}

export async function decryptNep2LegacyAndroid(key, password) {
    const wif = RNNeoSdkBindings ? await RNNeoSdkBindings.decryptNep2Legacy(key, password) : decryptNep2LegacyJS(key, password)
    return wif
}

export async function decryptNep2LegacyIOS(key, password, callback) {
    if (RNNeoSdkBindings) {
        return RNNeoSdkBindings.decryptNep2Legacy(key, password, callback)
    }
    const wif = await decryptNep2LegacyJS(key, password)
    callback(wif)
}

export async function Base58DecodeAndroid(key){
    if(RNNeoSdkBindings){
        return await RNNeoSdkBindings.Base58Decode(key)
    }
    throw "Need be executed on devices or native module"
}
