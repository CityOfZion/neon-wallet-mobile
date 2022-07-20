import { Currency } from '../enums/Currency'
import { Account } from '../models/redux/Account'
import { Balance, TokenBalance } from '../types/balance'
import { Exchange } from '../types/exchange'

export type BalanceConvertedToExchange = TokenBalance & {
  convertedAmount: number
}

export class BalanceHelper {
  static calculateTotalBalances(balances?: Balance[] | Balance, exchange?: Exchange, currency?: Currency) {
    if (!balances || !exchange || !currency) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances.reduce((prev, actual) => {
      const ratio = this.getExchangeRatio(actual.symbol, exchange, currency)

      return prev + (ratio ? actual.amount * ratio : 0)
    }, 0)
  }

  static getExchangeRatio(symbol: string, exchange?: Exchange, currency?: Currency): number | undefined {
    if (!exchange || !currency) return

    const exchangeSymbol = exchange[symbol]

    if (!exchangeSymbol) return

    return exchangeSymbol.to[currency]
  }

  static convertBalanceToCurrency(
    balance?: TokenBalance,
    exchange?: Exchange,
    currency?: Currency
  ): BalanceConvertedToExchange | undefined {
    if (!balance || !exchange || !currency) return

    const ratio = BalanceHelper.getExchangeRatio(balance.symbol, exchange, currency)

    return {
      ...balance,
      convertedAmount: ratio ? balance.amount * ratio : 0,
    }
  }

  static convertBalancesToCurrency(
    balances?: Balance[] | Balance,
    exchange?: Exchange,
    currency?: Currency
  ): BalanceConvertedToExchange[] | undefined {
    if (!balances || !exchange || !currency) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances
      .map(tokenBalance => this.convertBalanceToCurrency(tokenBalance, exchange, currency))
      .filter((tokenBalance): tokenBalance is BalanceConvertedToExchange => !!tokenBalance)
  }

  static getTokenBalanceBySymbol(symbol: string, balances?: Balance[] | Balance) {
    if (!balances) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances.find(tokenBalance => tokenBalance.symbol === symbol)
  }

  static getTokensBalance(balances: Balance[] | Balance) {
    return Array.isArray(balances) ? balances.flatMap(balance => balance.tokensBalances) : balances.tokensBalances
  }

  static getBalanceByAccount(account: Account, balances?: Balance[]) {
    if (!balances) return

    return balances.find(balance => balance.address === account.address)
  }
}
