import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Wallet} from '~src/models/redux/Wallet'
import {ClearStateDispatcher} from '~src/store/wallet/dispatchers/ClearStateDispatcher'
import {IdDispatcher} from '~src/store/wallet/dispatchers/IdDispatcher'
import {NameDispatcher} from '~src/store/wallet/dispatchers/NameDispatcher'
import {PassphraseDispatcher} from '~src/store/wallet/dispatchers/PassphraseDispatcher'
import {SecurityPhraseDispatcher} from '~src/store/wallet/dispatchers/SecurityPhraseDispatcher'
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
    ClearStateDispatcher,
  ]

  readonly actions = {
    selectWallet: (id: string | null) => {
      return this.commit('SET_ID', {id})
    },
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setPassphrase: (passphrase: string) => {
      return this.commit('SET_PASSPHRASE', {passphrase})
    },
    setSecurityPhrase: (securityPhrase: string) => {
      return this.commit('SET_SECURITY_PHRASE', {securityPhrase})
    },
    setType: (walletType: 'standard' | 'watch' | 'legacy') => {
      return this.commit('SET_WALLET_TYPE', {walletType})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE_WALLET', {})
    },
    getFromSelection: (): SyncAction<Wallet> => {
      return (dispatch, getState) => {
        const wallets = getState().app.wallets
        const id = getState().wallet.id

        return wallets.find((it) => it.id === id) ?? new Wallet()
      }
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = plainToClass(Wallet, getState().wallet)
        const {securityPhrase} = getState().wallet

        // TODO: Review ID generator
        wallet.id = Facade.utils.uuid()

        wallets.push(wallet)

        await Storage.wallets.save(wallets)

        if (wallet.walletType === 'standard') {
          if (!securityPhrase) {
            return Promise.reject(
              new Error("Can't create a wallet without a security phrase")
            )
          }

          await Facade.security.saveMnemonic(wallet.id, securityPhrase)
        }

        return wallet.id
      }
    },
    reorderAndSave: (order: number[]): AsyncAction => {
      return async () => {
        const wallets = (await Storage.wallets.load()) ?? []

        const newWalletList: Wallet[] = []
        order.forEach((i) => newWalletList.push(wallets[i]))

        await Storage.wallets.save(newWalletList)
      }
    },
    setShowBackupAlert: (id: string, showBackupAlert: boolean): AsyncAction => {
      return async () => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = wallets.find((it) => it.id === id)

        if (wallet) {
          wallet.showBackupAlert = showBackupAlert
          await Storage.wallets.save(wallets)
        }
      }
    },
    update: (id: string): AsyncAction => {
      return async (dispatch, getState) => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = wallets.find((it) => it.id === id)

        if (wallet) {
          wallet.name = getState().wallet.name
        }

        await Storage.wallets.save(wallets)
      }
    },
    delete: (id: string): AsyncAction => {
      return async (dispatch) => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = wallets.find((it) => it.id === id)

        if (wallet) {
          const index = wallets.indexOf(wallet)
          wallets.splice(index, 1)
        }

        await Storage.wallets.save(wallets)
      }
    },
  }
}
