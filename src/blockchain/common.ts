import { JsonRpcRequest, JsonRpcResponse } from '@json-rpc-tools/utils'
import { ImageLoadEventData } from 'react-native'

import { BalanceInfo } from '../models/response/BalanceInfo'
import { ContractResponse } from '../models/response/ContractResponse'
import { NFTResponse } from '../models/response/NFTResponse'
import { NFTSResponse } from '../models/response/NFTSResponse'
import { BSNeo3 } from './Neo3/services/BSNeo3'
import { BSNeoLegacy } from './NeoLegacy/services/BSNeoLegacy'

import { Node } from '~/src/models/Node'
import { Transaction } from '~/src/models/Transaction'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
import * as BlockchainIcons from '~src/assets/blockchainIcons'
import { Account } from '~src/models/redux/Account'
import { ExchangeInfo } from '~src/models/response/ExchangeInfo'

export interface IToken {
  symbol: string
  type: string
  name: string
  hash: string
  decimals: number
  blockchain: BlockchainServiceKey
}

export interface IRPCContract {
  hash: string
  manifest: {
    name: string
    abi: {
      events: {
        name: string
        parameters: {
          name: string
          type: string
        }[]
      }[]
      methods: {
        name: string
        offset: number
        parameters: { name: string; type: string }[]
        returntype: string
        safe: boolean
      }[]
    }
  }
}

export interface SendTransactionData {
  amount: number
  tokenHash: string
  senderAddress: string
  receiverAddress: string
  fee?: number
  tip?: number
}

export interface BlockchainDataProvider {
  readonly siteUrlQuery: string
  getTransaction: (txid: string) => Promise<Transaction>
  getAddressAbstracts: (address: string, page?: number) => Promise<TransactionAddressResponse>
  getContract: (hash: string) => Promise<ContractResponse>
  getBalance: (address: string) => Promise<BalanceInfo[]>
  getUnclaimed: (address: string) => Promise<UnclaimedResponse>
  getAllNodes: () => Promise<Node[]>
  getAssetByHash: (hash: string) => Promise<{ symbol: string; decimals: number } | null>
}

export interface IClaimable {
  claimGas: (
    address: string
  ) => Promise<{ txid: string | null; token: string; hash: string; fee: number | null } | null>
}

export interface IWalletConnect {
  rpcCall: (account: string, request: JsonRpcRequest) => Promise<JsonRpcResponse>
  calculateFee(senderAddress: string, cim: JsonRpcRequest): Promise<string>
}

export interface INFT {
  getNFTS(address: string, page: number): Promise<NFTSResponse>
  getNFT: (tokenId: string, hash: string) => Promise<NFTResponse>
}

export interface IBlockchainService {
  key: BlockchainServiceKey
  provider: BlockchainDataProvider
  readonly icon: ImageLoadEventData
  readonly derivationPath: string
  readonly platform: string
  readonly nativeAssets: string[]
  readonly cozTip?: { address: string; token: string; hash: string } //config token with the symbol name
  readonly feeToken: { hash: string; token: string }
  readonly tokens: IToken[]
  readonly wcChains: string[]
  sendTransaction: (data: SendTransactionData) => Promise<string | null>
  generateMnemonic: () => string[] | null
  generateWif(mnemonic: string, index: number): string
  generateAccount(mnemonic: string, index: number): { wif: string; address: string }
  generateAccountFromWif(wif: string): string
  decryptKey(encryptedKey: string, password: string): Promise<{ wif: string; address: string }>
  validateAddress(address: string): boolean
  validatePrivateKeyWithPassword(privateKey: string): boolean
  validateWif(privateKey: string): boolean
  calculateTransferFee: (data: Omit<SendTransactionData, 'fee'>) => Promise<number>
  setAccountsPool: (accounts: Account[]) => void
  getExchange: (currency: string) => Promise<ExchangeInfo[]>
}

export type IBlockchainServices = Record<BlockchainServiceKey, IBlockchainService>

export const blockchainServices: IBlockchainServices = {
  neo3: new BSNeo3(),
  neoLegacy: new BSNeoLegacy(),
}

