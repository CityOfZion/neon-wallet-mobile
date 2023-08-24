import { api } from '@cityofzion/dora-ts'

import { NeoLegacyProvider } from './common'

import { TNetwork } from '~/src/blockchain'
import { Transaction } from '~/src/models/Transaction'
import { TransactionAddressAsset } from '~/src/models/TransactionAddressAsset'
import { TransactionAddressSummary } from '~/src/models/TransactionAddressSummary'
import { BalanceInfo } from '~/src/models/response/BalanceInfo'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
export class DoraSDKProvider implements NeoLegacyProvider {
  constructor(readonly network: TNetwork) {
    if (network.type === 'custom') throw new Error('DoraSDKProvider does not supports custom networks')

    this.network = network
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()
    const { page_number, page_size, total_entries, total_pages, entries } = await api.NeoLegacyREST.getAddressAbstracts(
      address,
      page,
      this.network.type
    )

    result.pageNumber = page_number
    result.pageSize = page_size
    result.totalEntries = total_entries
    result.totalPages = total_pages

    const transactions = new Map<string, TransactionAddressSummary>()

    await Promise.all(
      entries.map(async ({ address_from, address_to, amount, asset, block_height, time, txid }) => {
        if (address_from !== address && address_to !== address) return

        const assetHash = asset.startsWith('0x') ? asset : '0x' + asset

        const assetInfo = await api.NeoLegacyREST.asset(assetHash, this.network.type)
        const decimals = assetInfo.decimals ?? 0
        const symbol = assetInfo.symbol ?? ''

        const transfer = new TransactionAddressAsset({
          amount: amount * 10 ** decimals,
          hash: assetHash,
          from: address_from ?? 'Mint',
          to: address_to ?? 'Burn',
          decimals,
          symbol,
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
    )

    result.transactions = Array.from(transactions.values())

    return result
  }

  async getBalance(address: string): Promise<BalanceInfo[]> {
    const response = await api.NeoLegacyREST.balance(address, this.network.type)

    const balances = Array.from(response.values())

    const mappedBalance = await Promise.all(
      balances.map(async ({ balance, asset, asset_name, symbol }): Promise<BalanceInfo> => {
        const response = await api.NeoLegacyREST.asset(asset, this.network.type)

        return {
          amount: Number(balance),
          hash: asset,
          name: asset_name,
          symbol,
          decimals: Number(response.decimals),
          blockchain: 'neoLegacy',
        }
      })
    )

    return mappedBalance
  }

  async getTransaction(transactionID: string) {
    const result = new Transaction()
    const { block, size, time, txid, type } = await api.NeoLegacyREST.transaction(transactionID, this.network.type)
    result.txid = txid
    result.type = type
    result.size = size
    result.blockHeight = block
    result.time = Number(time)
    return result
  }

  async getUnclaimed(address: string) {
    const result = new UnclaimedResponse()
    const { unclaimed } = await api.NeoLegacyREST.getUnclaimed(address, this.network.type)
    result.address = address
    result.unclaimed = unclaimed
    return result
  }
}
