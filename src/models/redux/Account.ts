import {wallet} from '@cityofzion/neon-js'
import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import {plainToClass} from 'class-transformer'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {Wallet} from '~src/models/redux/Wallet'
import {Exchange} from '~src/types/exchange'
import {Pagination} from '~src/types/pagination'

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
  srcIcon: ImageLoadEventData | null = null

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

  static async fetchTokenAssets(address: string) {
    try {
      const request = Facade.app.blockchainDataProvider
      const response = await request.getBalance(address)

      const tokenAssets = response.balance
        .map((it) => {
          const {asset, assetSymbol, assetHash} = it

          if (asset && assetSymbol && assetHash) {
            const tokenAsset = new TokenAsset(asset, assetSymbol, assetHash)
            tokenAsset.amount = it.amount ?? 0
            return tokenAsset
          }

          return null
        })
        .filter((it) => it) as TokenAsset[]

      return tokenAssets
    } catch (error) {
      console.log(error)
      throw new Error(`Problem to request tokens account ${address}`)
    }
  }

  get hasFunds() {
    return Facade.lodash.sumBy(this.tokenAssets, (it) => it.amount ?? 0) > 0
  }

  getWallet(pool: Wallet[]) {
    return pool.find((it) => it.id === this.idWallet)
  }

  getAccountsWithSameWallet(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.idWallet)
  }

  async getWif() {
    return (await Facade.security.loadWif(this.address ?? '')) ?? null
  }

  async getNeoAccount() {
    const wif = await this.getWif()
    return wif ? new wallet.Account(wif) : null
  }

  get allTransactions() {
    return [...this.pendingTransactions, ...this.transactions]
  }

  get flattedTransactions() {
    return this.transactions.flatMap((it) => it.transactions)
  }

  get flattedPendingTransactions() {
    return this.pendingTransactions.flatMap((it) => it.transactions)
  }

  get flattedAllTransactions() {
    return this.allTransactions.flatMap((it) => it.transactions)
  }

  getBalanceAmountByAsset(assetSymbol: string) {
    const tokenAsset = this.tokenAssets.find((it) => it.symbol === assetSymbol)
    if (!tokenAsset) return null

    return tokenAsset.amount ?? 0
  }

  getBalanceAmount() {
    let amount = 0

    for (const tokenAsset of this.tokenAssets) {
      amount += this.getBalanceAmountByAsset(tokenAsset.symbol) ?? 0
    }

    return amount
  }

  exchangeBalanceAmountByAsset(
    assetSymbol: string,
    currency: Currency,
    exchange: Exchange
  ) {
    const ratio = exchange[assetSymbol]?.to[currency] ?? null
    if (!ratio) return null

    const amount = this.getBalanceAmountByAsset(assetSymbol)
    if (!amount) return null

    return amount * ratio
  }

  exchangeBalanceAmount(currency: Currency, exchange: Exchange) {
    let exchangedAmount = 0

    for (const tokenAsset of this.tokenAssets) {
      exchangedAmount +=
        this.exchangeBalanceAmountByAsset(
          tokenAsset.symbol,
          currency,
          exchange
        ) ?? 0
    }

    return exchangedAmount
  }

  formattedBalanceAmount(
    currency: Currency,
    language: Lang,
    exchange: Exchange
  ) {
    // Fallback when balance amount is 0
    if (this.getBalanceAmount() === 0) {
      return Facade.filter.currency(0, currency, language)
    }

    const amount = this.exchangeBalanceAmount(currency, exchange)

    return Facade.filter.currency(amount, currency, language)
  }

  async populateTokenAssets() {
    if (!this.address) return

    const request = Facade.app.blockchainDataProvider
    const response = await request.getBalance(this.address)

    this.tokenAssets = response.balance
      .map((it) => {
        const {asset, assetSymbol, assetHash} = it

        if (asset && assetSymbol && assetHash) {
          const tokenAsset = new TokenAsset(asset, assetSymbol, assetHash)
          tokenAsset.amount = it.amount ?? 0
          return tokenAsset
        }

        return null
      })
      .filter((it) => it) as TokenAsset[]
  }

  async populateTransactions(
    tokensPool: TokenAsset[],
    currentPage?: number
  ): Promise<Pagination & {entries: SenderTransaction[]}> {
    if (!this.address) {
      throw Error('Address must be defined')
    }

    // Convert the grouped cache into SenderTransactions
    let senderTxs = this.flattedTransactions
    let counter = 0 // Huge loop interactions protection
    let totalPages: number
    let totalEntries: number
    let pageSize: number

    const hasSomeTxs = (txids: string[]) =>
      senderTxs.some((it) => txids.includes(it.transactionHash ?? ''))

    // Make requests until it reaches the cache data
    do {
      const request = Facade.app.blockchainDataProvider
      const response = await request.getAddressAbstracts(
        this.address,
        currentPage
      )
      totalPages = response.totalPages ?? 0
      totalEntries = response.totalEntries ?? 0
      pageSize = response.pageSize ?? 15

      // Convert to SenderTransactions
      const transactions = await response.toSenderTransaction(tokensPool)

      senderTxs = [...transactions, ...senderTxs]

      const txids = response.entries
        .map((it) => it.txid ?? '')
        .filter((it) => it)

      // Try to find similar transactions in cache
      // If it does then break the loop
      if (hasSomeTxs(txids)) break
    } while (this.transactions.length && counter++ < 20)

    // Remove duplications
    const entries = Facade.lodash
      .chain(senderTxs)
      .uniqBy((it) =>
        [
          it.transactionHash,
          it.senderAddress,
          it.sentAt,
          it.token?.symbol ?? '',
          it.token?.amount ?? '',
        ].join(':')
      )
      .value()

    const pageNumber = Math.floor(entries.length / pageSize)

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
    const tokenAssets = Facade.lodash.flatMap(pool, (it) => it.tokenAssets)

    // Discover all assets in this wallet
    const assets = Facade.lodash.uniq(tokenAssets.map((it) => it.symbol))

    const groupedTokenAssets: TokenAsset[] = []

    for (const assetSymbol of assets) {
      const filteredTokenAssets = tokenAssets.filter(
        (it) => it.symbol === assetSymbol
      )

      const firstOne = filteredTokenAssets[0]
      if (!firstOne) continue

      const {name, symbol, hash} = firstOne

      const tokenAsset = new TokenAsset(name, symbol, hash)

      tokenAsset.amount = Facade.lodash.sumBy(
        filteredTokenAssets,
        (it) => it.amount
      )

      groupedTokenAssets.push(tokenAsset)
    }

    return groupedTokenAssets
  }

  async addPendingTransaction(
    senderTransaction: SenderTransactionState,
    transactionHash: string
  ) {
    const senderTx = plainToClass(SenderTransaction, senderTransaction)
    senderTx.sentAt = Facade.moment().format()
    senderTx.transactionHash = transactionHash
    senderTx.isPending = true
    senderTx.token = senderTransaction.token

    await senderTx.populateExchange()

    const senderTxs = this.flattedPendingTransactions
    senderTxs.push(senderTx)

    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(
      senderTxs
    )

    Facade.bus.emit('addPendingTransaction', senderTx)
  }

  async addPendingUnclaimedGasTransaction(
    amount: number,
    transactionHash: string
  ) {
    const senderTx = new SenderTransaction()
    senderTx.senderAddress = 'claim'
    senderTx.receiverAddress = this.address
    senderTx.sentAt = Facade.moment().format()
    senderTx.transactionHash = transactionHash
    senderTx.isPending = true
    senderTx.token = new TokenAsset('GAS', 'GAS', Facade.app.gasHash)
    senderTx.token.amount = amount

    await senderTx.populateExchange()

    const senderTxs = this.flattedPendingTransactions
    senderTxs.push(senderTx)

    this.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(
      senderTxs
    )

    Facade.bus.emit('addPendingUnclaimedGasTransaction', senderTx)
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
}
