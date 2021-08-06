import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Contact} from '~src/models/redux/Contact'
import {AddressDispatcher} from '~src/store/contact/dispatchers/AddressDispatcher'
import {ClearStateDispatcher} from '~src/store/contact/dispatchers/ClearStateDispatcher'
import {NameDispatcher} from '~src/store/contact/dispatchers/NameDispatcher'

export class ContactReducer extends ReducerWrapper<
  ContactActionsType,
  ContactState,
  ContactAction
> {
  protected readonly initialState = Model.parse<ContactState>(Contact)

  protected readonly dispatchers = [NameDispatcher, AddressDispatcher]

  readonly actions = {
    setName: (name: string) => {
      return this.commit('SET_NAME', {name})
    },
    setAddress: (addresses: string[]) => {
      return this.commit('SET_ADDRESSES', {addresses})
    },
    createAndSave: (): AsyncAction<string> => {
      return async (dispatch, getState) => {
        const contacts = (await Storage.contacts.load()) ?? []
        const contact = plainToClass(Contact, getState().contact)

        contact.id = Facade.utils.uuid()

        contacts.push(contact)

        await Storage.contacts.save(contacts)

        return contact.name ?? ''
      }
    },
    update: (id: string): AsyncAction => {
      return async (dispatch, getState) => {
        const contacts = (await Storage.contacts.load()) ?? []

        const contact = contacts.find((it) => it.id === id)

        if (contact) {
          contact.name = getState().contact.name
          contact.addresses = getState().contact.addresses
        }

        await Storage.contacts.save(contacts)
      }
    },
    delete: (id: string): AsyncAction => {
      return async (dispatch) => {
        const contacts = (await Storage.contacts.load()) ?? []

        const contact = contacts.find((it) => it.id === id)

        if (contact) {
          const index = contacts.indexOf(contact)
          contacts.splice(index, 1)
        }

        await Storage.contacts.save(contacts)
      }
    },
  }
}
