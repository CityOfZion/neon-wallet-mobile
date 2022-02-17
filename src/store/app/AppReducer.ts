import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'
import i18n from 'i18n-js'
import _ from 'lodash'
import {showMessage} from 'react-native-flash-message'
import {
  checkInternetConnection,
  offlineActionCreators,
} from 'react-native-offline'

import {appBus} from '~/src/app/AppBus'
import {applicationConfig} from '~/src/config/ApplicationConfig'
import {AsteroidHelper} from '~/src/helpers/AsteroidHelper'
import {SecurityHelper} from '~/src/helpers/SecurityHelper'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {Node} from '~/src/models/Node'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {
  BlockchainServiceKey,
  blockchainList,
  blockchainServices,
} from '~src/blockchain'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {Wallet} from '~src/models/redux/Wallet'
import {getRandomColor} from '~src/scenes/CustomizeAccount'
import {AccountsDispatcher} from '~src/store/app/dispatchers/AccountsDispatcher'
import {ContactsDispatcher} from '~src/store/app/dispatchers/ContactsDispatcher'
import {ExchangeDispatcher} from '~src/store/app/dispatchers/ExchangeDispatcher'
import {NodesDispatcher} from '~src/store/app/dispatchers/NodesDispatcher'
import {TokensDispatcher} from '~src/store/app/dispatchers/TokensDispatcher'
import {WalletsDispatcher} from '~src/store/app/dispatchers/WalletsDispatcher'
import {
  Exchange,
  ExchangeResponse,
  MultichainExchange,
} from '~src/types/exchange'
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
  ]

  readonly actions = {
    syncExchange: (): AsyncAction<MultichainExchange> => {
      return async (dispatch, getState) => {
        const exchange = await Storage.exchange.load()
        const multichainExchange =
          (await Storage.multichainExchange.load()) ??
          ({} as MultichainExchange)
        if (!Object.keys(multichainExchange).length && exchange) {
          multichainExchange['neoLegacy'] = exchange
        }
        dispatch(this.commit('SET_EXCHANGE', {exchange: multichainExchange}))
        return multichainExchange
      }
    },

    fetchExchange: (): AsyncAction => {
      const tokenToAsset = (
        response: TokenResponse,
        blockchainName: BlockchainServiceKey
      ): TokenAsset[] => {
        return _.map(
          response,
          (it) =>
            new TokenAsset(
              it.companyName,
              it.symbol,
              it.networks[1].hash,
              blockchainName,
              it.networks[1].decimals
            )
        )
      }

      return async (dispatch) => {
        try {
          let tokenList = (await Storage.tokenAssets.load()) ?? []
          if (tokenList.length < 1) {
            const assetsBlockchain: TokenAsset[] = []
            let tokensBlockchain: TokenAsset[] = []
            await Promise.all(
              blockchainList.map(async (blockchainName) => {
                const {assets, provider} = blockchainServices[blockchainName]
                const tokenListResponse = await provider.getTokenList()
                assets.forEach(({hash, name, symbol, decimals}) => {
                  assetsBlockchain.push(
                    new TokenAsset(name, symbol, hash, blockchainName, decimals)
                  )
                  tokensBlockchain = tokenToAsset(
                    tokenListResponse,
                    blockchainName
                  )
                })
              })
            )
            tokenList = [...tokensBlockchain, ...assetsBlockchain]
          }

          const result: MultichainExchange = {} as MultichainExchange
          await Promise.all(
            blockchainList.map(async (blockchainName) => {
              const {provider} = blockchainServices[blockchainName]
              const tokenAssetSymbols = tokenList
                .filter((token) => token.blockchain === blockchainName)
                .map((token) => token.symbol)

              result[blockchainName] = await provider.getExchangeData({
                tokenAssetSymbols,
                currencies: applicationConfig.currencies,
              })
            })
          )
          await Storage.multichainExchange.save(result)
        } catch (error) {
          console.log(error)
          throw new Error('Problema para sincronizar exchange')
        }
      }
    },

    syncTokens: (): AsyncAction<TokenAsset[]> => {
      const tokenToAsset = (
        response: TokenResponse,
        blockchainName: BlockchainServiceKey
      ): TokenAsset[] => {
        return _.map(
          response,
          (it) =>
            new TokenAsset(
              it.companyName,
              it.symbol,
              it.networks[1].hash,
              blockchainName,
              it.networks[1].decimals
            )
        )
      }

      return async (dispatch, getState) => {
        const tokenAssets = await Storage.tokenAssets.load()
        if (tokenAssets) {
          const tokens = tokenAssets.map((token) => {
            token.adaptToMultichain()
            return token
          })
          dispatch(this.commit('SET_TOKENS', {tokens}))
          return tokenAssets
        } else {
          const assetsBlockchain: TokenAsset[] = []
          let tokensBlockchain: TokenAsset[] = []
          try {
            await Promise.all(
              blockchainList.map(async (blockchainName) => {
                const {assets, provider} = blockchainServices[blockchainName]
                const tokenList = await provider.getTokenList()
                assets.forEach(({hash, name, symbol, decimals}) => {
                  assetsBlockchain.push(
                    new TokenAsset(name, symbol, hash, blockchainName, decimals)
                  )
                  tokensBlockchain = tokenToAsset(tokenList, blockchainName)
                })
              })
            )
            const tokens = [...assetsBlockchain, ...tokensBlockchain]
            dispatch(this.commit('SET_TOKENS', {tokens}))
            return tokens
          } catch (error) {
            console.log(error)
            throw new Error('Problema para consultar token list')
          }
        }
      }
    },

    fetchTokens: (): AsyncAction<TokenAsset[]> => {
      const tokenToAsset = (
        response: TokenResponse,
        blockchain: BlockchainServiceKey
      ): TokenAsset[] => {
        return _.map(
          response,
          (it) =>
            new TokenAsset(
              it.companyName,
              it.symbol,
              it.networks[1].hash,
              blockchain,
              it.networks[1].decimals
            )
        )
      }
      return async () => {
        const assetsBlockchain: TokenAsset[] = []
        let tokensBlockchain: TokenAsset[] = []
        const tokensAllBlockchains: TokenAsset[] = []
        try {
          await Promise.all(
            blockchainList.map(async (blockchainName) => {
              const {assets, provider} = blockchainServices[blockchainName]
              const tokenList = await provider.getTokenList()
              assets.forEach(({hash, name, symbol, decimals}) => {
                assetsBlockchain.push(
                  new TokenAsset(name, symbol, hash, blockchainName, decimals)
                )
                tokensBlockchain = tokenToAsset(tokenList, blockchainName)
              })
              tokensBlockchain.forEach(
                ({hash, name, symbol, blockchain, decimals}) => {
                  tokensAllBlockchains.push(
                    new TokenAsset(
                      name,
                      symbol,
                      hash,
                      blockchain,
                      decimals ?? undefined
                    )
                  )
                }
              )
            })
          )
          const tokens = [...assetsBlockchain, ...tokensAllBlockchains]
          await Storage.tokenAssets.save(tokens)
          return tokens
        } catch (error) {
          console.log(error)
          throw new Error('Problema para consultar token list')
        }
      }
    },

    syncNodes: (): AsyncAction<Node[]> => {
      return async (dispatch, getState) => {
        let neoNodes: NeoNode[] = []
        neoNodes = (await Storage.neoNodes.load()) ?? []
        const nodes = (await Storage.nodes.load()) ?? []
        if (!nodes.length) {
          neoNodes.forEach(({height, url}) =>
            nodes.push({url, height, blockchain: 'neoLegacy'})
          )
        }
        dispatch(this.commit('SET_NODES', {nodes}))
        return nodes
      }
    },

    fetchNodes: (): AsyncAction => {
      return async () => {
        try {
          let nodes: Node[] = []
          blockchainList.forEach(async (blockchainName) => {
            const {provider} = blockchainServices[blockchainName]
            nodes = await provider.getAllNodes()
            await Storage.nodes.save(nodes)
          })
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
            it.adaptToMultichain()
          })
          blockchainList.forEach((blockchain) => {
            blockchainServices[blockchain].setAccountsPool(
              accounts.filter((acc) => acc.blockchain === blockchain)
            )
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

        const account = accounts.find((it) => it.address === address) //TODO: alem de checar o address precisa tbm ter certeza do blockchain

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
          const {accounts, tokens} = getState().app
          const balanceAccounts = await Promise.all(
            accounts
              .map(async (acc) => {
                const {address} = acc
                if (address) {
                  const response = await blockchainServices[
                    acc.blockchain
                  ].provider.getBalance(address)

                  const tokens = response.balance
                    .map((it) => {
                      const {asset, assetSymbol, assetHash} = it

                      if (asset && assetSymbol && assetHash) {
                        const tokenAsset = new TokenAsset(
                          asset,
                          assetSymbol,
                          assetHash,
                          acc.blockchain
                        )
                        tokenAsset.amount = it.amount ?? 0
                        return tokenAsset
                      }

                      return null
                    })
                    .filter((it) => it) as TokenAsset[]

                  return {address, tokens}
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
          const senderTxs = account.flattedPendingTransactions

          for (const senderTx of senderTxs) {
            if (senderTx.transactionHash) {
              try {
                const request = blockchainServices[account.blockchain].provider
                const confirmedTx = await request.getTransaction(
                  senderTx.transactionHash
                )
                const index = senderTxs.findIndex(
                  (it) => it.transactionHash === confirmedTx.txid
                )
                if (index >= 0) {
                  if (senderTxs[index].senderAddress === 'claim') {
                    showMessage({
                      message: i18n.t('toast.gasClaimSuccess'),
                      type: 'success',
                    })
                    appBus.emit('claimGasEnd', senderTxs[index])
                  } else {
                    const lastTransaction = senderTxs[index]
                    showMessage({
                      message: i18n.t('toast.transactionCompleted'),
                      type: 'success',
                      onPress: () => {
                        appBus.emit(
                          'navigateTransactionDetails',
                          lastTransaction
                        )
                      },
                    })
                    appBus.emit('transactionEnd', senderTxs[index])
                  }
                  account.removePendingTransactions(
                    senderTxs[index],
                    senderTx.transactionHash
                  )
                  removedSenderTx.push(senderTxs[index])
                  senderTxs.splice(index, 1)
                }
              } catch (e) {
                /** TODO #665 GITHUB*/
              }
            }
          }
        }
        await Storage.accounts.save(accounts)
        dispatch(this.commit('SET_ACCOUNTS', {accounts}))
        this.actions.syncWallets()
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

    createInitialWallet: (): AsyncAction => {
      const generateAccount = async (
        wallet: Wallet,
        index: number,
        blockchain: BlockchainServiceKey
      ) => {
        const mnemonic = await wallet.getMnemonic()
        if (!mnemonic) return null
        return blockchainServices[blockchain].generateAccount(mnemonic, index)
      }
      return async (dispatch, getState) => {
        const words = AsteroidHelper.generateMnemonic() ?? []
        const wallets = getState().app.wallets
        const accounts = getState().app.accounts
        const theme = wrapper.theme[getState().settings.theme]
        if (wallets.length < 1) {
          const wallet = plainToClass(Wallet, getState().wallet)

          // TODO: Review ID generator
          wallet.id = UtilsHelper.uuid()
          wallet.name = i18n.t('onboarding.firstWalletName')
          wallet.showBackupAlert = true
          wallet.securityPhrase = words.join(' ')
          wallet.walletType = 'standard'
          wallets.push(wallet)

          await Storage.wallets.save(wallets)
          if (wallet.walletType === 'standard') {
            if (!wallet.securityPhrase) {
              return Promise.reject(
                new Error("Can't create a wallet without a security phrase")
              )
            }

            await SecurityHelper.saveMnemonic(wallet.id, wallet.securityPhrase)
          }
          for (const blockchainName of blockchainList) {
            const newAccount = await generateAccount(
              wallet,
              blockchainList.indexOf(blockchainName),
              blockchainName
            )
            if (newAccount) {
              const account = new Account()
              const {address, wif} = newAccount
              account.address = address
              account.blockchain = blockchainName
              account.idWallet = wallet.id
              account.accountType = wallet.walletType
              account.index = blockchainList.indexOf(blockchainName)
              account.name = i18n.t('modals.blockchainList.countAccount', {
                count: 1,
              })
              account.backgroundColor = theme.colors.card[getRandomColor(6)]
              await SecurityHelper.saveWif(account.address, wif)

              accounts.push(account)

              await Storage.accounts.save(accounts)
            }
          }
        }
      }
    },

    //used just in development
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
