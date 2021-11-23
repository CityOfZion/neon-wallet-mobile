import {ImageLoadEventData} from 'react-native'

import {PriorityFee} from '../models/PriorityFee'
import {TokenAsset} from '../models/TokenAsset'
import {BSNeo3} from './Neo3/services/BSNeo3'
import {BSNeoLegacy} from './NeoLegacy/services/BSNeoLegacy'

import {Node} from '~/src/models/Node'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'
import {Exchange} from '~/src/types/exchange'
import {TokenResponse} from '~/src/types/token'
import * as BlockchainIcons from '~src/assets/blockchainIcons'

export interface SenderTransactionInfo {
  token: TokenAsset | null
  senderAddress: string | null
  receiverAddress: string | null
  feeAmount: PriorityFee | null
  tip?: {amount: number; address: string}
}

export interface BlockchainDataProvider {
  getTransaction: (txid: string) => Promise<Transaction>
  getAddressAbstracts: (
    address: string,
    page?: number
  ) => Promise<TransactionAddressResponse>
  getBalance: (address: string) => Promise<BalanceResponse>
  getUnclaimed: (address: string) => Promise<UnclaimedResponse>
  getAllNodes: () => Promise<Node[]>
  getTokenList: () => Promise<TokenResponse>
  getExchangeData: (params: {
    tokenAssetSymbols: string[]
    currencies: string
  }) => Promise<Exchange>
}

export interface AssetInfo {
  name: string
  hash: string
  symbol: string
  decimals: number
}

export interface IClaimable {
  claimGas: (
    address: string
  ) => Promise<{txid: string | null; token: string; hash: string} | null>
}

export interface IWalletConnect {
  connect: () => boolean
}

export interface IBlockchainService {
  key: BlockchainServiceKey
  provider: BlockchainDataProvider
  readonly icon: ImageLoadEventData
  readonly derivationPath: string
  readonly platform: string
  readonly assets: AssetInfo[]
  readonly cozTip?: {address: string; token: string; hash: string} //config token with the symbol name
  readonly feeToken: {hash: string; token: string; img: ImageLoadEventData}
  readonly siteUrlQuery: string
  sendTransaction: (sendTx: SenderTransactionInfo) => Promise<string | null>
  generateMnemonic: () => string[] | null
  generateWif(mnemonic: string, index: number): string
  generateAccount(
    mnemonic: string,
    index: number
  ): {wif: string; address: string}
  generateAccountFromWif(wif: string): string
  decryptKey(
    encryptedKey: string,
    password: string
  ): Promise<{wif: string; address: string}>
  validateAddress(address: string): boolean
  validatePrivateKeyWithPassword(privateKey: string): boolean
  validateWif(privateKey: string): boolean
  calculateFee: (
    sendtx: Omit<SenderTransactionInfo, 'feeAmount'>
  ) => Promise<number>
}

export type IBlockchainServices = Record<
  BlockchainServiceKey,
  IBlockchainService
>

export const blockchainServices: IBlockchainServices = {
  neo3: new BSNeo3(),
  neoLegacy: new BSNeoLegacy(),
}

export const blockchainList = Object.keys(
  blockchainServices
) as BlockchainServiceKey[]

export function validateTextAllBlockchains(text: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const {
        validateAddress,
        validatePrivateKeyWithPassword,
        validateWif,
      } = blockchainServices[blockchainName]
      validate =
        validateAddress(text) ||
        validatePrivateKeyWithPassword(text) ||
        validateWif(text)
    }
    return validate
  }, false)
}

export function validateAddressAllBlockchains(address: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const {validateAddress} = blockchainServices[blockchainName]
      validate = validateAddress(address)
    }
    return validate
  }, false)
}

export function validateWifAllBlockchains(wif: string) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const {validateWif} = blockchainServices[blockchainName]
      validate = validateWif(wif)
    }
    return validate
  }, false)
}

export function validatePrivateKeyWithPasswordAllBlockchains(
  privateKey: string
) {
  return blockchainList.reduce((validate, blockchainName) => {
    if (!validate) {
      const {validatePrivateKeyWithPassword} = blockchainServices[
        blockchainName
      ]
      validate = validatePrivateKeyWithPassword(privateKey)
    }
    return validate
  }, false)
}

export function getBlockchainByAddress(address: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const {validateAddress} = blockchainServices[blockchainName]
      const validate = validateAddress(address)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainByWif(wif: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const {validateWif} = blockchainServices[blockchainName]
      const validate = validateWif(wif)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainByPrivateKeyWithPassword(encryptedKey: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const {validatePrivateKeyWithPassword} = blockchainServices[
        blockchainName
      ]
      const validate = validatePrivateKeyWithPassword(encryptedKey)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

export function getBlockchainBySomeText(text: string) {
  return blockchainList.reduce((result, blockchainName) => {
    if (!result) {
      const {
        validatePrivateKeyWithPassword,
        validateAddress,
        validateWif,
      } = blockchainServices[blockchainName]
      const validate =
        validatePrivateKeyWithPassword(text) ||
        validateAddress(text) ||
        validateWif(text)
      result = validate ? blockchainName : null
    }
    return result
  }, null as BlockchainServiceKey | null)
}

type TColorLogo = 'white' | 'default'

export function getBlockchainLogo(
  blockchain: BlockchainServiceKey,
  color: TColorLogo = 'default'
) {
  const blockchainWithColor = `${blockchain}${color === 'default' ? '' : color}`
  return ((BlockchainIcons as any)[blockchainWithColor] ??
    require('~/src/assets/images/icon-default-nep5.png')) as ImageLoadEventData //need a default logo
}

export function isClaimable(object: any): object is IClaimable {
  return 'claimGas' in object
}

export type BlockchainServiceKey = 'neoLegacy' | 'neo3'
