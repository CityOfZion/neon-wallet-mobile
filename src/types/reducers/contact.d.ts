import { BlockchainServiceKey } from '~/src/blockchain'

export interface ContactState {
  id: string | null
  name: string | null
  addresses: ContactAddressesList = []
}

export type ContactAddressesList = ContactAddresses[]

export type ContactAddresses = { address: string; blockchain: BlockchainServiceKey }
