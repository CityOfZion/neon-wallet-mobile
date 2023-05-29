import { BalanceInfo } from '../models/response/BalanceInfo'
import { ContractResponse } from '../models/response/ContractResponse'
import { NFTResponse } from '../models/response/NFTResponse'
import { NFTSResponse } from '../models/response/NFTSResponse'

import { Transaction } from '~/src/models/Transaction'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
import { ExchangeInfo } from '~src/models/response/ExchangeInfo'

export type BlockchainServiceKey = 'neoLegacy' | 'neo3'
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
  tokenDecimals: number
  senderWif: string
  receiverAddress: string
  fee?: number
  tip?: number
}

export interface IIconDapps {
  getIcon(hash: string): Promise<string | undefined>
}

export interface BlockchainDataProvider {
  readonly network: TNetwork
  getAddressAbstracts: (address: string, page?: number) => Promise<TransactionAddressResponse>
  getBalance: (address: string) => Promise<BalanceInfo[]>
  getUnclaimed: (address: string) => Promise<UnclaimedResponse>
  getTransaction: (txid: string) => Promise<Transaction>
}

export interface IClaimable {
  claimGas: (wif: string) => Promise<string | null>
}

export interface IWalletConnect {
  getContract: (hash: string) => Promise<ContractResponse>
}

export interface INFT {
  getNFTS(address: string, page: number): Promise<NFTSResponse>
  getNFT: (tokenId: string, hash: string) => Promise<NFTResponse | undefined>
}

export type TCOZTip = { address: string; symbol: string; hash: string; decimals: number }
export type TFeeToken = { hash: string; token: string; decimals: number }

export type TNetworkType = 'mainnet' | 'testnet' | 'custom'
export type TNetwork = {
  type: TNetworkType
  url: string
}
export interface IBlockchainService {
  provider: BlockchainDataProvider
  network: TNetwork
  readonly key: BlockchainServiceKey
  readonly derivationPath: string
  readonly platform: string
  readonly cozTip?: TCOZTip
  readonly feeToken: TFeeToken
  sendTransaction: (data: SendTransactionData) => Promise<string | null>
  generateMnemonic: () => string[] | null
  generateWif(mnemonic: string, index: number): Promise<string>
  generateAccount(mnemonic: string, index: number): Promise<{ wif: string; address: string }>
  generateAccountFromWif(wif: string): string
  decryptKey(encryptedKey: string, password: string): Promise<{ wif: string; address: string }>
  validateAddress(address: string): boolean
  validatePrivateKeyWithPassword(privateKey: string): boolean
  validateWif(privateKey: string): boolean
  calculateTransferFee: (data: Omit<SendTransactionData, 'fee'>) => Promise<number>
  setNetwork: (network: TNetwork) => void
  getExchange: (currency: string) => Promise<ExchangeInfo[]>
  getBlockCount: () => Promise<number>
  isClaimable: () => this is IClaimable
  hasNFTIntegration: () => this is INFT
  hasWalletConnectIntegration: () => this is IWalletConnect
  hasIconDappsIntegration: () => this is IIconDapps
}
