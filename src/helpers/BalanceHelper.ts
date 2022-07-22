import { BlockchainServiceKey } from '../blockchain'
import { Account } from '../models/redux/Account'
import { Balance, TokenBalance, MultiExchange } from '../types/query'

export type BalanceConvertedToExchange = TokenBalance & {
  convertedAmount: number
}

export class BalanceHelper {
  static calculateTotalBalances(balances?: Balance[] | Balance, multiExchange?: MultiExchange) {
    if (!balances || !multiExchange) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances.reduce((prev, actual) => {
      const ratio = this.getExchangeRatio(actual.symbol, actual.blockchain, multiExchange)

      return prev + (ratio ? actual.amount * ratio : 0)
    }, 0)
  }

  static getExchangeRatio(
    symbol: string,
    blockchain: BlockchainServiceKey,
    multiExchange?: MultiExchange
  ): number | undefined {
    if (!multiExchange) return

    const exchange = multiExchange[blockchain].find(exchange => exchange.symbol === symbol)

    return exchange?.amount
  }

  static convertBalanceToCurrency(
    balance?: TokenBalance,
    multiExchange?: MultiExchange
  ): BalanceConvertedToExchange | undefined {
    if (!balance || !multiExchange) return

    const ratio = this.getExchangeRatio(balance.symbol, balance.blockchain, multiExchange)

    return {
      ...balance,
      convertedAmount: ratio ? balance.amount * ratio : 0,
    }
  }

  static convertBalancesToCurrency(
    balances?: Balance[] | Balance,
    multiExchange?: MultiExchange
  ): BalanceConvertedToExchange[] | undefined {
    if (!balances || !multiExchange) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances
      .map(tokenBalance => this.convertBalanceToCurrency(tokenBalance, multiExchange))
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
