import type { TBSServiceName } from '@cityofzion/bs-multichain'
import type { NavigationProp } from '@react-navigation/native'
import type { Event } from '@sentry/react-native'
import type { CoreTypes } from '@walletconnect/types'

import type { Optional } from './global'
import type { TCurrency, TLanguage } from './store'
import type { TToasterToastOptions } from './toaster'

export type TWalletConnectRedirectParams = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  metadata: CoreTypes.Metadata
  fromDeeplink?: boolean
}

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBSServiceName
}

export type TToastHelperParams = Optional<Omit<TToasterToastOptions, 'component'>, 'duration' | 'id'>

export type TBuyAndSellTokensHelperType = 'buy' | 'sell'

export type TBuyAndSellTokensHelperBuildUrlParams = {
  type: TBuyAndSellTokensHelperType
  currency: TCurrency
  merchantTransactionId: string
  address?: string
  refundAddress?: string
}

export type TDateHelperFormatLocalizedOptions = {
  format: string
  language: TLanguage
}

export type TSkinHelperLocalSkin = {
  blockchain: TBSServiceName
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
  blockchain: TBSServiceName
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

export type TNetworkHelperIsNeoxAntiMevParams = {
  blockchain: TBSServiceName
  networkId: string
  url: string
}
