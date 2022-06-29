import { HttpExclude, HttpExpose, ResponseSerialize } from '@simpli/serialized-request'
import { t } from 'i18n-js'
import _ from 'lodash'
import moment, { Moment } from 'moment'

import { Exchange } from '~/src/types/exchange'
import { WalletState, WalletType } from '~/src/types/reducers/wallet'
import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { SecurityHelper } from '~src/helpers/SecurityHelper'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { SenderTransaction } from '~src/models/redux/SenderTransaction'

@HttpExclude()
export class Wallet implements WalletState {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  passphrase: string | null = null

  @HttpExpose()
  lastVisitedAt: string | null = null

  @HttpExpose()
  lastBackup: string | null = null

  @HttpExpose()
  showBackupAlert: boolean = false

  // Balance of tokens
  @ResponseSerialize(TokenAsset)
  tokenAssets: TokenAsset[] = []

  @HttpExpose()
  walletType: WalletType | null = null

  // Do not expose security phrase
  @HttpExclude()
  securityPhrase: string | null = null

  get hasFunds() {
    return _.sumBy(this.tokenAssets, it => Number(it.amount) ?? 0) > 0
  }

  get isInactive() {
    return !this.hasFunds && this.walletType === 'standard'
  }

  get formattedLastVisitedAt() {
    if (!moment(this.lastVisitedAt).isValid()) {
      return null
    }

    return t('screens.listWallets.changeSinceLastVisit', {
      // TODO: translate date format
      date: moment(this.lastVisitedAt).format('HH:mm - MMM/DD/YYYY'),
    })
  }

  getAccounts(pool: Account[]) {
    return pool.filter(it => it.idWallet === this.id)
  }

  async getMnemonic() {
    return (await SecurityHelper.loadMnemonic(this.id ?? '')) ?? null
  }

  async getBalanceFromPastExchange(currency: Currency, date: Moment) {
    const txs: SenderTransaction[] = []
    const promises: Promise<void>[] = []

    for (const token of this.tokenAssets) {
      const senderTx = new SenderTransaction()
      senderTx.sentAt = date.format()
      senderTx.token = UtilsHelper.clone(token)
      promises.push(senderTx.populateExchange())
      txs.push(senderTx)
    }

    await Promise.all(promises)

    const balances = txs.map(it => it.token?.exchangeToken(currency) ?? 0)
    return _.sum(balances)
  }

  async getBalanceVariationFromPastExchange(currency: Currency, date: Moment, exchange: Exchange) {
    const pastBalance = await this.getBalanceFromPastExchange(currency, date)
    const balance = this.calculateBalance(currency, exchange)

    return balance - pastBalance
  }

  populateTokenAssets(pool: Account[]) {
    const walletAccounts = this.getAccounts(pool)
    this.tokenAssets = Account.generateTokenAssetsFromPool(walletAccounts)
  }

  async getTransactions(pool: Account[], tokensPool: TokenAsset[], currentPage?: number) {
    const walletAccounts = this.getAccounts(pool)
    const promises = walletAccounts.map(it => it.populateTransactions(tokensPool, currentPage))

    await Promise.all(promises)

    return walletAccounts.flatMap(it => it.flattedTransactions)
  }

  calculateBalance(currency: Currency, exchange: Exchange) {
    return _.sumBy(this.tokenAssets, it => it.exchangeToken(currency, exchange) ?? 0)
  }

  calculateBalanceFormatted(currency: Currency, language: Lang, exchange: Exchange, balanceToFormat?: number) {
    const balance = balanceToFormat ?? this.calculateBalance(currency, exchange)

    const fractionDigits = balance > 0 ? 0 : undefined

    return FilterHelper.currency(balance, currency, language, fractionDigits, fractionDigits)
  }
}
