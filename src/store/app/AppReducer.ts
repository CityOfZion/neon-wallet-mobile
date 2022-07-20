import { ReducerWrapper } from '@simpli/redux-wrapper'

import { appBus } from '~/src/app/AppBus'
import { PollingHelper } from '~/src/helpers/PollingHelper'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { AppAction, AppActionsType, AppState } from '~/src/types/reducers/app'
import { AsyncAction } from '~/src/types/reducers/root'
import { Model } from '~src/app/Model'
import { Storage } from '~src/app/Storage'
import { blockchainList, blockchainServices } from '~src/blockchain'
import { Account } from '~src/models/redux/Account'
import { App } from '~src/models/redux/App'
import { Contact } from '~src/models/redux/Contact'
import { Wallet } from '~src/models/redux/Wallet'
import { AccountsDispatcher } from '~src/store/app/dispatchers/AccountsDispatcher'
import { ContactsDispatcher } from '~src/store/app/dispatchers/ContactsDispatcher'
import { WalletsDispatcher } from '~src/store/app/dispatchers/WalletsDispatcher'

export class AppReducer extends ReducerWrapper<AppActionsType, AppState, AppAction> {
  protected readonly initialState = Model.parse<AppState>(App)

  protected readonly dispatchers = [WalletsDispatcher, AccountsDispatcher, ContactsDispatcher]

  readonly actions = {
    syncWallets: (): AsyncAction<Wallet[]> => {
      return async (dispatch, getState) => {
        const wallets = await Storage.wallets.load()

        dispatch(this.commit('SET_WALLETS', { wallets: wallets ?? [] }))

        return wallets ?? []
      }
    },

    updateAndSaveWallet: (wallet: Wallet): AsyncAction => {
      return async (dispatch, getState) => {
        const wallets = getState().app.wallets.map(it => {
          if (it.id === wallet.id) {
            wallet.securityPhrase = it.securityPhrase
            return wallet
          }

          return it
        })
        dispatch(this.commit('SET_WALLETS', { wallets }))
        await Storage.wallets.save(wallets)
      }
    },

    syncAccounts: (): AsyncAction<Account[]> => {
      return async (dispatch, getState) => {
        const accounts = await Storage.accounts.load()
        const wallets = await Storage.wallets.load()

        if (accounts && wallets) {
          accounts.forEach((it, i) => {
            it.accountType = it.getWallet(wallets)?.walletType ?? null
            it.pendingTransactions = it.pendingTransactions ?? []
            it.adaptToMultichain()
          })
          blockchainList.forEach(blockchain => {
            blockchainServices[blockchain].setAccountsPool(accounts.filter(acc => acc.blockchain === blockchain))
          })
          dispatch(this.commit('SET_ACCOUNTS', { accounts }))
        }

        return accounts ?? []
      }
    },

    updateAndSaveAccount: (account: Account): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = getState().app.accounts.map(it => {
          if (it.address === account.address) {
            return account
          }
          return it
        })

        dispatch(this.commit('SET_ACCOUNTS', { accounts }))
        await Storage.accounts.save(accounts)
      }
    },

    watchPendingTransaction: (account: Account, transactionHash: string, isClaim?: boolean): AsyncAction => {
      return async dispatch => {
        const polling = new PollingHelper()

        polling.run(async () => {
          const transaction = await blockchainServices[account.blockchain].provider.getTransaction(transactionHash)

          if (!transaction.txid || transaction.txid !== transactionHash) {
            return
          }
          await account.removePendingTransactions(transactionHash)

          dispatch(this.actions.updateAndSaveAccount(account))
          appBus.emit(isClaim ? 'claimGasEnd' : 'pendingTransactionConfirmed', account)
          polling.stop()
        })
      }
    },

    syncContacts: (): AsyncAction<Contact[]> => {
      return async (dispatch, getState) => {
        let contacts = await Storage.contacts.load()
        if (contacts) {
          contacts.forEach(contact => contact.adaptNewFormat())
          contacts = contacts.sort((c1: Contact, c2: Contact) => {
            if (!c1.name && !c2.name) {
              return 0
            }
            if (!c1.name) {
              return 1
            }
            if (!c2.name) {
              return -1
            }
            return c2.name.localeCompare(c1.name)
          })
          dispatch(this.commit('SET_CONTACTS', { contacts }))
        }
        return contacts ?? []
      }
    },

    syncBackupAlerts: (): AsyncAction => {
      return async () => {
        const wallets = await Storage.wallets.load()
        if (wallets) {
          wallets.forEach(wallet => {
            wallet.showBackupAlert = !wallet.lastBackup
          })
          await Storage.wallets.save(wallets)
        }
      }
    },

    //used just in development
    removeCache: (): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        for (const account of accounts) {
          account.pendingTransactions = []
        }

        dispatch(this.commit('SET_ACCOUNTS', { accounts }))
        await Storage.accounts.save(accounts)
      }
    },

    //used just in development
    removeAppData: (): AsyncAction => {
      return async () => {
        const accounts = (await Storage.accounts.load()) ?? []

        for (const account of accounts) {
          await SecurityHelper.removeMnemonic(account.idWallet ?? '')
          await SecurityHelper.removeWif(account.address ?? '')
        }

        await Storage.onboardingSeen.erase()
        await Storage.welcomeHidden.erase()
        await Storage.changelogHidden.erase()
        await Storage.numberOfVersions.erase()
        await Storage.hasAuthentication.erase()
        await Storage.hasAuthenticationForHardware.erase()
        await Storage.settings.erase()
        await Storage.wallets.erase()
        await Storage.accounts.erase()
        await Storage.contacts.erase()
        await Storage.wcApprovalDates.erase()

        await SecurityHelper.removePasscode()
      }
    },
  }
}
