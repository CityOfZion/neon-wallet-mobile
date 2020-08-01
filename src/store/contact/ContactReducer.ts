import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Contact} from '~src/models/redux/Contact'
import {AddressDispatcher} from '~src/store/contact/dispatchers/AddressDispatcher'
import {ClearStateDispatcher} from '~src/store/contact/dispatchers/ClearStateDispatcher'
import {NameDispatcher} from '~src/store/contact/dispatchers/NameDispatcher'

export class ContactReducer extends ReducerWrapper<
  ContactType,
  ContactState,
  ContactAction
> {
  protected readonly initialState = Model.parse<ContactState>(Contact)

  protected readonly dispatchers = [
    NameDispatcher,
    AddressDispatcher,
    ClearStateDispatcher,
  ]

  readonly actions = {
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setAddress: (address: string) => {
      return this.commit('SET_ADDRESS', {address})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const contacts = (await Storage.contacts.load()) ?? []
        const contact = plainToClass(Contact, getState().contact)
        contacts.push(contact)

        await Storage.contacts.save(contacts)

        return contact.name ?? ''
      }
    },
  }
}
