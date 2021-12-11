import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'
import {ImageLoadEventData} from 'react-native'

import {BlockchainServiceKey} from '~/src/blockchain'
import {applicationConfig} from '~/src/config/ApplicationConfig'
import {SecurityHelper} from '~/src/helpers/SecurityHelper'
import {TokenAsset} from '~/src/models/TokenAsset'
import {Wallet} from '~/src/models/redux/Wallet'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Account} from '~src/models/redux/Account'
import {AddressDispatcher} from '~src/store/account/dispatchers/AddressDispatcher'
import {BackgroundDispatcher} from '~src/store/account/dispatchers/BackgroundDispatcher'
import {BlockchainDispatcher} from '~src/store/account/dispatchers/BlockchainDispatcher'
import {IdWalletDispatcher} from '~src/store/account/dispatchers/IdWalletDispatcher'
import {IndexDispatcher} from '~src/store/account/dispatchers/IndexDispatcher'
import {NameDispatcher} from '~src/store/account/dispatchers/NameDispatcher'
import {SrcIconDispatcher} from '~src/store/account/dispatchers/SrcIconDispatcher'
import {TokenAssetsDispatcher} from '~src/store/account/dispatchers/TokenAssetsDispatcher'
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
    TokenAssetsDispatcher,
    BlockchainDispatcher,
    IndexDispatcher,
  ]

  readonly actions = {
    selectAccount: (address: string | null) => {
      return this.commit('SET_ADDRESS', {address})
    },
    setIdWallet: (idWallet: string) => {
      return this.commit('SET_ID_WALLET', {idWallet})
    },
    setName: (name: string) => {
      return this.commit('SET_NAME_ACCOUNT', {name})
    },
    setSrcIcon: (srcIcon: ImageLoadEventData) => {
      return this.commit('SET_SRC_ICON', {srcIcon})
    },
    setBackgroundColor: (backgroundColor: string) => {
      return this.commit('SET_BACKGROUND_COLOR', {backgroundColor})
    },
    setTokenAssets: (tokenAssets: TokenAsset[]) => {
      return this.commit('SET_TOKENASSETS_ACCOUNT', {tokenAssets})
    },
    setBlockchain: (blockchain: BlockchainServiceKey) => {
      return this.commit('SET_BLOCKCHAIN_ACCOUNT', {blockchain})
    },
    setIndex: (index: number) => {
      return this.commit('SET_INDEX_ACCOUNT', {index})
    },
    getFromSelection: (): SyncAction<Account> => {
      return (dispatch, getState) => {
        const accounts = getState().app.accounts
        const {address} = getState().account
        return accounts.find((it) => it.address === address) ?? new Account()
      }
    },
    createAndSave: (indexAccount?: number): AsyncAction<string> => {
      const generateAccount = async (
        wallet: Wallet,
        index: number,
        blockchain: BlockchainServiceKey
      ) => {
        const mnemonic = await wallet.getMnemonic()
        if (!mnemonic) return null
        return applicationConfig.blockchain[blockchain].generateAccount(
          mnemonic,
          index
        )
      }

      return async (dispatch, getState) => {
        const accounts = getState().app.accounts

        const account = plainToClass(Account, getState().account)
        const blockchain = getState().account.blockchain
        const index = getState().account.index
        const wallet = account.getWallet(getState().app.wallets)
        const tokenPool = getState().app.tokens
        const indexes = account
          .getAccountsWithSameWallet(getState().app.accounts)
          .map((it) => it.index ?? 0)

        account.index =
          indexAccount ??
          (indexes.length ? Math.max(...indexes) + 1 : index ?? 0)
        account.blockchain = blockchain

        if (wallet && wallet.walletType === 'standard') {
          const newAccount = await generateAccount(
            wallet,
            account.index,
            blockchain
          )

          if (newAccount) {
            account.address = newAccount.address

            await SecurityHelper.saveWif(account.address, newAccount.wif)

            await account.populateTokenAssets()
            await account.populateTransactions(tokenPool)

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
        const accounts = plainToClass(Account, getState().app.accounts)

        const edited = plainToClass(Account, getState().account)

        const account = accounts.find(
          (acc) => acc.address && acc.address === address
        )

        if (account) {
          account.name = edited.name
          account.backgroundColor = edited.backgroundColor
          account.tokenAssets = edited.tokenAssets
        }

        await Storage.accounts.save(accounts)
      }
    },
    importAndSave: (address: string, wif?: string): AsyncAction<Account> => {
      return async (dispatch, getState) => {
        const accounts = getState().app.accounts
        const account = plainToClass(Account, getState().account)
        account.address = address
        const wallet = account.getWallet(getState().app.wallets)

        if (wallet) {
          if (wif) {
            await SecurityHelper.saveWif(account.address, wif)
          } else {
            if (
              wallet.walletType === 'legacy' ||
              wallet.walletType === 'standard'
            ) {
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
    delete: (address: string): AsyncAction => {
      return async (dispatch) => {
        const accounts = (await Storage.accounts.load()) ?? []

        const account = accounts.find((it) => it.address === address)

        if (account) {
          const indexAccount = accounts.indexOf(account)
          accounts.splice(indexAccount, 1)
        }
        await Storage.accounts.save(accounts)
      }
    },
  }
}
