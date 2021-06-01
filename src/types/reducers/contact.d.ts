import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type ContactActionsType = 'SET_NAME' | 'SET_ADDRESSES' | 'CLEAR_STATE_CONTACT'

  interface ContactState {
    id: string | null
    name: string | null
    addresses: string[] = []
  }

  type ContactAction = ContactState & Action<ContactActionsType>

  type ContactReducer = ReducerApplied<ContactState, ContactAction>
}
