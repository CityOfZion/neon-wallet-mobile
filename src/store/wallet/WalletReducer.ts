import {ReducerWrapper} from '@simpli/redux-wrapper'
import {ThunkAction} from 'redux-thunk'

import {Wallet} from '~/src/models/Wallet'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {NameDispatcher} from '~src/store/wallet/dispatchers/NameDispatcher'
import {PassphraseDispatcher} from '~src/store/wallet/dispatchers/PassphraseDispatcher'
import {SecurityPhraseDispatcher} from '~src/store/wallet/dispatchers/SecurityPhraseDispatcher'

export class WalletReducer extends ReducerWrapper<
  WalletType,
  WalletState,
  WalletAction
> {
  protected readonly initialState: WalletState = {
    name: null,
    passphrase: null,
    securityPhrase: null,
  }

  protected readonly dispatchers = [
    NameDispatcher,
    PassphraseDispatcher,
    SecurityPhraseDispatcher,
  ]

  readonly actions = {
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setPassphrase: (passphrase: string) => {
      return this.commit('SET_PASSPHRASE', {passphrase})
    },
    setSecurityPhrase: (securityPhrase: string) => {
      return this.commit('SET_SECURITY_PHRASE', {securityPhrase})
    },
    createAndSave: (): ThunkAction<void, RootState, any, any> => {
      return async (dispatch, getState) => {
        const state = getState()

        const wallet = new Wallet()
        wallet.name = state.wallet.name
        wallet.passphrase = state.wallet.passphrase
        wallet.securityPhrase = state.wallet.securityPhrase

        const wallets = (await Storage.wallets.load()) ?? []
        wallets.push(wallet)

        await Storage.wallets.save(wallets)
      }
    },
  }
}
