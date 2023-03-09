import { HttpExclude, HttpExpose } from '@simpli/serialized-request'
import moment from 'moment'

import { Token } from '../Token'

import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { AccountState } from '~/src/types/reducers/account'
import { WalletType } from '~/src/types/reducers/wallet'
import { BlockchainServiceKey } from '~src/blockchain'
import { Wallet } from '~src/models/redux/Wallet'

export interface PendingTransactions {
  hash: string
  senderAddress: string
  receiverAddress: string
  token: Token
  amount: number
  fee: number
  time: number
}

@HttpExclude()
export class Account implements AccountState {
  /**
   * Used as ID
   */
  @HttpExpose()
  address: string | null = null

  @HttpExpose()
  accountType: WalletType | null = null

  /**
   * Parent reference
   */
  @HttpExpose()
  idWallet: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16)

  @HttpExpose()
  pendingTransactions: PendingTransactions[] = []

  @HttpExpose()
  blockchain: BlockchainServiceKey = 'neoLegacy'

  getWallet(pool: Wallet[]) {
    return pool.find(it => it.id === this.idWallet)
  }

  async getWif() {
    return (await SecurityHelper.loadWif(this.address ?? '')) ?? null
  }

  addPendingTransaction(
    hash: string,
    senderAddress: string,
    receiverAddress: string,
    token: Token,
    amount: number,
    fee: number
  ) {
    this.pendingTransactions.push({
      amount,
      fee,
      hash,
      receiverAddress,
      senderAddress,
      token,
      time: moment().unix(),
    })
  }

  removePendingTransactions(transactionHash: string) {
    this.pendingTransactions = this.pendingTransactions.filter(transaction => transaction.hash !== transactionHash)
  }

  adaptToMultichain() {
    if (!this.blockchain) {
      this.blockchain = 'neoLegacy'
    }
  }

  get deserialize() {
    const {
      getWallet,
      getWif,
      adaptToMultichain,
      addPendingTransaction,
      removePendingTransactions,
      ...deserializedAccount
    } = this
    const result: AccountState = deserializedAccount
    return result
  }
}
