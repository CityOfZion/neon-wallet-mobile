import { NetworkType } from '@cityofzion/blockchain-service'
import { u, tx } from '@cityofzion/neon-core'
import { TSession, TSessionProposal } from '@cityofzion/wallet-connect-sdk-wallet-react'

import { TBlockchainServiceKey } from '../types/blockchain'

const scopeListByName: Record<string, tx.WitnessScope> = {
  None: tx.WitnessScope.None,
  CalledByEntry: tx.WitnessScope.CalledByEntry,
  CustomContracts: tx.WitnessScope.CustomContracts,
  CustomGroups: tx.WitnessScope.CustomGroups,
  WitnessRules: tx.WitnessScope.WitnessRules,
  Global: tx.WitnessScope.Global,
}

type AccountInformation = {
  namespace: string
  reference: string
  address: string
  chainId: string
  blockchain: TBlockchainServiceKey
}

type ProposalInformation = {
  proposalBlockchain: string
  proposalNetwork: string
  chainId: string
  blockchain: TBlockchainServiceKey
  network: NetworkType
}

export abstract class WalletConnectHelper {
  static networksByBlockchainServiceKey: Partial<Record<TBlockchainServiceKey, Record<NetworkType, string>>> = {
    neo3: {
      custom: 'private',
      mainnet: 'mainnet',
      testnet: 'testnet',
    },
    ethereum: {
      mainnet: '1',
      custom: '',
      testnet: '5',
    },
  }

  static blockchainsByBlockchainServiceKey: Partial<Record<TBlockchainServiceKey, string>> = {
    ethereum: 'eip155',
    neo3: 'neo3',
  }

  static getAccountInformationFromSession(session: TSession): AccountInformation[] {
    const accounts = Object.values(session.namespaces)[0].accounts
    const accountsInfos = accounts.map((account): AccountInformation => {
      const [namespace, reference, address] = account.split(':')

      const blockchainByBlockchainServiceKey = Object.entries(this.blockchainsByBlockchainServiceKey).find(
        ([, value]) => value === namespace
      )
      if (!blockchainByBlockchainServiceKey) throw new Error('Blockchain not supported')

      const blockchain = blockchainByBlockchainServiceKey[0] as TBlockchainServiceKey
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

  static getInformationFromProposal(proposal: TSessionProposal): ProposalInformation {
    const chains = Object.values(proposal.params.requiredNamespaces)[0].chains
    if (!chains) throw new Error('Chains not found')

    const chain = chains[0]
    const [proposalBlockchain, proposalNetwork] = chain.split(':')

    const blockchainByBlockchainServiceKey = Object.entries(this.blockchainsByBlockchainServiceKey).find(
      ([, value]) => value === proposalBlockchain
    )
    if (!blockchainByBlockchainServiceKey) throw new Error('Blockchain not supported')

    const blockchain = blockchainByBlockchainServiceKey[0] as TBlockchainServiceKey

    const networks = this.networksByBlockchainServiceKey[blockchain]
    if (!networks) throw new Error('Blockchain not supported')

    const networkByNetworkType = Object.entries(networks).find(entry => entry[1] === proposalNetwork)
    if (!networkByNetworkType) throw new Error('Network not supported')

    const network = networkByNetworkType[0] as NetworkType

    return {
      proposalBlockchain,
      proposalNetwork,
      chainId: `${proposalBlockchain}:${proposalNetwork}`,
      blockchain,
      network,
    }
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

  static convertChain(blockchain: TBlockchainServiceKey, network: NetworkType): string {
    const networks = this.networksByBlockchainServiceKey[blockchain]
    if (!networks) throw new Error('Blockchain not supported')

    return networks[network]
  }

  static convertBlockchain(blockchain: TBlockchainServiceKey): string {
    const convertedBlockchain = this.blockchainsByBlockchainServiceKey[blockchain]
    if (!convertedBlockchain) throw new Error('Blockchain not supported')

    return convertedBlockchain
  }

  static resolveScope(scope: string | number) {
    const isString = isNaN(Number(scope))
    const queryScope = isString ? scopeListByName[scope] ?? null : scope
    if (!queryScope) throw Error('unsupported scope')
    return queryScope
  }
}
