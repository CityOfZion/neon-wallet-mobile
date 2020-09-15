import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Exchange} from '~src/types/exchange'

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
    return Facade.lodash.sumBy(this.tokenAssets, (it) => it.amount ?? 0) > 0
  }

  get formattedLastVisitedAt() {
    if (!moment(this.lastVisitedAt).isValid()) return null

    return Facade.t('screens.listWallets.changeSinceLastVisit', {
      // TODO: translate date format
      date: moment(this.lastVisitedAt).format('HH:mm - MMM/DD/YYYY'),
    })
  }

  getAccounts(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.id)
  }

  async getMnemonic() {
    return (await Facade.security.loadMnemonic(this.id ?? '')) ?? null
  }

  async getKeychain() {
    const mnemonic = await this.getMnemonic()
    if (!mnemonic) return null
    return Facade.asteroid.getKeychainFromMnemonic(mnemonic)
  }

  async generateWif(index: number) {
    const mnemonic = await this.getMnemonic()
    if (!mnemonic) return null
    return Facade.asteroid.generateWif(mnemonic, index)
  }

  async generateNeoAccount(index: number) {
    const mnemonic = await this.getMnemonic()
    if (!mnemonic) return null
    return Facade.asteroid.generateNeoAccount(mnemonic, index)
  }

  populateTokenAssets(pool: Account[]) {
    const walletAccounts = this.getAccounts(pool)
    this.tokenAssets = Account.generateTokenAssetsFromPool(walletAccounts)
  }

  calculateBalance(currency: Currency, exchange: Exchange) {
    return Facade.lodash.sumBy(
      this.tokenAssets,
      (it) => it.exchangeToken(currency, exchange) ?? 0
    )
  }

  calculateBalanceFormatted(
    currency: Currency,
    language: Lang,
    exchange: Exchange
  ) {
    const balance = this.calculateBalance(currency, exchange)
    return Facade.filter.currency(balance, currency, language)
  }
}
