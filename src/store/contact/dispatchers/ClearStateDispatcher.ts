import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  ContactAction,
  ContactActionsType,
  ContactReducer,
  ContactState,
} from '~/src/types/reducers/contact'
import {Model} from '~src/app/Model'
import {Contact} from '~src/models/redux/Contact'

export class ClearStateDispatcher extends DispatcherWrapper<ContactActionsType, ContactState, ContactAction> {
  readonly type = 'CLEAR_STATE_CONTACT'

  readonly reducer: ContactReducer = (state, action) => {
    return this.set(state, Model.parse<ContactState>(Contact))
  }
}
