import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'
import {ImageLoadEventData} from 'react-native'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {AddressDispatcher} from '~src/store/account/dispatchers/AddressDispatcher'
import {BackgroundDispatcher} from '~src/store/account/dispatchers/BackgroundDispatcher'
import {BalanceDispatcher} from '~src/store/account/dispatchers/BalanceDispatcher'
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
    BalanceDispatcher,
    CurrencyDispatcher,
    AddressDispatcher,
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
    setBalance: (balance: number) => {
      return this.commit('SET_BALANCE', {balance})
    },
    setCurrency: (currency: Currency) => {
      return this.commit('SET_CURRENCY', {currency})
    },
    setAddress: (address: string) => {
      return this.commit('SET_ADDRESS', {address})
    },
    setBackgroundColor: (backgroundColor: string) => {
      return this.commit('SET_BACKGROUND_COLOR', {backgroundColor})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    createAndSave: (): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const account = plainToClass(Account, getState().account)
        accounts.push(account)

        await Storage.accounts.save(accounts)
      }
    },
  }
}
