import type { ImageURISource } from 'react-native'

import type { TBlockchainServiceKey } from './blockchain'
import type { IAccountState, IWalletState, TAccountType, TSkin, TWalletBackupStatus, TWalletType } from './store'

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
  wallet: IWalletState
  type: TAccountType
  skin?: TSkin
  key?: string
  name?: string
  order?: number
}

export type TUseImportAccountsParams = {
  wallet: IWalletState
  accountsToImport: Omit<TUseImportAccountParams, 'wallet'>[]
}

export type TUseCreateAccountParams = {
  wallet: IWalletState
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
  account: IAccountState
  data: Partial<Omit<IAccountState, 'id'>> & { key?: string }
}

export type TUseEditWalletParams = {
  wallet: IWalletState
  data: Partial<Omit<IWalletState, 'id'>> & { mnemonic?: string }
}

export type TUseImportActionInputType = 'key' | 'mnemonic' | 'encrypted' | 'address'

export type TUseImageErrorProps = {
  source?: ImageURISource
  defaultSource?: ImageURISource
  errorSource?: ImageURISource
}
