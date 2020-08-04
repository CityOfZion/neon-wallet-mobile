import {ImageLoadEventData} from 'react-native'

import {NEO, GAS} from '~src/assets/nep5/png'

export class TransactionModel {
  srcIcon?: ImageLoadEventData
  date?: Date
  transactions?: Transaction[]
}

export class Transaction {
  receiver?: Receiver[]
}

export class Receiver {
  isAddress?: boolean
  nameOrAdress?: string
  assets?: Asset[]
}

export class Asset {
  srcIcon?: ImageLoadEventData
  nameSymbol?: string
  value?: string
  hash?: string
}

export const neo = new Asset()
neo.srcIcon = NEO
neo.hash = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
neo.nameSymbol = 'NEO'

export const gas = new Asset()
neo.srcIcon = GAS
neo.hash = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
neo.nameSymbol = 'GAS'
