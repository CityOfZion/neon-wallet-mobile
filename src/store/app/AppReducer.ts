import {ReducerWrapper} from '@simpli/redux-wrapper'
import {Request} from '@simpli/serialized-request'
import {map, mapValues} from 'lodash'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Wallet} from '~src/models/redux/Wallet'
import {AccountsDispatcher} from '~src/store/app/dispatchers/AccountsDispatcher'
import {ExchangeDispatcher} from '~src/store/app/dispatchers/ExchangeDispatcher'
import {WalletsDispatcher} from '~src/store/app/dispatchers/WalletsDispatcher'
import {Exchange, ExchangeResponse} from '~src/types/exchange'

export class AppReducer extends ReducerWrapper<AppType, AppState, AppAction> {
  protected readonly initialState = Model.parse<AppState>(App)

  protected readonly dispatchers = [
    ExchangeDispatcher,
    WalletsDispatcher,
    AccountsDispatcher,
  ]

  readonly actions = {
    syncExchange: (): AsyncAction<Exchange> => {
      return async (dispatch, getState) => {
        const assets = Facade.app.assets.split(',')
        const otherAssets = map(Facade.app.tokensMainNet, (it) => it.symbol)

        const params = {
          fsyms: assets.concat(otherAssets).join(','),
          tsyms: Facade.app.currencies,
        }

        const response = await Request.get(
          'https://min-api.cryptocompare.com/data/pricemultifull',
          {params}
        )
          .name('syncExchange')
          .as<ExchangeResponse>()
          .getData()

        const exchange: Exchange = mapValues(response.RAW, (symbolRef) => {
          const symbolRefMap = mapValues(
            symbolRef,
            (symbolToUse) => symbolToUse.PRICE
          )

          return {
            to: symbolRefMap,
          }
        })

        dispatch(this.commit('SET_EXCHANGE', {exchange}))

        return exchange
      }
    },

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
