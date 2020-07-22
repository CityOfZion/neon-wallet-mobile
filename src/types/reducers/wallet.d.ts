import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type WalletType = 'SET_NAME' | 'SET_PASSPHRASE' | 'SET_SECURITY_PHRASE'

  interface WalletState {
    name: string | null
    passphrase: string | null
    securityPhrase: string | null
  }

  type WalletAction = WalletState & Action<WalletType>

  type WalletReducer = ReducerApplied<WalletState, WalletAction>
}
