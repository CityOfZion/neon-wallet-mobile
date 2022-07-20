import { api } from '@cityofzion/dora-ts'

import { NeoLegacyProvider } from './common'

import { Node } from '~/src/models/Node'
import { Transaction } from '~/src/models/Transaction'
import { TransactionAddressAsset } from '~/src/models/TransactionAddressAsset'
import { TransactionAddressSummary } from '~/src/models/TransactionAddressSummary'
import { BalanceInfo } from '~/src/models/response/BalanceInfo'
import { ContractResponse } from '~/src/models/response/ContractResponse'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
type DoraNetworkOptions = 'mainnet' | 'testnet' | 'testnet_rc4'
export class DoraSDKProvider implements NeoLegacyProvider {
  //eslint-disable-next-line
  readonly network: DoraNetworkOptions = 'mainnet'
  readonly siteUrlQuery: string = `https://dora.coz.io/api/v1/neo2/${this.network}/`
  baseNumeric: number
  constructor() {
    this.baseNumeric = 8
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()
    const { page_number, page_size, total_entries, total_pages, entries } = await api.NeoLegacyREST.getAddressAbstracts(
      address,
      page,
      this.network
    )

    result.pageNumber = page_number
    result.pageSize = page_size
    result.totalEntries = total_entries
    result.totalPages = total_pages

    const transactions = new Map<string, TransactionAddressSummary>()

    entries.forEach(({ address_from, address_to, amount, asset, block_height, time, txid }) => {
      const amountConverted = this.convertScientifcNotationToDecimal(amount)

      if (address_from !== address && address_to !== address) {
        return
      }

      const transfer = new TransactionAddressAsset({
        amount: Number(amountConverted),
        hash: asset,
        from: address_from ?? 'Mint',
        to: address_to ?? 'Burn',
      })

      const existingTransaction = transactions.get(txid)

      if (existingTransaction) {
        existingTransaction.transfers.push(transfer)
        return
      }

      const transaction = new TransactionAddressSummary({
        blockHeight: block_height,
        time,
        hash: txid,
      })
      transaction.transfers.push(transfer)
      transactions.set(txid, transaction)
    })

    result.transactions = Array.from(transactions.values())

    return result
  }

  async getBalance(address: string): Promise<BalanceInfo[]> {
    const response = await api.NeoLegacyREST.balance(address, this.network)

    const balances = Array.from(response.values())

    const mappedBalance = balances.map(
      ({ balance, asset, asset_name, symbol }): BalanceInfo => ({
        amount: balance,
        hash: asset,
        name: asset_name,
        symbol,
      })
    )

    return mappedBalance
  }

  async getTransaction(transactionID: string) {
    const result = new Transaction()
    const { block, size, time, txid, type } = await api.NeoLegacyREST.transaction(transactionID, this.network)
    result.txid = txid
    result.type = type
    result.size = size
    result.blockHeight = block
    result.time = Number(time)
    return result
  }

  async getContract(hash: string): Promise<ContractResponse> {
    throw new Error('Method not implemented')
  }

  async getAllNodes() {
    const result = [] as Node[]
    const response = await api.NeoLegacyREST.getAllNodes(this.network)
    const nodes = Array.from(response.values())
    nodes.forEach(({ height, url }) => {
      result.push({ height, url, blockchain: 'neoLegacy' })
    })
    const allNodes = result.sort((node1, node2) => {
      if (node1.height && node2.height) {
        if (node1.height < node2.height) {
          return 1
        } else {
          return -1
        }
      } else {
        return 0
      }
    })

    const nodesHttps = allNodes.filter(node => node.url?.includes('https'))
    const nodesHttp = allNodes.filter(node => !node.url?.includes('https'))

    return [...nodesHttps, ...nodesHttp]
  }

  async getUnclaimed(address: string) {
    const result = new UnclaimedResponse()
    const { unclaimed } = await api.NeoLegacyREST.getUnclaimed(address)
    result.address = address
    result.unclaimed = unclaimed
    return result
  }
  private convertScientifcNotationToDecimal(scientificNotation: number) {
    return String(scientificNotation).includes('e')
      ? new Number(scientificNotation).toFixed(this.baseNumeric)
      : scientificNotation
  }

  async getAssetByHash(hash: string) {
    const response = await api.NeoLegacyREST.asset(hash, this.network)

    if (response) {
      return {
        symbol: response.symbol,
        decimals: Number(response.decimals),
      }
    } else {
      return null
    }
  }
}
