import { HttpExclude, HttpExpose } from '@simpli/serialized-request'
import { t } from 'i18n-js'
import moment from 'moment'

import { WalletState, WalletType } from '~/src/types/reducers/wallet'
import { SecurityHelper } from '~src/helpers/SecurityHelper'
import { Account } from '~src/models/redux/Account'

@HttpExclude()
export class Wallet implements WalletState {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  lastVisitedAt: string | null = null

  @HttpExpose()
  walletType: WalletType | null = null

  @HttpExpose()
  backupStatus: 'successful' | 'unsuccessful' | 'unsuccessful_with_knowledge' = 'unsuccessful'

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

  get deserialize() {
    const { formattedLastVisitedAt, getAccounts, getMnemonic, ...deserializeWallet } = this
    const result: WalletState = deserializeWallet
    return result
  }
}
