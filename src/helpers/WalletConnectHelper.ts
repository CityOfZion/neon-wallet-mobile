import { u } from '@cityofzion/neon-core'

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
  static networks: Record<TNetworkType, string> = {
    custom: 'private',
    mainnet: 'mainnet',
    testnet: 'testnet',
  }

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

  static convertAndValidateBase64(base64: string) {
    const uri = u.base642utf8(base64)

    if (!WalletConnectHelper.isValidURI(uri)) return

    return uri
  }

  static getChain(network: TNetworkType, blockchain: BlockchainServiceKey) {
    const blockchains: Partial<Record<BlockchainServiceKey, string>> = {
      neo3: 'neo3',
    }

    if (!blockchains[blockchain]) throw new Error('Blockchain not supported')

    return `${blockchains[blockchain]}:${this.networks[network]}`
  }

  static getNetworkFromProposal(proposal: SessionProposal): {
    blockchain: BlockchainServiceKey
    network: TNetworkType
  } {
    const chain = Object.values(proposal.params.requiredNamespaces)[0].chains[0]
    const [proposalNamespace, proposalNetwork] = chain.split(':')

    const blockchains = walletConnectConfig.blockchainsByBlockchainServiceKey
    const blockchainKeys = Object.keys(blockchains) as BlockchainServiceKey[]
    const blockchain = blockchainKeys.find(key => blockchains[key] === proposalNamespace)

    if (!blockchain) throw new Error('Blockchain not supported')

    const network = (Object.entries(this.networks) as [TNetworkType, string][]).find(
      ([, value]) => value === proposalNetwork
    )
    if (!network) throw new Error('Network not supported')

    return {
      blockchain,
      network: network[0],
    }
  }
}
