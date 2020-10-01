import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Account} from '~src/models/redux/Account'
import {AddressDispatcher} from '~src/store/account/dispatchers/AddressDispatcher'
import {BackgroundDispatcher} from '~src/store/account/dispatchers/BackgroundDispatcher'
import {ClearStateDispatcher} from '~src/store/account/dispatchers/ClearStateDispatcher'
import {IdWalletDispatcher} from '~src/store/account/dispatchers/IdWalletDispatcher'
import {NameDispatcher} from '~src/store/account/dispatchers/NameDispatcher'
import {SrcIconDispatcher} from '~src/store/account/dispatchers/SrcIconDispatcher'

export class AccountReducer extends ReducerWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  protected readonly initialState = Model.parse<AccountState>(Account)

  protected readonly dispatchers = [
    AddressDispatcher,
    IdWalletDispatcher,
    NameDispatcher,
    SrcIconDispatcher,
    BackgroundDispatcher,
    ClearStateDispatcher,
  ]

  readonly actions = {
    selectAccount: (address: string | null) => {
      return this.commit('SET_ADDRESS', {address})
    },
    setIdWallet: (idWallet: string) => {
      return this.commit('SET_ID_WALLET', {idWallet})
    },
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setSrcIcon: (srcIcon: ImageLoadEventData | null) => {
      return this.commit('SET_SRC_ICON', {srcIcon})
    },
    setBackgroundColor: (backgroundColor: string) => {
      return this.commit('SET_BACKGROUND_COLOR', {backgroundColor})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE_ACCOUNT', {})
    },
    getFromSelection: (): SyncAction<Account> => {
      return (dispatch, getState) => {
        const accounts = getState().app.accounts
        const address = getState().account.address

        return accounts.find((it) => it.address === address) ?? new Account()
      }
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

        if (wallet && wallet.walletType === 'standard') {
          const neoAccount = await wallet.generateNeoAccount(account.index)

          if (neoAccount) {
            account.address = neoAccount.address

            await Facade.security.saveWif(account.address, neoAccount.WIF)

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
        }

        await Storage.accounts.save(accounts)
      }
    },
    importAndSave: (address: string, wif?: string): AsyncAction<Account> => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const account = plainToClass(Account, getState().account)
        account.address = address

        const wallet = account.getWallet(getState().app.wallets)

        if (wallet) {
          if (wallet.walletType === 'legacy') {
            if (wif) {
              await Facade.security.saveWif(account.address, wif)
            } else {
              throw Error('Wif not defined')
            }
          }

          accounts.push(account)
          await Storage.accounts.save(accounts)

          return account
        }

        throw Error('Something went wrong')
      }
    },
  }
}
