import { NetworkType } from '@cityofzion/blockchain-service'
import { u } from '@cityofzion/neon-core'
import { TSession, TSessionProposal, Chain, Blockchain } from '@cityofzion/wallet-connect-sdk-wallet-react'

import { TBlockchainServiceKey } from '../types/blockchain'

type AccountInformation = {
  namespace: string
  reference: string
  address: string
  chainId: string
  blockchain: TBlockchainServiceKey
}

export abstract class WalletConnectHelper {
  static networks: Record<NetworkType, Chain> = {
    custom: 'private',
    mainnet: 'mainnet',
    testnet: 'testnet',
  }

  static blockchainsByBlockchainServiceKey: Partial<Record<TBlockchainServiceKey, Blockchain>> = {
    neo3: 'neo3',
  }

  static getAccountInformationFromSession(session: TSession): AccountInformation[] {
    const accounts = Object.values(session.namespaces)[0].accounts
    const accountsInfos = accounts.map((account): AccountInformation => {
      const [namespace, reference, address] = account.split(':')

      const blockchain = (
        Object.entries(this.blockchainsByBlockchainServiceKey) as [TBlockchainServiceKey, Blockchain][]
      ).find(([, value]) => value === namespace)
      if (!blockchain) throw new Error('Blockchain not supported')

      if (!blockchain) throw new Error('Blockchain not supported')

      return {
        address,
        namespace,
        reference,
        chainId: `${namespace}:${reference}`,
        blockchain: blockchain[0],
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

  static convertChain(network: NetworkType): Chain {
    return this.networks[network]
  }

  static getNetworkFromProposal(proposal: TSessionProposal): {
    blockchain: TBlockchainServiceKey
    network: NetworkType
  } {
    const chainId = Object.values(proposal.params.requiredNamespaces)[0].chains?.[0]
    if (!chainId) throw new Error('ChainId not found')
    const [proposalBlockchain, proposalNetwork] = chainId.split(':') as [Blockchain, Chain]

    const blockchain = (
      Object.entries(this.blockchainsByBlockchainServiceKey) as [TBlockchainServiceKey, Blockchain][]
    ).find(([, value]) => value === proposalBlockchain)
    if (!blockchain) throw new Error('Blockchain not supported')

    const network = (Object.entries(this.networks) as [NetworkType, Chain][]).find(
      ([, value]) => value === proposalNetwork
    )
    if (!network) throw new Error('Network not supported')

    return {
      blockchain: blockchain[0],
      network: network[0],
    }
  }
}
