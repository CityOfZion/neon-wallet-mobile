import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { BlockchainServiceKey } from '~/src/blockchain'

export type ContactActionsType = 'SET_NAME' | 'SET_ADDRESSES' | 'CLEAR_STATE_CONTACT'

export interface ContactState {
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

export type ContactAction = ContactState & Action<ContactActionsType>

export type ContactReducer = ReducerApplied<ContactState, ContactAction>
