import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {SecurityHelper} from '~/src/helpers/SecurityHelper'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {TokenAsset} from '~/src/models/TokenAsset'
import {AsyncAction, SyncAction} from '~/src/types/reducers/root'
import {
  WalletActionsType,
  WalletState,
  WalletAction,
} from '~/src/types/reducers/wallet'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Wallet} from '~src/models/redux/Wallet'
import {IdDispatcher} from '~src/store/wallet/dispatchers/IdDispatcher'
import {NameDispatcher} from '~src/store/wallet/dispatchers/NameDispatcher'
import {PassphraseDispatcher} from '~src/store/wallet/dispatchers/PassphraseDispatcher'
import {SecurityPhraseDispatcher} from '~src/store/wallet/dispatchers/SecurityPhraseDispatcher'
import {TokenAssetsDispatcher} from '~src/store/wallet/dispatchers/TokenAssetsDispatcher'
import {WalletTypeDispatcher} from '~src/store/wallet/dispatchers/WalletTypeDispatcher'
export class WalletReducer extends ReducerWrapper<
  WalletActionsType,
  WalletState,
  WalletAction
> {
  protected readonly initialState = Model.parse<WalletState>(Wallet)

  protected readonly dispatchers = [
    IdDispatcher,
    NameDispatcher,
    PassphraseDispatcher,
    SecurityPhraseDispatcher,
    WalletTypeDispatcher,
    TokenAssetsDispatcher,
  ]

  readonly actions = {
    selectWallet: (id: string | null) => {
      return this.commit('SET_ID', { id })
    },
    setName: (name: string) => {
      return this.commit('SET_NAME_WALLET', { name })
    },
    setPassphrase: (passphrase: string) => {
      return this.commit('SET_PASSPHRASE', { passphrase })
    },
    setSecurityPhrase: (securityPhrase: string) => {
      return this.commit('SET_SECURITY_PHRASE', { securityPhrase })
    },
    setType: (walletType: 'standard' | 'watch' | 'legacy') => {
      return this.commit('SET_WALLET_TYPE', { walletType })
    },
    setTokenAssets: (tokenAssets: TokenAsset[]) => {
      return this.commit('SET_TOKENASSETS_WALLET', { tokenAssets })
    },
    getFromSelection: (): SyncAction<Wallet> => {
      return (dispatch, getState) => {
        const wallets = getState().app.wallets
        const id = getState().wallet.id

        return wallets.find(it => it.id === id) ?? new Wallet()
      }
    },
    mnemonicIsImported: (mnemonic: string): AsyncAction<boolean> => {
      return async (dispatch, getState) => {
        const walletIds = getState()
          .app.wallets.map(wallet => wallet.id)
          .filter(id => id !== null) as string[]
        const mnemonics = await Promise.all(walletIds.map(async id => await SecurityHelper.loadMnemonic(id)))
        const foundMnemonic = mnemonics.find(it => it === mnemonic)
        if (foundMnemonic) {
          return true
        } else {
          return false
        }
      }
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const wallets = getState().app.wallets

        const wallet = plainToClass(Wallet, getState().wallet)
        const { securityPhrase } = getState().wallet

        // TODO: Review ID generator
        wallet.id = UtilsHelper.uuid()

        wallets.push(wallet)

        await Storage.wallets.save(wallets)

        if (wallet.walletType === 'standard') {
          if (!securityPhrase) {
            return Promise.reject(new Error("Can't create a wallet without a security phrase"))
          }

          await SecurityHelper.saveMnemonic(wallet.id, securityPhrase)
        }

        return wallet.id
      }
    },
    reorderAndSave: (order: number[]): AsyncAction => {
      return async () => {
        const wallets = (await Storage.wallets.load()) ?? []

        const newWalletList: Wallet[] = []
        order.forEach(i => newWalletList.push(wallets[i]))

        await Storage.wallets.save(newWalletList)
      }
    },
    setShowBackupAlert: (id: string, showBackupAlert: boolean): AsyncAction => {
      return async () => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = wallets.find(it => it.id === id)

        if (wallet) {
          wallet.showBackupAlert = showBackupAlert
          await Storage.wallets.save(wallets)
        }
      }
    },
    update: (id: string): AsyncAction => {
      return async (dispatch, getState) => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = wallets.find(it => it.id === id)

        if (wallet) {
          wallet.name = getState().wallet.name
        }

        await Storage.wallets.save(wallets)
      }
    },
    delete: (id: string): AsyncAction => {
      return async dispatch => {
        const wallets = (await Storage.wallets.load()) ?? []
        const accountsPool = (await Storage.accounts.load()) ?? []

        const wallet = wallets.find(it => it.id === id)

        if (wallet) {
          let account
          let indexAccount: number
          const accounts = wallet.getAccounts(accountsPool)

          accounts?.forEach(accountItem => {
            account = accountsPool.find(it => it.address === accountItem.address)
            if (account) {
              indexAccount = accountsPool.indexOf(account)
              accountsPool.splice(indexAccount, 1)
            }
          })
          const indexWallet = wallets.indexOf(wallet)
          wallets.splice(indexWallet, 1)
        }

        await Storage.wallets.save(wallets)
        await Storage.accounts.save(accountsPool)
      }
    },
  }
}
