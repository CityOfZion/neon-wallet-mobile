import {api} from '@cityofzion/dora-ts'

import {NeoscanProvider} from '../providers/NeoscanProvider'
import {NeoLegacyProvider} from './common'

import {NeoNode} from '~/src/models/NeoNode'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'
type DoraNetworkOptions = 'mainnet' | 'testnet'
export class DoraSDKProvider implements NeoLegacyProvider {
  readonly network: DoraNetworkOptions
  baseNumeric: number
  constructor() {
    this.network = 'mainnet'
    this.baseNumeric = 8
  }
  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()
    const {
      page_number,
      page_size,
      total_entries,
      total_pages,
      entries,
    } = await api.NeoLegacyREST.getAddressAbstracts(address, page, this.network)

    result.pageNumber = page_number
    result.pageSize = page_size
    result.totalEntries = total_entries
    result.totalPages = total_pages
    entries.forEach(
      ({address_from, address_to, amount, asset, block_height, time, txid}) => {
        const amountConverted = this.convertScientifcNotationToDecimal(amount)
        result.entries.push({
          addressFrom: address_from,
          addressTo: address_to,
          amount: String(amountConverted),
          asset,
          blockHeight: block_height,
          time,
          txid: txid.replace('0x', ''),
        })
      }
    )
    return result
  }
  async getBalance(address: string) {
    const result = new BalanceResponse()
    const response = await api.NeoLegacyREST.balance(address, this.network)
    const balances = Array.from(response.values())
    balances.forEach(({asset, asset_name, balance, symbol}) => {
      result.balance.push({
        amount: balance,
        asset: asset_name,
        assetHash: asset.replace('0x', ''),
        assetSymbol: symbol,
      })
    })
    return result
  }
  async getTransaction(transactionID: string) {
    const result = new Transaction()
    const {block, size, time, txid, type} = await api.NeoLegacyREST.transaction(
      transactionID,
      this.network
    )
    result.txid = txid
    result.type = type
    result.size = size
    result.blockHeight = block
    result.time = Number(time)
    return result
  }
  async getAllNodes() {
    const result = [] as NeoNode[]
    const response = await api.NeoLegacyREST.getAllNodes(this.network)
    const nodes = Array.from(response.values())
    nodes.forEach(({height, url}) => {
      result.push({height, url})
    })
    return result
  }
  async getUnclaimed(address: string) {
    const result = new UnclaimedResponse()
    const {unclaimed} = await api.NeoLegacyREST.getUnclaimed(address)
    result.address = address
    result.unclaimed = unclaimed
    return result
  }
  private convertScientifcNotationToDecimal(scientificNotation: number) {
    return scientificNotation * Math.pow(10, this.baseNumeric)
  }
}
