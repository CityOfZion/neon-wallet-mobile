import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type WalletType =
    | 'SET_NAME'
    | 'SET_PASSPHRASE'
    | 'SET_SECURITY_PHRASE'
    | 'SET_WALLET_TYPE'
    | 'CLEAR_STATE'

  interface WalletState {
    id: string | null
    name: string | null
    passphrase: string | null
    securityPhrase: string | null
    walletType: 'standard' | 'watch' | 'legacy' | null
    lastVisitedAt: string | null
  }

  type WalletAction = WalletState & Action<WalletType>

  type WalletReducer = ReducerApplied<WalletState, WalletAction>
}
