import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'
import {ImageLoadEventData} from 'react-native'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {BackgroundDispatcher} from '~src/store/account/dispatchers/BackgroundDispatcher'
import {ClearStateDispatcher} from '~src/store/account/dispatchers/ClearStateDispatcher'
import {CurrencyDispatcher} from '~src/store/account/dispatchers/CurrencyDispatcher'
import {IdWalletDispatcher} from '~src/store/account/dispatchers/IdWalletDispatcher'
import {NameDispatcher} from '~src/store/account/dispatchers/NameDispatcher'
import {SrcIconDispatcher} from '~src/store/account/dispatchers/SrcIconDispatcher'

export class AccountReducer extends ReducerWrapper<
  AccountType,
  AccountState,
  AccountAction
> {
  protected readonly initialState = Model.parse<AccountState>(Account)

  protected readonly dispatchers = [
    IdWalletDispatcher,
    NameDispatcher,
    SrcIconDispatcher,
    CurrencyDispatcher,
    BackgroundDispatcher,
    ClearStateDispatcher,
  ]

  readonly actions = {
    setIdWallet: (idWallet: string) => {
      return this.commit('SET_ID_WALLET', {idWallet})
    },
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setSrcIcon: (srcIcon: ImageLoadEventData | null) => {
      return this.commit('SET_SRC_ICON', {srcIcon})
    },
    setCurrency: (currency: Currency) => {
      return this.commit('SET_CURRENCY', {currency})
    },
    setBackgroundColor: (backgroundColor: string) => {
      return this.commit('SET_BACKGROUND_COLOR', {backgroundColor})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const account = plainToClass(Account, getState().account)
        const wallet = account.getWallet(getState().app.wallets)

        const indexes = account
          .getAccountsWithSameWallet(getState().app.accounts)
          .map((it) => it.index ?? 0)

        account.index = indexes.length ? Math.max(...indexes) + 1 : 0

        if (wallet) {
          const neoAccount = wallet.generateNeoAccount(account.index)

          if (neoAccount) {
            account.address = neoAccount.address

            accounts.push(account)

            await Storage.accounts.save(accounts)

            return account.address
          }
        }

        throw Error('Something went wrong')
      }
    },
    updateAndSave: (address: string): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const edited = plainToClass(Account, getState().account)

        const account = accounts.find(
          (acc) => acc.address && acc.address === address
        )

        if (account) {
          account.name = edited.name
          account.backgroundColor = edited.backgroundColor
          account.currency = edited.currency
        }

        await Storage.accounts.save(accounts)
      }
    },
    deleteAndSave: (): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const removed = plainToClass(Account, getState().account)
        const index = accounts.findIndex(
          (acc) => acc.address && acc.address === removed.address
        )

        if (index >= 0) {
          accounts.splice(index, 1)
        }

        await Storage.accounts.save(accounts)
      }
    },
  }
}
