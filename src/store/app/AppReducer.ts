import {ReducerWrapper} from '@simpli/redux-wrapper'
import {Request} from '@simpli/serialized-request'
import {plainToClass} from 'class-transformer'
import {map, mapValues, update} from 'lodash'
import {showMessage} from 'react-native-flash-message'
import {
  checkInternetConnection,
  offlineActionCreators,
} from 'react-native-offline'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {Wallet} from '~src/models/redux/Wallet'
import {AccountPreCreatedDispatcher} from '~src/store/app/dispatchers/AccountPreCreatedDispatcher'
import {AccountsDispatcher} from '~src/store/app/dispatchers/AccountsDispatcher'
import {ContactsDispatcher} from '~src/store/app/dispatchers/ContactsDispatcher'
import {ExchangeDispatcher} from '~src/store/app/dispatchers/ExchangeDispatcher'
import {NodesDispatcher} from '~src/store/app/dispatchers/NodesDispatcher'
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
    TokensDispatcher,
    NodesDispatcher,
    WalletsDispatcher,
    AccountsDispatcher,
    ContactsDispatcher,
    AccountPreCreatedDispatcher,
  ]

  readonly actions = {
    createPreAccount: (): AsyncAction => {
      return async (dispatch, getState) => {
        const account = new Account()
        const accountsPool = getState().app.accounts
        account.idWallet = getState().wallet.id
        const indexes = account
          .getAccountsWithSameWallet(accountsPool)
          .map((it) => it.index ?? 0)

        const wallet = new Wallet()
        wallet.id = getState().wallet.id
        const index = indexes.length ? Math.max(...indexes) + 1 : 0

        const neoAccount = (await wallet.generateNeoAccount(index)) as
          | Account
          | null
          | undefined

        dispatch(
          this.commit('SET_PRE_ACCOUNT_CREATE', {preAccount: neoAccount})
        )
        if (neoAccount) {
          await Storage.preAccount.save(plainToClass(Account, neoAccount))
        }
      }
    },
    syncPreAccount: (): AsyncAction<Account | null> => {
      return async (dispatch, getState) => {
        const preAccount = await Storage.preAccount.load()
        dispatch(this.commit('SET_PRE_ACCOUNT_CREATE', {preAccount}))
        return preAccount
      }
    },
    syncExchange: (): AsyncAction<Exchange> => {
      return async (dispatch, getState) => {
        const exchange = await Storage.exchange.load()
        if (exchange) {
          dispatch(this.commit('SET_EXCHANGE', {exchange}))
          return exchange
        }
        return {} as Exchange
      }
    },

    fetchExchange: (): AsyncAction => {
      return async (dispatch) => {
        try {
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

          await Storage.exchange.save(exchange)
        } catch (error) {
          console.log(error)
          throw new Error('Problema para sincronizar exchange')
        }
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
        const tokenAssets = await Storage.tokenAssets.load()

        if (tokenAssets) {
          dispatch(this.commit('SET_TOKENS', {tokens: tokenAssets}))
          return tokenAssets
        } else {
          const tokensMainNet = Facade.app.tokensMainNet
          const neo = new TokenAsset('NEO', 'NEO', Facade.app.neoHash)
          const gas = new TokenAsset('GAS', 'GAS', Facade.app.gasHash)
          const tokens = [neo, gas, ...tokenToAsset(tokensMainNet)]
          dispatch(this.commit('SET_TOKENS', {tokens}))

          return tokens
        }
      }
    },

    fetchTokens: (): AsyncAction => {
      const tokenToAsset = (response: TokenResponse): TokenAsset[] => {
        return Facade.lodash.map(
          response,
          (it) => new TokenAsset(it.companyName, it.symbol, it.networks[1].hash)
        )
      }
      return async (dispatch) => {
        let response: TokenResponse

        try {
          response = await Request.get(
            `https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json?timestamp=${new Date().getTime()}`
          )
            .name('getTokens')
            .as<TokenResponse>()
            .getData()

          const neo = new TokenAsset('NEO', 'NEO', Facade.app.neoHash)
          const gas = new TokenAsset('GAS', 'GAS', Facade.app.gasHash)

          const tokens = [neo, gas, ...tokenToAsset(response)]
          await Storage.tokenAssets.save(tokens)
        } catch (error) {
          console.log(error)
          throw new Error('Problema para consultar token list')
        }
      }
    },

    syncNodes: (): AsyncAction<NeoNode[]> => {
      return async (dispatch, getState) => {
        let nodes: NeoNode[] = []
        nodes = (await Storage.neoNodes.load()) ?? []
        dispatch(this.commit('SET_NODES', {nodes}))
        return nodes
      }
    },

    fetchNodes: (): AsyncAction => {
      return async (dispatch) => {
        try {
          let nodes: NeoNode[] = []
          nodes = await Facade.app.blockchainDataProvider.getAllNodes()
          await Storage.neoNodes.save(nodes)
        } catch (error) {
          console.log(error)
          throw new Error('não carregou os nodes')
        }
      }
    },

    syncWallets: (): AsyncAction<Wallet[]> => {
      return async (dispatch, getState) => {
        const wallets = await Storage.wallets.load()

        // get the balance cache in order to avoid to recalculate
        const walletsTokenAssets = getState().app.wallets.map(
          (it) => it.tokenAssets
        )

        if (wallets) {
          wallets.forEach((it, i) => {
            it.tokenAssets = walletsTokenAssets[i] ?? []
          })

          dispatch(this.commit('SET_WALLETS', {wallets}))
        }

        return wallets ?? []
      }
    },

    updateAndSaveWallet: (wallet: Wallet): AsyncAction => {
      return async (dispatch, getState) => {
        const wallets = getState().app.wallets.map((it) => {
          if (it.id === wallet.id) {
            wallet.securityPhrase = it.securityPhrase
            return wallet
          }

          return it
        })
        dispatch(this.commit('SET_WALLETS', {wallets}))
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
            it.transactions = it.transactions ?? []
            it.pendingTransactions = it.pendingTransactions ?? []
          })

          dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        }

        return accounts ?? []
      }
    },

    updateAndSaveAccount: (account: Account): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = getState().app.accounts.map((it) => {
          if (it.address === account.address) return account
          return it
        })

        dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        await Storage.accounts.save(accounts)
      }
    },

    syncTokenAssetsByAddress: (address: string): AsyncAction => {
      return async (dispatch, getState) => {
        const {accounts, wallets} = getState().app

        const account = accounts.find((it) => it.address === address)

        if (account) {
          await account.populateTokenAssets()

          const wallet = account.getWallet(wallets)
          if (wallet) {
            wallet.populateTokenAssets(accounts)
          }
        }
      }
    },

    syncTokenAssets: (): AsyncAction => {
      return async (dispatch, getState) => {
        const {wallets} = getState().app
        const accounts = await Storage.accounts.load()

        if (accounts) {
          wallets.map((it) => it.populateTokenAssets(accounts))
        }
      }
    },

    fetchBalanceAccounts: (): AsyncAction => {
      interface IBalanceAccounts {
        address: string
        tokens: TokenAsset[]
      }
      return async (dispatch, getState) => {
        try {
          const {accounts} = getState().app
          const balanceAccounts = await Promise.all(
            accounts
              .map(async (acc) => {
                const {address} = acc
                if (address) {
                  const response = await Account.fetchTokenAssets(
                    address as string
                  )
                  return {address, tokens: response}
                }
              })
              .filter((res) => res !== undefined)
          )

          const updatedAccounts = balanceAccounts
            .map((balanceAccount) => {
              const {address, tokens} = balanceAccount as IBalanceAccounts
              const updatedAccount = accounts.find(
                (acc) => acc.address === address
              ) as Account
              updatedAccount.tokenAssets = tokens
              return updatedAccount
            })
            .filter((acc) => acc !== undefined)

          await Storage.accounts.save(updatedAccounts)
        } catch (error) {
          console.log(error)
          throw new Error('Problema para consultar os balances')
        }
      }
    },

    syncContacts: (): AsyncAction<Contact[]> => {
      return async (dispatch, getState) => {
        let contacts = await Storage.contacts.load()
        if (contacts) {
          contacts.forEach((contact) => contact.adaptNewFormat())
          contacts = contacts.sort((c1: Contact, c2: Contact) => {
            if (!c1.name && !c2.name) return 0
            if (!c1.name) return 1
            if (!c2.name) return -1
            return c2.name.localeCompare(c1.name)
          })
          dispatch(this.commit('SET_CONTACTS', {contacts}))
        }
        return contacts ?? []
      }
    },

    syncBackupAlerts: (): AsyncAction => {
      return async () => {
        const wallets = await Storage.wallets.load()
        if (wallets) {
          wallets.forEach((wallet) => {
            wallet.showBackupAlert = !wallet.lastBackup
          })
          await Storage.wallets.save(wallets)
        }
      }
    },

    syncPendingTransactions: (): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = getState().app.accounts
        const wallets = getState().app.wallets
        const removedSenderTx: SenderTransaction[] = []

        for (const account of accounts) {
          let hasAccountChanged = false

          const senderTxs = account.flattedPendingTransactions

          for (const senderTx of senderTxs) {
            if (senderTx.transactionHash) {
              try {
                const request = Facade.app.blockchainDataProvider
                const confirmedTx = await request.getTransaction(
                  senderTx.transactionHash
                )
                const index = senderTxs.findIndex(
                  (it) => it.transactionHash === confirmedTx.txid
                )
                if (index >= 0) {
                  if (senderTxs[index].senderAddress === 'claim') {
                    showMessage({
                      message: Facade.t('toast.gasClaimSuccess'),
                      type: 'success',
                    })
                    Facade.bus.emit('claimGasEnd', senderTxs[index])
                    Facade.bus.emit(
                      'removePendingUnclaimedGasTransaction',
                      senderTxs[index]
                    )
                  } else {
                    const lastTransaction = senderTxs[index]
                    showMessage({
                      message: Facade.t('toast.transactionCompleted'),
                      type: 'success',
                      onPress: () => {
                        Facade.bus.emit(
                          'navigateTransactionDetails',
                          lastTransaction
                        )
                      },
                    })
                    Facade.bus.emit('transactionEnd', senderTxs[index])
                  }

                  hasAccountChanged = true
                  removedSenderTx.push(senderTxs[index])
                  senderTxs.splice(index, 1)
                }
              } catch (e) {
                /** TODO #665 GITHUB*/
              }
            }
          }

          if (hasAccountChanged) {
            account.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(
              senderTxs
            )
          }
        }
        await Storage.accounts.save(accounts)
        dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        this.actions.syncWallets()

        if (removedSenderTx.length) {
          Facade.bus.emit('removePendingTransactions', removedSenderTx)
        }
      }
    },

    syncNetworkStatus: (): AsyncAction => {
      return async (dispatch, getState) => {
        setInterval(async () => {
          const isConnected = await checkInternetConnection()
          const {connectionChange} = offlineActionCreators
          dispatch(connectionChange(isConnected))
        }, 2000)
      }
    },

    removeCache: (): AsyncAction => {
      return async (dispatch, getState) => {
        const accounts = (await Storage.accounts.load()) ?? []

        for (const account of accounts) {
          account.transactions = []
          account.pendingTransactions = []
        }

        dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        await Storage.accounts.save(accounts)
      }
    },

    removeAppData: (): AsyncAction => {
      return async () => {
        const accounts = (await Storage.accounts.load()) ?? []

        for (const account of accounts) {
          await Facade.security.removeMnemonic(account.idWallet ?? '')
          await Facade.security.removeWif(account.address ?? '')
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

        await Facade.security.removePasscode()
      }
    },
  }
}
