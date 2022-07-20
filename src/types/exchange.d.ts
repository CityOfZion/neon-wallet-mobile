import { BlockchainServiceKey } from '~src/blockchain'
import { ExchangeInfo } from '../models/response/ExchangeInfo'

export type Exchange = ExchangeInfo

export type MultiExchange = Record<BlockchainServiceKey, Exchange[]>
