import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { TokenAsset } from '~/src/models/TokenAsset'

export declare global {
  type WalletActionsType =
    | 'SET_ID'
    | 'SET_NAME_WALLET'
    | 'SET_PASSPHRASE'
    | 'SET_SECURITY_PHRASE'
    | 'SET_WALLET_TYPE'
    | 'SET_SHOW_BACKUP_ALERT'
    | 'CLEAR_STATE_WALLET'
    | 'SET_TOKENASSETS_WALLET'

  type WalletType = 'standard' | 'watch' | 'legacy'

  interface WalletState {
    id: string | null
    name: string | null
    passphrase: string | null
    securityPhrase: string | null
    walletType: WalletType | null
    lastVisitedAt: string | null
    showBackupAlert: boolean
    tokenAssets: TokenAsset[] | null
  }

  type WalletAction = WalletState & Action<WalletActionsType>

  type WalletReducer = ReducerApplied<WalletState, WalletAction>
}
