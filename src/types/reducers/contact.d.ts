import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type ContactType =
    | 'SET_NAME'
    | 'SET_ADDRESS'
    | 'CLEAR_STATE'

  interface ContactState {
    name: string | null
    address: string | null
  }

  type ContactAction = ContactState & Action<ContactType>

  type ContactReducer = ReducerApplied<ContactState, ContactAction>
}
