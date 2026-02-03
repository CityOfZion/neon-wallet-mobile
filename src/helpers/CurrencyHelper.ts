import { LoggerHelper } from './LoggerHelper'

import type { TCurrencyHelperFormatOptions } from '@/types/helpers'
import type { TAvailableCurrency, TCurrency } from '@/types/store'

export class CurrencyHelper {
  static readonly availableCurrencies: TCurrency[] = [
    { symbol: 'U$', label: 'USD' },
    { symbol: '€', label: 'EUR' },
    { symbol: '£', label: 'GBP' },
    { symbol: 'R$', label: 'BRL' },
    { symbol: '¥', label: 'CNY' },
  ]

  static readonly defaultCurrency: TCurrency = CurrencyHelper.availableCurrencies[0]

  static readonly localeByCurrencyLabel: Record<TAvailableCurrency, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    BRL: 'pt-BR',
    CNY: 'zh-CN',
  }

  static format(input: string | number | undefined, options: TCurrencyHelperFormatOptions) {
    const {
      currency,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      showZero = true,
      approximateSymbol = false,
    } = options ?? {}

    const number = Number(input ?? 0)
    let result = '0'

    try {
      result = new Intl.NumberFormat(this.localeByCurrencyLabel[currency.label], {
        style: 'currency',
        currency: currency.label,
        minimumFractionDigits,
        maximumFractionDigits,
      })
        .format(isNaN(number) ? 0 : number)
        .replace(/^(\D+)/, '$1 ')
        .replace(/\s+/, ' ')

      if (!showZero && number === 0) result = result.replace('0', '--').replaceAll('0', '-')
    } catch (error) {
      LoggerHelper.error(error, { where: 'CurrencyHelper', operation: 'format' })
    }

    if (approximateSymbol) result = `~${result}`

    return result
  }
}
