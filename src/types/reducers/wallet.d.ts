import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type WalletActionsType =
    | 'SET_NAME'
    | 'SET_PASSPHRASE'
    | 'SET_SECURITY_PHRASE'
    | 'SET_WALLET_TYPE'
    | 'SET_SHOW_BACKUP_ALERT'
    | 'CLEAR_STATE'

  type WalletType = 'standard' | 'watch' | 'legacy'

  interface WalletState {
    id: string | null
    name: string | null
    passphrase: string | null
    securityPhrase: string | null
    walletType: WalletType | null
    lastVisitedAt: string | null
    showBackupAlert: boolean
  }

  type WalletAction = WalletState & Action<WalletActionsType>

  type WalletReducer = ReducerApplied<WalletState, WalletAction>
}
