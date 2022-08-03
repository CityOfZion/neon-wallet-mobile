import base64 from 'react-native-base64'

import { Session } from '../contexts/WalletConnectContext'

import { DEFAULT_BLOCKCHAIN, DEFAULT_METHODS } from '~/src/config/walletConnect/constants'

type AccountInformation = {
  namespace: string
  reference: string
  address: string
  chainId: string
}

export abstract class WalletConnectHelper {
  static checkSupportedMethods(method: string) {
    return DEFAULT_METHODS.includes(method as any)
  }

  static getAccountInformationFromSession(session: Session): AccountInformation[] {
    const accounts = session.namespaces[DEFAULT_BLOCKCHAIN].accounts.map((account): AccountInformation => {
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
