import { cloneDeep } from 'lodash'

import { Account } from '../store/account/Account'
import { TBlockchainServiceKey } from '../types/blockchain'
import { Balance, TokenBalance, MultiExchange } from '../types/query'

export type BalanceConvertedToExchange = TokenBalance & {
  convertedAmount: number
}

export class BalanceHelper {
  static calculateTotalBalances(balances?: Balance[] | Balance, multiExchange?: MultiExchange) {
    if (!balances || !multiExchange) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances.reduce((prev, actual) => {
      const ratio = this.getExchangeRatio(actual.token.hash, actual.blockchain, multiExchange)

      return prev + actual.amountNumber * ratio
    }, 0)
  }

  static getExchangeRatio(hash: string, blockchain: TBlockchainServiceKey, multiExchange?: MultiExchange): number {
    if (!multiExchange) return 0

    const blockchainExchange = multiExchange[blockchain]
    if (!blockchainExchange) return 0

    const exchange = blockchainExchange.find(exchange => exchange.hash === hash)

    return exchange?.price ?? 0
  }

  static convertBalanceToCurrency(
    balance?: TokenBalance,
    multiExchange?: MultiExchange
  ): BalanceConvertedToExchange | undefined {
    if (!balance || !multiExchange) return

    const ratio = this.getExchangeRatio(balance.token.hash, balance.blockchain, multiExchange)

    return {
      ...balance,
      convertedAmount: balance.amountNumber * ratio,
    }
  }

  static convertBalancesToCurrency(
    balances?: Balance[] | Balance,
    multiExchange?: MultiExchange
  ): BalanceConvertedToExchange[] | undefined {
    if (!balances || !multiExchange) return

    const tokensBalances = this.getTokensBalance(balances)

    const tokenBalanceWithoutRepeated = cloneDeep(tokensBalances).reduce<TokenBalance[]>((prev, current) => {
      const tokenBalance = prev.find(tokenBalance => tokenBalance.token.hash === current.token.hash)

      if (tokenBalance) {
        tokenBalance.amount += current.amount
      } else {
        prev.push(current)
      }

      return prev
    }, [])

    return tokenBalanceWithoutRepeated
      .map(tokenBalance => this.convertBalanceToCurrency(tokenBalance, multiExchange))
      .filter((tokenBalance): tokenBalance is BalanceConvertedToExchange => !!tokenBalance)
  }

  static getTokenBalanceByHash(hash: string, balances?: Balance[] | Balance) {
    if (!balances) return

    const tokensBalances = this.getTokensBalance(balances)

    return tokensBalances.find(tokenBalance => tokenBalance.token.hash === hash)
  }

  static getTokensBalance(balances: Balance[] | Balance) {
    return Array.isArray(balances) ? balances.flatMap(balance => balance.tokensBalances) : balances.tokensBalances
  }

  static getBalanceByAccount(account: Account, balances?: Balance[]) {
    if (!balances) return

    return balances.find(balance => balance.address === account.address)
  }

  static hasSomeBalance(balances?: Balance[] | Balance) {
    if (!balances) return false

    const tokensBalances = BalanceHelper.getTokensBalance(balances)

    return tokensBalances.some(tokenBalance => tokenBalance.amountNumber > 0)
  }
}
