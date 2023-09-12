import { BSAggregator, TransactionResponse } from '@cityofzion/blockchain-service'
import { Action, AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { TBlockchainServiceKey } from './blockchain'

import { TSelectedBlockchainNetworks, TBlockchainNetworks } from '~/src/config/BlockchainConfig'
import { Security } from '~/src/enums/Security'
import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'
import { Theme } from '~src/enums/Theme'
import { RootState } from '~src/store/RootStore'

export interface AccountState {
  address: string
  accountType: WalletType
  idWallet: string
  name: string
  backgroundColor: string
  blockchain: TBlockchainServiceKey
  pendingTransactions: TransactionResponse[]
}

export interface BlockchainState {
  bsAggregator: BSAggregator<TBlockchainServiceKey>
}

export type ContactAddressesList = ContactAddresses[]
export type ContactAddresses = { address: string; blockchain: TBlockchainServiceKey }
export interface ContactState {
  id: string
  name: string
  addresses: ContactAddressesList
}

export interface NetworkState {
  isConnected?: boolean
}

export interface SettingsState {
  language: Lang
  currency: Currency
  theme: Theme
  security: Security
  isFirstTime: boolean
  blockchainNetworks: TBlockchainNetworks
  selectedBlockchainNetworks: TSelectedBlockchainNetworks
}

export type WalletType = 'standard' | 'watch' | 'legacy'
export type WalletBackupStatus = 'successful' | 'unsuccessful' | 'unsuccessful_with_knowledge'
export interface WalletState {
  id: string
  name: string
  walletType: WalletType
  lastVisitedAt?: string
  backupStatus: WalletBackupStatus
}

export type SyncAction<Return = void, A extends Action = any, E = any> = ThunkAction<Return, RootState, E, A>
export type AsyncAction<Return = void, A extends Action = any, E = any> = ThunkAction<Promise<Return>, RootState, E, A>
export type DispatchResult<A extends Action = AnyAction> = (action: Partial<A>) => void
export type SyncDispatch<Return = void, A extends Action = AnyAction, E = any> = (
  action: SyncAction<Return, A, E>
) => Return
export type AsyncDispatch<Return = void, A extends Action = AnyAction, E = any> = (
  action: AsyncAction<Return, A, E>
) => Promise<Return>
