import type { GateFiLangEnum } from '@gatefi/js-sdk'

import { EnvHelper } from './EnvHelper'

import type { TBuyAndSellTokensHelperBuildIframeParams } from '@/types/helpers'
import type { TAvailableCurrency } from '@/types/store'

export class BuyAndSellTokensHelper {
  static readonly sumsubTermsAndConditionsUrl = 'https://sumsub.com/terms-and-conditions'
  static readonly unlimitUseTermsUrl =
    'https://cdn.unlimit.com/site-crypto/wp-content/uploads/2023/11/24062357/Unl-Crypto_User-TC_.pdf'
  static readonly #supportedCurrencyLabels: TAvailableCurrency[] = ['USD', 'EUR', 'BRL', 'GBP']
  static readonly #defaultCurrencyLabel: TAvailableCurrency = this.#supportedCurrencyLabels[0]
  static readonly #hideBrand: true
  static readonly #lang: GateFiLangEnum.en_US
  static readonly #theme: 'dark'

  static #getValidCurrencyLabel(currencyLabel: TAvailableCurrency): TAvailableCurrency {
    return this.#supportedCurrencyLabels.includes(currencyLabel) ? currencyLabel : this.#defaultCurrencyLabel
  }

  static buildIframeUrl({ currency, account, id, baseUrl }: TBuyAndSellTokensHelperBuildIframeParams) {
    if (!EnvHelper.EXPO_PUBLIC_UNLIMIT_MERCHANT_ID) {
      return
    }

    const params = new URLSearchParams({
      merchantId: EnvHelper.EXPO_PUBLIC_UNLIMIT_MERCHANT_ID,
      fiatCurrency: this.#getValidCurrencyLabel(currency.label),
      lang: this.#lang,
      themeMode: this.#theme,
      hideBrand: String(this.#hideBrand),
      wallet: account?.address ?? '',
      reloadId: id,
    })

    return `${baseUrl}?${params.toString()}`
  }
}
