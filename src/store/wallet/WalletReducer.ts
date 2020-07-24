import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Wallet} from '~src/models/redux/Wallet'
import {ClearStateDispatcher} from '~src/store/wallet/dispatchers/ClearStateDispatcher'
import {NameDispatcher} from '~src/store/wallet/dispatchers/NameDispatcher'
import {PassphraseDispatcher} from '~src/store/wallet/dispatchers/PassphraseDispatcher'
import {SecurityPhraseDispatcher} from '~src/store/wallet/dispatchers/SecurityPhraseDispatcher'

export class WalletReducer extends ReducerWrapper<
  WalletType,
  WalletState,
  WalletAction
> {
  protected readonly initialState = Model.parse<WalletState>(Wallet)

  protected readonly dispatchers = [
    NameDispatcher,
    PassphraseDispatcher,
    SecurityPhraseDispatcher,
    ClearStateDispatcher,
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
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const wallets = (await Storage.wallets.load()) ?? []

        const wallet = plainToClass(Wallet, getState().wallet)
        // TODO: Review ID generator
        wallet.id = Facade.utils.uuid()

        wallets.push(wallet)

        await Storage.wallets.save(wallets)

        return wallet.id
      }
    },
  }
}
