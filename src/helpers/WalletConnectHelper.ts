import { SessionTypes } from '@walletconnect/types'
import base64 from 'react-native-base64'

import { DefaultMethods } from '~/src/config/walletConnect/constants'

export type SupportedMethods = Exclude<DefaultMethods, 'testInvoke'>

type AccountInformation = {
  namespace: string
  reference: string
  address: string
  chainId: string
}

const SUPPORTED_METHODS: SupportedMethods[] = ['invokeFunction', 'signMessage', 'verifyMessage']

export abstract class WalletConnectHelper {
  static checkSupportedMethods(method: string) {
    return SUPPORTED_METHODS.includes(method as any)
  }

  static getAccountInformationFromSession(session: SessionTypes.Settled): AccountInformation[] {
    const accounts = session.state.accounts.map((account): AccountInformation => {
      const [namespace, reference, address] = account.split(':')

      return {
        address,
        namespace,
        reference,
        chainId: `${namespace}:${reference}`,
      }
    })

    return accounts
  }

  static isValidURI(uri: string) {
    if (uri.startsWith('wc')) {
      return true
    }

    return false
  }

  static checkIsBase64(uri: string) {
    const regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return regexBase64.test(uri)
  }

  static convertBase64ToUri(uri: string) {
    if (WalletConnectHelper.checkIsBase64(uri)) {
      return base64.decode(uri)
    }
    return uri
  }
}
