import { HttpExclude, HttpExpose, ResponseSerialize } from '@simpli/serialized-request'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import moment from 'moment'
import { ImageLoadEventData } from 'react-native'

import { appBus } from '~/src/app/AppBus'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { BlockchainServiceKey, blockchainServices, getBlockchainLogo } from '~src/blockchain'
import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'
import { TokenAsset } from '~src/models/TokenAsset'
import { TransactionDateGroup } from '~src/models/TransactionDateGroup'
import { SenderTransaction } from '~src/models/redux/SenderTransaction'
import { Wallet } from '~src/models/redux/Wallet'
import { Exchange } from '~src/types/exchange'
import { Pagination } from '~src/types/pagination'

@HttpExclude()
export class Account implements AccountState {
  /**
   * Used as ID
   */
  @HttpExpose()
  address: string | null = null

  /**
   * Used for derivationPath
   */
  @HttpExpose()
  index: number | null = null

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

  // Balance of each token
  @ResponseSerialize(TokenAsset)
  @HttpExpose()
  tokenAssets: TokenAsset[] = []

  // Transactions grouped by datetime
  @HttpExpose()
  @ResponseSerialize(TransactionDateGroup)
  transactions: TransactionDateGroup[] = []

  @HttpExpose()
  @ResponseSerialize(TransactionDateGroup)
  pendingTransactions: TransactionDateGroup[] = []

  @HttpExpose()
  blockchain: BlockchainServiceKey = 'neoLegacy'

  @HttpExpose()
  srcIcon: ImageLoadEventData = getBlockchainLogo(this.blockchain, 'white')

  get hasFunds() {
    return _.sumBy(this.tokenAssets, it => Number(it.amount) ?? 0) > 0
  }

  getWallet(pool: Wallet[]) {
    return pool.find(it => it.id === this.idWallet)
  }

  getAccountsWithSameWallet(pool: Account[]) {
    return pool.filter(it => it.idWallet === this.idWallet)
  }

  async getWif() {
    return (await SecurityHelper.loadWif(this.address ?? '')) ?? null
  }

  get allTransactions() {
    return [...this.pendingTransactions, ...this.transactions]
  }

  get flattedTransactions() {
    return this.transactions.flatMap(it => it.transactions)
  }

  get flattedPendingTransactions() {
    return this.pendingTransactions.flatMap(it => it.transactions)
  }

  get flattedAllTransactions() {
    return this.allTransactions.flatMap(it => it.transactions)
  }

  getBalanceAmountByAsset(assetSymbol: string) {
    const tokenAsset = this.tokenAssets.find(it => it.symbol === assetSymbol && it.blockchain === this.blockchain)
    if (!tokenAsset) return null

    return tokenAsset.amount
  }

  getBalanceAmount() {
    let amount = 0

    for (const tokenAsset of this.tokenAssets) {
      amount += this.getBalanceAmountByAsset(tokenAsset.symbol) ?? 0
    }

    return amount
  }

  exchangeBalanceAmountByAsset(assetSymbol: string, currency: Currency, exchange: Exchange) {
    const ratio = exchange[assetSymbol]?.to[currency] ?? null
    if (!ratio) return null

    const amount = this.getBalanceAmountByAsset(assetSymbol)
    if (!amount) return null

    return amount * ratio
  }

  exchangeBalanceAmount(currency: Currency, exchange: Exchange) {
    let exchangedAmount = 0

    for (const tokenAsset of this.tokenAssets) {
      exchangedAmount += this.exchangeBalanceAmountByAsset(tokenAsset.symbol, currency, exchange) ?? 0
    }

    return exchangedAmount
  }

  formattedBalanceAmount(currency: Currency, language: Lang, exchange: Exchange) {
    // Fallback when balance amount is 0
    if (this.getBalanceAmount() === 0) {
      return FilterHelper.currency(0, currency, language)
    }

    const amount = this.exchangeBalanceAmount(currency, exchange)

    return FilterHelper.currency(amount, currency, language)
  }

  async populateTokenAssets() {
    if (!this.address) return

    const request = blockchainServices[this.blockchain].provider
    const response = await request.getBalance(this.address)

    this.tokenAssets = response.balance
      .map(it => {
        const { asset, assetSymbol, assetHash } = it

        if (asset && assetSymbol && assetHash) {
          const tokenAsset = new TokenAsset(asset, assetSymbol, assetHash, this.blockchain)
          tokenAsset.amount = it.amount ?? 0
          return tokenAsset
        }

        return null
      })
      .filter(it => it) as TokenAsset[]
  }

