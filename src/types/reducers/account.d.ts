import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { ImageLoadEventData } from 'react-native'
import { TokenAsset } from '~/src/models/TokenAsset'
import { BlockchainServiceKey } from '~/src/blockchain'

export type AccountActionsType =
  | 'SET_ADDRESS'
  | 'SET_ID_WALLET'
  | 'SET_NAME_ACCOUNT'
  | 'SET_SRC_ICON'
  | 'SET_BACKGROUND_COLOR'
  | 'CLEAR_STATE_ACCOUNT'
  | 'SET_TOKENASSETS_ACCOUNT'
  | 'SET_BLOCKCHAIN_ACCOUNT'
  | 'SET_INDEX_ACCOUNT'

export interface AccountState {
  address: string | null
  index: number | null
  idWallet: string | null
  name: string | null
  srcIcon: ImageLoadEventData
  backgroundColor: string | null
  tokenAssets: TokenAsset[] | null
  blockchain: BlockchainServiceKey
}

export type AccountAction = AccountState & Action<AccountActionsType>

export type AccountReducer = ReducerApplied<AccountState, AccountAction>
