import { SessionTypes } from '@walletconnect/types'

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
}
