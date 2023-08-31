import { TransactionResponse } from '@cityofzion/blockchain-service'
import moment from 'moment'

import { Wallet } from '../wallet/Wallet'

import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import { Optional } from '~/src/types/global'
import { AccountState, WalletType } from '~/src/types/store'

export class Account implements AccountState {
  address: string
  accountType: WalletType
  idWallet: string
  name: string
  backgroundColor: string
  pendingTransactions: TransactionResponse[] = []
  blockchain: TBlockchainServiceKey

  constructor(data: Optional<AccountState, 'pendingTransactions'>) {
    this.address = data.address
    this.accountType = data.accountType
    this.idWallet = data.idWallet
    this.name = data.name
    this.blockchain = data.blockchain
    this.backgroundColor = data.backgroundColor

    if (data.pendingTransactions) {
      this.pendingTransactions = data.pendingTransactions
    }
  }

  getWallet(pool: Wallet[]) {
    return pool.find(it => it.id === this.idWallet)
  }

  async getKey() {
    return await SecurityHelper.loadKey(this.address)
  }

  addPendingTransaction(data: Optional<TransactionResponse, 'time'>) {
    this.pendingTransactions = [
      ...(this.pendingTransactions ?? []),
      {
        block: data.block,
        hash: data.hash,
        notifications: data.notifications,
        transfers: data.transfers,
        fee: data.fee,
        time: moment().unix(),
      },
    ]
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
      getKey,
      adaptToMultichain,
      addPendingTransaction,
      removePendingTransactions,
      ...deserializedAccount
    } = this
    const result: AccountState = deserializedAccount
    return result
  }
}
