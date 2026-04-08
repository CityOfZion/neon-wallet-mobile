import type { TTransaction } from '@cityofzion/blockchain-service'
import type { NavigationProp } from '@react-navigation/native'
import type { Event } from '@sentry/react-native'
import type { CoreTypes } from '@walletconnect/types'

import type { TBlockchainServiceKey } from './blockchain'
import type { Optional } from './global'
import type { TAccount, TCurrency, TLanguage } from './store'
import type { TToasterToastOptions } from './toaster'

export type TWalletConnectRedirectParams = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  metadata: CoreTypes.Metadata
  fromDeeplink?: boolean
}

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TToastHelperParams = Optional<Omit<TToasterToastOptions, 'component'>, 'duration' | 'id'>

export type TClickupHelperCreateSupportTicketParams = {
  email: string
  name: string
  description: string
}

export type TBuyAndSellTokensHelperBuildIframeParams = {
  currency: TCurrency
  account?: TAccount
  baseUrl: string
  id: string
}

export type TDateHelperFormatLocalizedOptions = {
  format: string
  language: TLanguage
}

export type TSkinHelperLocalSkin = {
  blockchain: TBlockchainServiceKey
  collectionHash: string
  imageUrl: string
}

export type TCurrencyHelperFormatOptions = {
  currency: TCurrency
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showZero?: boolean
  approximateSymbol?: boolean
}

export type TStringHelperRemoveSpecialCharacterOptions = {
  allowSpaces?: boolean
  allowDots?: boolean
  removeDoubleSpaces?: boolean
  trimText?: boolean
}

export type THardwareWalletHelperGetAccountParams = {
  blockchain: TBlockchainServiceKey
  index: number
}

export type THardwareWalletHelperConnectByUsbParams = {
  abortSignal?: AbortSignal
}

export type TDateHelperCalculateDateSelectionMaxOneYearParams = {
  dateFrom: Date
  dateTo: Date
}

export type TDateHelperCalculateDateFromSelectionMaxOneYearResponse = {
  dateFrom: Date
  dateTo?: Date
}

export type TDateHelperCalculateDateToSelectionMaxOneYearResponse = {
  dateTo: Date
  dateFrom?: Date
}

export type TLoggerHelperOptions = {
  where: string
  operation: string
}

export type TSentryHelperOptions = TLoggerHelperOptions & {
  level: Event['level']
}

export type TTransactionHelperBuildPendingTransactionParams = {
  transaction: TTransaction<TBlockchainServiceKey>
  account: TAccount
  senderAccount?: TAccount
  receiverAccounts?: (TAccount | undefined)[]
}