export const blockchainList = Object.keys(blockchainServices) as BlockchainServiceKey[]

export function validateTextAllBlockchains(text: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const { validateAddress, validatePrivateKeyWithPassword, validateWif } = blockchainServices[blockchainName]
      validate = validateAddress(text) || validatePrivateKeyWithPassword(text) || validateWif(text)
    }
    return validate
  }, false)
}

export function validateAddressAllBlockchains(address: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const { validateAddress } = blockchainServices[blockchainName]
      validate = validateAddress(address)
    }
    return validate
  }, false)
}

export function validateWifAllBlockchains(wif: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const { validateWif } = blockchainServices[blockchainName]
      validate = validateWif(wif)
    }
    return validate
  }, false)
}

export function validatePrivateKeyWithPasswordAllBlockchains(privateKey: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const { validatePrivateKeyWithPassword } = blockchainServices[blockchainName]
      validate = validatePrivateKeyWithPassword(privateKey)
    }
    return validate
  }, false)
}

export function getBlockchainByAddress(address: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const { validateAddress } = blockchainServices[blockchainName]
      const validate = validateAddress(address)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainByWif(wif: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const { validateWif } = blockchainServices[blockchainName]
      const validate = validateWif(wif)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainByPrivateKeyWithPassword(encryptedKey: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const { validatePrivateKeyWithPassword } = blockchainServices[blockchainName]
      const validate = validatePrivateKeyWithPassword(encryptedKey)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainBySomeText(text: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const { validatePrivateKeyWithPassword, validateAddress, validateWif } = blockchainServices[blockchainName]
      const validate = validatePrivateKeyWithPassword(text) || validateAddress(text) || validateWif(text)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

type TColorLogo = 'white' | 'default'

export function getBlockchainLogo(blockchain: BlockchainServiceKey, color: TColorLogo = 'default') {
  const blockchainWithColor = `${blockchain}${color === 'default' ? '' : color}`
  return (BlockchainIcons as any)[blockchainWithColor] ?? require('~/src/assets/images/icon-default-nep5.png') //need a default logo
}

export function isClaimable(object: any): object is IClaimable {
  return 'claimGas' in object
}

export function hasWCIntegration(object: any): object is IWalletConnect {
  const methodsName = ['rpcCall', 'calculateFee']
  let result = false
  for (const methodName of methodsName) {
    if (methodName in object) {
      result = methodName in object
    }
  }
  return result
}

export const hasWalletconnect = (account: Account) => {
  const bs = blockchainServices[account.blockchain]

  return hasWCIntegration(bs)
}

export function hasNFTIntegration(object: any): object is INFT {
  const methodsName = ['getNFTS', 'getNFT']

  return methodsName.every(methodName => methodName in object)
}

export type BlockchainServiceKey = 'neoLegacy' | 'neo3'

export function getBlockchainByWCChain(chains: string[]) {
  let result: BlockchainServiceKey | null = null

  for (const blockchain of blockchainList) {
    for (const chain of chains) {
      const chainFound = blockchainServices[blockchain].wcChains.find(it => it === chain)
      if (chainFound) {
        result = blockchain
        break
      }
    }
  }
  return result
}

export function getWCChainByBlockchain(blockchain: BlockchainServiceKey) {
  let result: string | null = null

  result = blockchainServices[blockchain].wcChains[0] ?? null

  return result
}

export function isValidWcChain(wcChains: string[], blockchain: BlockchainServiceKey) {
  return blockchainServices[blockchain].wcChains.some(chain => wcChains.includes(chain))
}

export function getAllTokens() {
  const tokens = blockchainList.flatMap(blockchain => blockchainServices[blockchain].tokens)

  return tokens
}

export function mappedTokensBySymbol(symbol: string) {
  const result = new Map<BlockchainServiceKey, IToken[]>()

  blockchainList.forEach(blockchain => {
    result.set(
      blockchain,
      blockchainServices[blockchain].tokens.filter(token => token.symbol === symbol)
    )
  })
  return result
}
