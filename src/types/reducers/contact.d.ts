import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {BlockchainServiceKey} from '~/src/blockchain'

export declare global {
  type ContactActionsType = 'SET_NAME' | 'SET_ADDRESSES' | 'CLEAR_STATE_CONTACT'

  interface ContactState {
    id: string | null
    name: string | null
    addresses: ContactAddressesList = []
  }

  export type ContactAddressesList = {
    address: string
    blockchain: BlockchainServiceKey
  }[]

  export type ContactAddresses = {
    address: string
    blockchain: BlockchainServiceKey
  }

  type ContactAction = ContactState & Action<ContactActionsType>

  type ContactReducer = ReducerApplied<ContactState, ContactAction>
}
