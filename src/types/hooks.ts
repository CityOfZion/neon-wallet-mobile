import type { ImageURISource } from 'react-native'

import type { TBlockchainServiceKey, TNetwork } from './blockchain'
import type { TAccount, TAccountType, TSkin, TWallet, TWalletBackupStatus, TWalletType } from './store'

export type TUseActionsData = Record<string, any>

export type TUseActionsSetDataValues<T = TUseActionsData> = Partial<T> | ((prev: T) => Partial<T>)

export type TUseActionsErrors<T> = Record<keyof T, string | undefined>

export type TUseActionsChanged<T> = Record<keyof T, boolean>

export type TUseActionsActionState<T> = {
  isValid: boolean
  isActing: boolean
  errors: TUseActionsErrors<T>
  changed: TUseActionsChanged<T>
  hasActed: boolean
  hasChanged: boolean
}

export type TUseActionsOptions = {
  clearErrorsOnChange?: boolean
}

export type TUseImportAccountParams = {
  address: string
  blockchain: TBlockchainServiceKey
  wallet: TWallet
  type: TAccountType
  skin?: TSkin
  key?: string
  name?: string
  order?: number
}

export type TUseImportAccountsParams = {
  wallet: TWallet
  accountsToImport: Omit<TUseImportAccountParams, 'wallet'>[]
}

export type TUseCreateAccountParams = {
  wallet: TWallet
  name?: string
  id?: string
  blockchain: TBlockchainServiceKey
}

export type TUseCreateWalletParams = {
  name: string
  mnemonic?: string
  id?: string
  type?: TWalletType
  backupStatus?: TWalletBackupStatus
}

export type TUseEditAccountParams = {
  account: TAccount
  data: Partial<Omit<TAccount, 'id'>> & { key?: string }
}

export type TUseEditWalletParams = {
  wallet: TWallet
  data: Partial<Omit<TWallet, 'id'>> & { mnemonic?: string }
}

export type TUseImportActionInputType = 'key' | 'mnemonic' | 'encrypted' | 'address'

export type TUseImageErrorProps = {
  source?: ImageURISource
  defaultSource?: ImageURISource
  errorSource?: ImageURISource
}

export type TUseTransactionsQueryBuildTransactionsQueryKeyParams = {
  blockchain: TBlockchainServiceKey
  address: string
  network: TNetwork
  dateFrom?: Date
  dateTo?: Date
}

export type TUseTransactionsQueryFetchTransactionParams = {
  account: TAccount
  dateFrom?: Date
  dateTo?: Date
  page: any
  accountsMap: Map<string, TAccount>
}

export type TUseTransactionsQueryParams = {
  account: TAccount
  dateFrom?: Date
  dateTo?: Date
}