  async populateTransactions(
    tokensPool: TokenAsset[],
    currentPage?: number
  ): Promise<Pagination & { entries: SenderTransaction[] }> {
    if (!this.address) {
      throw Error('Address must be defined')
    }

    // Convert the grouped cache into SenderTransactions
    let senderTxs = this.flattedTransactions
    let counter = 0 // Huge loop interactions protection
    let totalPages: number
    let totalEntries: number
    let pageSize: number

    const hasSomeTxs = (txids: string[]) => senderTxs.some(it => txids.includes(it.transactionHash ?? ''))

    // Make requests until it reaches the cache data
    do {
      const request = blockchainServices[this.blockchain].provider
      const response = await request.getAddressAbstracts(this.address, currentPage)
      totalPages = response.totalPages ?? 0
      totalEntries = response.totalEntries ?? 0
      pageSize = response.pageSize ?? 15

      // Convert to SenderTransactions
      const transactions = await response.toSenderTransaction(tokensPool)

      senderTxs = [...transactions, ...senderTxs]

      const txids = response.transactions.filter(it => it).map(it => it.hash)

      // Try to find similar transactions in cache
      // If it does then break the loop
      if (hasSomeTxs(txids)) break
    } while (this.transactions.length && counter++ < 20)

    // Remove duplications
    const entries = _.chain(senderTxs)
      .uniqBy(it =>
        [it.transactionHash, it.senderAddress, it.sentAt, it.token?.symbol ?? '', it.token?.amount ?? ''].join(':')
      )
      .value()

    const pageNumber = Math.floor(entries.length / pageSize)
    const flattedPendingTransactions = this.flattedPendingTransactions
    entries.forEach(entry => {
      if (
        flattedPendingTransactions.find(
          flattedPendingTransaction => flattedPendingTransaction.transactionHash === entry.transactionHash
        )
      ) {
        flattedPendingTransactions.splice(flattedPendingTransactions.indexOf(entry), 1)
      }
    })

    this.clearTransactions()
    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(flattedPendingTransactions)
    this.transactions = TransactionDateGroup.toTransactionDateGroup(entries)

    return {
      totalPages,
      totalEntries,
      pageSize,
      pageNumber,
      entries,
    }
  }

  static generateTokenAssetsFromPool(pool: Account[]) {
    // Flat balances of all accounts
    const tokenAssets = _.flatMap(pool, it => it.tokenAssets)

    // Discover all assets in this wallet
    const assets = _.uniq(tokenAssets.map(it => it.hash))

    const groupedTokenAssets: TokenAsset[] = []

    for (const assetHash of assets) {
      const filteredTokenAssets = tokenAssets.filter(it => it.hash === assetHash)

      const firstOne = filteredTokenAssets[0]
      if (!firstOne) continue

      const { name, symbol, hash, blockchain } = firstOne

      const tokenAsset = new TokenAsset(name, symbol, hash, blockchain)

      tokenAsset.amount = _.sumBy(filteredTokenAssets, it => it.amount)

      groupedTokenAssets.push(tokenAsset)
    }

    return groupedTokenAssets
  }

  async addPendingTransaction(senderTransaction: SenderTransactionState, transactionHash: string) {
    const senderTx = plainToClass(SenderTransaction, senderTransaction)
    senderTx.sentAt = moment().format()
    senderTx.transactionHash = transactionHash
    senderTx.isPending = true
    senderTx.token = senderTransaction.token

    await senderTx.populateExchange()

    const senderTxs = this.flattedPendingTransactions
    senderTxs.push(senderTx)

    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(senderTxs)

    appBus.emit('addPendingTransaction', senderTx)
  }

  async removePendingTransactions(senderTransaction: SenderTransaction, transactionHash: string | null) {
    if (transactionHash !== null) {
      senderTransaction.sentAt = moment().format()
      senderTransaction.transactionHash = transactionHash
      senderTransaction.isPending = true

      await senderTransaction.populateExchange()

      const senderTxs = this.flattedPendingTransactions.filter(it => it.transactionHash !== transactionHash)

      this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(senderTxs)
    }
  }

  async addPendingUnclaimedGasTransaction(
    amount: number,
    transactionHash: string,
    claimedToken: string,
    claimedTokenHash: string
  ) {
    const senderTx = new SenderTransaction()
    senderTx.senderAddress = 'claim'
    senderTx.receiverAddress = this.address
    senderTx.sentAt = moment().format()
    senderTx.transactionHash = transactionHash
    senderTx.isPending = true
    senderTx.token = new TokenAsset(claimedToken, claimedToken, claimedTokenHash, this.blockchain)
    senderTx.token.amount = amount

    await senderTx.populateExchange()

    const senderTxs = this.flattedPendingTransactions
    senderTxs.push(senderTx)

    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(senderTxs)
  }

  async addPendingWCTransaction(transactionHash: string, qtyInvocations: number) {
    const senderTx = new SenderTransaction()
    senderTx.isPending = true
    senderTx.qtyInvocations = qtyInvocations
    senderTx.transactionHash = transactionHash
    senderTx.sentAt = moment().format()
    senderTx.senderAddress = ''
    senderTx.receiverAddress = ''

    const senderTxs = this.flattedAllTransactions
    senderTxs.push(senderTx)

    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(senderTxs)
  }

  getTokenAssets() {
    return this.tokenAssets
  }

  getPendingTransactions() {
    return this.pendingTransactions
  }
  getTransactions() {
    return this.transactions
  }
  setTokenAssets(tokens: TokenAsset[]) {
    this.tokenAssets = tokens
  }
  clearTransactions() {
    this.transactions = []
  }

  adaptToMultichain() {
    if (!this.blockchain) {
      this.blockchain = 'neoLegacy'
    }
    if (!this.srcIcon) {
      this.srcIcon = getBlockchainLogo(this.blockchain, 'white')
    }
  }
}
