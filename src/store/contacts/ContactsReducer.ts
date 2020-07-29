import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Lang} from '~src/enums/Lang'
import {Contact} from '~src/models/Contact'
import {Account} from '~src/models/redux/Account'
import {Settings} from '~src/models/redux/Settings'
import {ContactsDispatcher} from '~src/store/contacts/ContactsDispatcher'
import {plainToClass} from "class-transformer";
import {Wallet} from "~src/models/redux/Wallet";
import {Facade} from "~src/app/Facade";

export class ContactsReducer extends ReducerWrapper<
  ContactsType,
  ContactsState,
  ContactsAction
> {
  protected readonly initialState = Model.parse<ContactsState>(Contact)

  readonly actions = {
    addContact: (contact: Contact): AsyncAction => {
      return async (dispatch, getState) => {
        const contacts = (await Storage.contacts.load()) ?? []

        const contact = plainToClass(Contact, getState().contacts)
        // TODO: Review ID generator
        wallet.id = Facade.utils.uuid()

        wallets.push(wallet)

        await Storage.wallets.save(wallets)
      }
    },
    syncContacts: (): AsyncAction<Contact[]> => {
      return async (dispatch, getState) => {
        const contacts = await Storage.contacts.load()
        if (contacts) {
          dispatch(this.commit('SET_CONTACTS', {contacts}))
        }
        return contacts ?? []
      }
    },
    save: (): AsyncAction => {
      return async (dispatch, getState) => {
        const state = getState().contacts.contacts
        await Storage.contacts.save(state)
      }
    },
  }
  protected readonly dispatchers = [ContactsDispatcher]
}
