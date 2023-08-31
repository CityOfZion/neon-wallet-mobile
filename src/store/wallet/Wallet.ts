import { t } from 'i18n-js'
import moment from 'moment'

import { Account } from '../account/Account'

import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { WalletBackupStatus, WalletState, WalletType } from '~/src/types/store'

export class Wallet implements WalletState {
  id: string
  name: string
  lastVisitedAt?: string
  walletType: WalletType
  backupStatus: WalletBackupStatus

  constructor(data: WalletState) {
    this.id = data.id
    this.name = data.name
    this.walletType = data.walletType
    this.backupStatus = data.backupStatus
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

  get deserialize() {
    const { formattedLastVisitedAt, getAccounts, getMnemonic, ...deserializeWallet } = this
    const result: WalletState = deserializeWallet
    return result
  }
}
