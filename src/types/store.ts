import type {
  TSwapServiceStatusResponse,
  TSwapToken,
  TTransactionBase,
  TTransactionBridgeNeo3NeoX,
  TTransactionNftEvent,
  TTransactionTokenEvent,
} from '@cityofzion/blockchain-service'

import type { TBlockchainServiceKey, TNetwork } from './blockchain'
import type { Optional } from './global'

export type TColorSkin = {
  id: string
  type: 'color'
}

export type TLocalSkin = {
  id: string
  type: 'local'
}

export type TNftSkin = {
  id: string
  type: 'nft'
  imgUrl: string
  contractHash: string
}

export type TSkin = TColorSkin | TLocalSkin | TNftSkin

export type TAccountType = 'standard' | 'watch' | 'hardware'
export interface IAccountState {
  id: string
  address: string
  type: TAccountType
  idWallet: string
  name: string
  skin: TSkin
  blockchain: TBlockchainServiceKey
  order: number
}

export type TWalletType = 'standard' | 'non-standard' | 'hardware'
export type TWalletBackupStatus = 'successful' | 'unsuccessful' | 'unsuccessful_with_knowledge'

export interface IWalletState {
  id: string
  name: string
  type: TWalletType
  lastVisitedAt?: string
  backupStatus: TWalletBackupStatus
}

export type TAccountWithWallet = IAccountState & { wallet: IWalletState }

export type TContactAddress = { address: string; blockchain: TBlockchainServiceKey }
export interface IContactState {
  id: string
  name: string
  addresses: TContactAddress[]
}

export type TAvailableCurrency = 'USD' | 'BRL' | 'EUR' | 'GBP' | 'CNY'
export type TCurrency = {
  symbol: string
  label: TAvailableCurrency
}

export type TAvailableLanguages = 'English' | 'Deutsch' | 'Português (BR)' | '简体中文' | '繁體中文'

export type TLanguage = {
  value: string
  label: TAvailableLanguages
}

export type TDeviceSecurity = {
  type: 'device'
}

export type TPasswordSecurity = {
  type: 'password'
}

export type TNfiSecurity = {
  type: 'nfi'
  tokenId: string
  pubKey: string
  tagPointer: number
}

export type TDisabledSecurity = {
  type: 'disabled'
}

export type TSecurity = TDeviceSecurity | TPasswordSecurity | TNfiSecurity | TDisabledSecurity

export type TSecurityType = TSecurity['type']

export type TSelectedNetworks = {
  [K in TBlockchainServiceKey]: TNetwork
}

export type TCustomNetwork = {
  [K in TBlockchainServiceKey]: TNetwork[]
}

export type TUseTransactionsTransactionEvent = (TTransactionTokenEvent | TTransactionNftEvent) & {
  fromAccount?: IAccountState
  toAccount?: IAccountState
}

export type TUseTransactionsTransaction = TTransactionBase & {
  account: IAccountState
  blockchain: TBlockchainServiceKey
  isPending: boolean
  events: TUseTransactionsTransactionEvent[]
} & ({ type: 'default' } | { type: 'claim' } | { type: 'vote' } | TTransactionBridgeNeo3NeoX<TBlockchainServiceKey>)

export type TUseTransactionsGroupedTransactionsByDate = {
  date: string
  formattedDate: string
  data: TUseTransactionsTransaction[]
}

export type TSwapRecord = {
  account: IAccountState
  txFrom?: string
  txTo?: string
  swapProvider: 'simpleswap'
  swapId?: string
  swapStatus: TSwapServiceStatusResponse['status']
  tokenFrom: TSwapToken<TBlockchainServiceKey>
  tokenTo: TSwapToken<TBlockchainServiceKey>
  amountFrom: string
  amountTo: string
  addressTo: string
  extraIdTo?: string
  fee?: string
  log?: string
}

export type TNotificationNavigateActionHideFraudulentTokenPayload = {
  to: 'hide-fraudulent-token'
  address: string
  blockchain: TBlockchainServiceKey
  tokenHash?: string
}

export type TNotificationNavigateAction = {
  type: 'navigate'
  payload:
    | {
        to: 'account-transaction'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | {
        to: 'account-tokens'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | TNotificationNavigateActionHideFraudulentTokenPayload
    | {
        to: 'vote-neo3'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | {
        to: 'backup-wallet'
      }
}

export type TNotificationAction = TNotificationNavigateAction

export type TNotificationPriority = 'low' | 'medium' | 'high'

export type TNotification = {
  id: string
  title: string
  titleValue?: string
  previewBody: string
  previewBodyValue?: string
  date: number
  body?: string
  read: boolean
  priority: TNotificationPriority
  provider: 'system'
  action?: TNotificationAction
  related?: {
    blockchain: TBlockchainServiceKey
    address: string
  }
}

export type TSaveNotification = Optional<TNotification, 'id' | 'date' | 'provider' | 'read' | 'priority'>

export type THiddenTokenByBlockchain = Partial<Record<TBlockchainServiceKey, string[]>>

export type TLastIndexesByWallet = Partial<Record<TBlockchainServiceKey, Record<string, number>>>

export type TSurveyInfoStatus = 'not-submitted' | 'submitted-positive' | 'submitted-negative'

export type TSurveyInfo = {
  status: TSurveyInfoStatus
  updatedAt: number
}
