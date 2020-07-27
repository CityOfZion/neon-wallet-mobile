import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {ImageLoadEventData} from 'react-native'
import {Currency} from '~src/enums/Currency'

export declare global {
  type AccountType =
    | 'SET_ID_WALLET'
    | 'SET_NAME'
    | 'SET_SRC_ICON'
    | 'SET_CURRENCY'
    | 'SET_BACKGROUND_COLOR'
    | 'CLEAR_STATE'

  interface AccountState {
    address: string | null
    index: number | null
    idWallet: string | null
    name: string | null
    srcIcon: ImageLoadEventData | null
    currency: Currency | null
    backgroundColor: string | null
  }

  type AccountAction = AccountState & Action<AccountType>

  type AccountReducer = ReducerApplied<AccountState, AccountAction>
}
