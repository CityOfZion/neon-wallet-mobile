import { EnvHelper } from './EnvHelper'

import type { TBuyAndSellTokensHelperBuildUrlParams, TBuyAndSellTokensHelperType } from '@/types/helpers'
import type { TAvailableCurrency } from '@/types/store'

export class BuyAndSellTokensHelper {
  static readonly #baseUrl = 'https://exchange.mercuryo.io'
  static readonly #defaultCurrencyLabel: TAvailableCurrency = 'USD'

  static readonly #supportedCurrencyLabelsByType: Record<TBuyAndSellTokensHelperType, TAvailableCurrency[]> = {
    buy: [this.#defaultCurrencyLabel, 'EUR', 'BRL', 'GBP'],
    sell: [this.#defaultCurrencyLabel, 'EUR', 'GBP'],
  }

  static readonly sumsubTermsAndConditionsUrl = 'https://sumsub.com/terms-and-conditions'
  static readonly mercuryoTermsUrl = 'https://mercuryo.io/legal/terms'

  static #getValidCurrencyLabel(
    currencyLabel: TAvailableCurrency,
    supportedCurrencyLabels: TAvailableCurrency[]
  ): TAvailableCurrency {
    return supportedCurrencyLabels.includes(currencyLabel) ? currencyLabel : this.#defaultCurrencyLabel
  }

  static buildUrl({
    type,
    currency,
    merchantTransactionId,
    address,
    refundAddress,
  }: TBuyAndSellTokensHelperBuildUrlParams) {
    if (!EnvHelper.EXPO_PUBLIC_MERCURYO_WIDGET_ID) return ''

    const params = new URLSearchParams({
      widget_id: EnvHelper.EXPO_PUBLIC_MERCURYO_WIDGET_ID,
      type,
      currency: 'BTC',
      fiat_currency: this.#getValidCurrencyLabel(currency.label, this.#supportedCurrencyLabelsByType[type]),
      lang: 'en',
      theme: 'exolix',
      merchant_transaction_id: merchantTransactionId,
    })

    if (address) {
      params.set('address', address)
    }

    if (refundAddress) {
      params.set('refund_address', refundAddress)
    }

    return `${this.#baseUrl}?${params.toString()}`
  }
}
