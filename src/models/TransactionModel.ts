import {ImageLoadEventData} from '~/node_modules/@types/react-native'

export class TransactionModel {
  srcIcon?: ImageLoadEventData
  date?: Date
  transactions?: Transaction[]
}

export class Transaction {
  receiver ?: Receiver[]
}

export class Receiver{
  isAddress?: boolean
  nameOrAdress?: string
  assets?: Asset[]

}

export class Asset {
  srcIcon?: ImageLoadEventData
  nameSymbol?: string
  value?: number
}

