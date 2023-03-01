import base64 from 'react-native-base64'

import { BlockchainServiceKey, TNetworkType } from '../blockchain'
import { walletConnectConfig } from '../config/WalletConnectConfig'
import { Session, SessionProposal } from '../contexts/WalletConnectContext'

type AccountInformation = {
  namespace: string
  reference: string
  address: string
  chainId: string
  blockchain: BlockchainServiceKey
}

export abstract class WalletConnectHelper {
  static checkSupportedMethods(method: string) {
    return walletConnectConfig.defaultMethods.includes(method as any)
  }

  static getAccountInformationFromSession(session: Session): AccountInformation[] {
    const accounts = Object.values(session.namespaces)[0].accounts
    const accountsInfos = accounts.map((account): AccountInformation => {
      const [namespace, reference, address] = account.split(':')

      const blockchains = walletConnectConfig.blockchainsByBlockchainServiceKey
      const blockchainKeys = Object.keys(blockchains) as BlockchainServiceKey[]
      const blockchain = blockchainKeys.find(key => blockchains[key] === namespace)

      if (!blockchain) throw new Error('Blockchain not supported')

      return {
        address,
        namespace,
        reference,
        chainId: `${namespace}:${reference}`,
        blockchain,
      }
    })

    return accountsInfos
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

  static getChain(network: TNetworkType, blockchain: BlockchainServiceKey) {
    const blockchains: Partial<Record<BlockchainServiceKey, string>> = {
      neo3: 'neo3',
    }

    const networks: Record<TNetworkType, string> = {
      custom: 'private',
      mainnet: 'mainnet',
      testnet: 'testnet',
    }

    if (!blockchains[blockchain]) throw new Error('Blockchain not supported')

    return `${blockchains[blockchain]}:${networks[network]}`
  }

  static getBlockchainFromProposal(proposal: SessionProposal): BlockchainServiceKey {
    const chain = Object.values(proposal.params.requiredNamespaces)[0].chains[0]

    return WalletConnectHelper.getBlockchainByChain(chain)
  }

  static getBlockchainByChain(chain: string): BlockchainServiceKey {
    const [namespace] = chain.split(':')

    const blockchains = walletConnectConfig.blockchainsByBlockchainServiceKey
    const blockchainKeys = Object.keys(blockchains) as BlockchainServiceKey[]
    const blockchain = blockchainKeys.find(key => blockchains[key] === namespace)

    if (!blockchain) throw new Error('Blockchain not supported')

    return blockchain
  }
}
