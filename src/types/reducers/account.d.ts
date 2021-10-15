import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {ImageLoadEventData} from 'react-native'
import {Currency} from '~src/enums/Currency'
import {TokenAsset} from '~/src/models/TokenAsset'
import {BlockchainServiceKey} from '~/src/blockchain'

export declare global {
  type AccountActionsType =
    | 'SET_ADDRESS'
    | 'SET_ID_WALLET'
    | 'SET_NAME_ACCOUNT'
    | 'SET_SRC_ICON'
    | 'SET_BACKGROUND_COLOR'
    | 'CLEAR_STATE_ACCOUNT'
    | 'SET_TOKENASSETS_ACCOUNT'
    | 'SET_BLOCKCHAIN_ACCOUNT'
    | 'SET_INDEX_ACCOUNT'

  interface AccountState {
    address: string | null
    index: number | null
    idWallet: string | null
    name: string | null
    srcIcon: ImageLoadEventData
    backgroundColor: string | null
    tokenAssets: TokenAsset[] | null
    blockchain: BlockchainServiceKey
  }

  type AccountAction = AccountState & Action<AccountActionsType>

  type AccountReducer = ReducerApplied<AccountState, AccountAction>
}
