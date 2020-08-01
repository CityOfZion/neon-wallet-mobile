import {HttpExclude, HttpExpose} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {TokenBalance} from '~src/models/TokenBalance'
import {Account} from '~src/models/redux/Account'

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
  walletType: 'standard' | 'watch' | 'legacy' | null = null

  // Do not expose security phrase
  @HttpExclude()
  securityPhrase: string | null = null

  previousAssets: TokenBalance = new TokenBalance()
  currentAssets: TokenBalance = new TokenBalance()

  get formattedLastVisitedAt() {
    if (!moment(this.lastVisitedAt).isValid()) return null

    return Facade.t('screens.listWallets.changeSinceLastVisit', {
      // TODO: translate date format
      date: moment(this.lastVisitedAt).format('HH:mm - MMM/DD/YYYY'),
    })
  }

  get previousValue() {
    if (!this.currentAssets.assets.length) return 0

    return this.previousAssets.totalValue
  }

  get currentValue() {
    if (!this.currentAssets.assets.length) return 0

    return this.currentAssets.totalValue
  }

  get securityWords() {
    return this.securityPhrase?.split(' ') ?? []
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
}
