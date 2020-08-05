import {ReducerWrapper} from '@simpli/redux-wrapper'
import {Request} from '@simpli/serialized-request'
import {map, mapValues} from 'lodash'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Contact} from '~src/models/redux/Contact'
import {Wallet} from '~src/models/redux/Wallet'
import {AccountsDispatcher} from '~src/store/app/dispatchers/AccountsDispatcher'
import {ContactsDispatcher} from '~src/store/app/dispatchers/ContactsDispatcher'
import {ExchangeDispatcher} from '~src/store/app/dispatchers/ExchangeDispatcher'
import {TokensDispatcher} from '~src/store/app/dispatchers/TokensDispatcher'
import {WalletsDispatcher} from '~src/store/app/dispatchers/WalletsDispatcher'
import {Exchange, ExchangeResponse} from '~src/types/exchange'
import {TokenResponse} from '~src/types/token'

export class AppReducer extends ReducerWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  protected readonly initialState = Model.parse<AppState>(App)

  protected readonly dispatchers = [
    ExchangeDispatcher,
    WalletsDispatcher,
    AccountsDispatcher,
    ContactsDispatcher,
    TokensDispatcher,
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

    syncTokens: (): AsyncAction<TokenAsset[]> => {
      const tokenToAsset = (response: TokenResponse): TokenAsset[] => {
        return Facade.lodash.map(
          response,
          (it) => new TokenAsset(it.companyName, it.symbol, it.networks[1].hash)
        )
      }

      return async (dispatch, getState) => {
        let response: TokenResponse

        try {
          response = await Request.get(
            `https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json?timestamp=${new Date().getTime()}`
          )
            .name('getTokens')
            .as<TokenResponse>()
            .getData()
        } catch {
          response = Facade.app.tokensMainNet
        }

        const tokens = tokenToAsset(response)

        dispatch(this.commit('SET_TOKENS', {tokens}))

        return tokens
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
          const wallets = await Storage.wallets.load()
          if (wallets) {
            accounts.forEach((it) => {
              it.accountType = it.getWallet(wallets)?.walletType ?? null
            })
          }
          dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        }

        return accounts ?? []
      }
    },

    syncContacts: (): AsyncAction<Contact[]> => {
      return async (dispatch, getState) => {
        let contacts = await Storage.contacts.load()
        if (contacts) {
          contacts = contacts.sort((c1: Contact, c2: Contact) => {
            return c1.name.localeCompare(c2.name)
          })
          dispatch(this.commit('SET_CONTACTS', {contacts}))
        }
        return contacts ?? []
      }
    },
  }
}
