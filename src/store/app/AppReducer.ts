import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Wallet} from '~src/models/redux/Wallet'
import {AccountsDispatcher} from '~src/store/app/dispatchers/AccountsDispatcher'
import {WalletsDispatcher} from '~src/store/app/dispatchers/WalletsDispatcher'

export class AppReducer extends ReducerWrapper<AppType, AppState, AppAction> {
  protected readonly initialState = Model.parse<AppState>(App)

  protected readonly dispatchers = [WalletsDispatcher, AccountsDispatcher]

  readonly actions = {
    syncWallets: (): AsyncAction<Wallet[]> => {
      return async (dispatch, getState) => {
        const wallets = await Storage.wallets.load()
        if (wallets) {
          dispatch(this.commit('SET_WALLETS', {wallets}))
        }

        return wallets ?? []
      }
    },

    saveWallets: (): AsyncAction => {
      return async (dispatch, getState) => {
        const {wallets} = getState().app
        await Storage.wallets.save(wallets)
      }
    },

    updateWallet: (wallet: Wallet): AsyncAction => {
      return async (dispatch, getState) => {
        const wallets = getState().app.wallets.map((it) => {
          if (it.id === wallet.id) {
            wallet.securityPhrase = it.securityPhrase
            return wallet
          }

          return it
        })

        dispatch(this.commit('SET_WALLETS', {wallets}))
      }
    },

    syncAccounts: (): AsyncAction<Account[]> => {
      return async (dispatch, getState) => {
        const accounts = await Storage.accounts.load()
        if (accounts) {
          dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        }

        return accounts ?? []
      }
    },
  }
}
