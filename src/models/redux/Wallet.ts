import {HttpExclude, HttpExpose} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {AsteroidHelper} from '~src/helpers/AsteroidHelper'
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
  securityPhrase: string | null = null

  @HttpExpose()
  lastVisitedAt: string | null = null

  @HttpExpose()
  walletType: 'standard' | 'watch' | 'legacy' | null = null

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

  get keychain() {
    const {securityPhrase} = this
    if (!securityPhrase) return null
    return AsteroidHelper.getKeychainFromMnemonicWords(securityPhrase)
  }

  getAccounts(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.id)
  }

  generateWif(index: number) {
    const {securityPhrase} = this
    if (!securityPhrase) return null
    return AsteroidHelper.generateWif(securityPhrase, index)
  }

  generateNeoAccount(index: number) {
    const {securityPhrase} = this
    if (!securityPhrase) return null

    return AsteroidHelper.generateNeoAccount(securityPhrase, index)
  }
}
