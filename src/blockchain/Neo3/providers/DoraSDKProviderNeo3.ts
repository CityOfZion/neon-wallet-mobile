import {api} from '@cityofzion/dora-ts'
import {rpc, u} from '@cityofzion/neon-js-next'
import {Request} from '@simpli/serialized-request'
import {mapValues} from 'lodash'

import {Neo3Provider} from './common'

import {NeoNode} from '~/src/models/NeoNode'
import {Node} from '~/src/models/Node'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'
import {ExchangeResponse} from '~/src/types/exchange'
import {TokenResponse} from '~/src/types/token'

type DoraNetworkOptions = 'mainnet' | 'testnet' | 'testnet_rc4'
export class DoraSDKProvider implements Neo3Provider {
  readonly network: DoraNetworkOptions = __DEV__ ? 'testnet_rc4' : 'mainnet'
  readonly baseNumeric: number = 8
  constructor(network?: DoraNetworkOptions) {
    if (network) {
      this.network = network
    }
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()
    const {
      page_number,
      page_size,
      total_entries,
      total_pages,
      entries,
    } = await api.NeoRest.getAddressAbstracts(address, page, this.network)

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
          txid,
        })
      }
    )
    return result
  }

  async getBalance(address: string) {
    const result = new BalanceResponse()
    const response = await api.NeoRest.balance(address, this.network)
    const balances = Array.from(response.values())
    balances.forEach(({asset, asset_name, balance, symbol}) => {
      result.balance.push({
        amount: balance,
        asset: asset_name,
        assetHash: asset,
        assetSymbol: symbol,
      })
    })
    return result
  }
  async getTransaction(transactionID: string) {
    const result = new Transaction()
    const {block, size, time, hash} = await api.NeoRest.transaction(
      transactionID,
      this.network
    )
    result.txid = hash
    result.size = size
    result.blockHeight = block
    result.time = Number(time)
    return result
  }

  async getExchangeData(params: {
    tokenAssetSymbols: string[]
    currencies: string
  }) {
    const {tokenAssetSymbols, currencies} = params
    const paramRequest = {
      fsyms: tokenAssetSymbols.join(','),
      tsyms: currencies,
    }

    const response = await Request.get(
      'https://min-api.cryptocompare.com/data/pricemultifull',
      {params: paramRequest}
    )
      .name('syncExchange')
      .as<ExchangeResponse>()
      .getData()

    return mapValues(response.RAW, (symbolRef) => {
      const symbolRefMap = mapValues(
        symbolRef,
        (symbolToUse) => symbolToUse.PRICE
      )

      return {
        to: symbolRefMap,
      }
    })
  }

  async getTokenList() {
    return Request.get(
      `https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json?timestamp=${new Date().getTime()}`
    )
      .name('getTokens')
      .as<TokenResponse>()
      .getData()
  }

  async getAllNodes() {
    const result = [] as Node[]
    const response = await api.NeoRest.getAllNodes(this.network)
    const nodes = Array.from(response.values())
    nodes.forEach(({height, url}) => {
      result.push({height, url, blockchain: 'neoLegacy'})
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

    const nodesHttps = allNodes.filter((node) => node.url?.includes('https'))
    const nodesHttp = allNodes.filter((node) => !node.url?.includes('https'))

    return [...nodesHttps, ...nodesHttp]
  }

  async getUnclaimed(address: string) {
    const result = new UnclaimedResponse()
    const nodes = await this.getAllNodes()
    const url = NeoNode.getHighestNodeUrlFromPool(nodes)
    if (!url) throw new Error('Problem get unclaimed')

    const rpcClient = new rpc.RPCClient(url)
    const {unclaimed} = await rpcClient.execute(
      new rpc.Query<string[], {unclaimed: string}>({
        method: 'getunclaimedgas',
        params: [address],
      })
    )
    const unclaimedResult = u.BigInteger.fromNumber(unclaimed).toDecimal(8)
    result.address = address
    result.unclaimed = Number(unclaimedResult)
    return result
  }

  private convertScientifcNotationToDecimal(scientificNotation: number) {
    return String(scientificNotation).includes('e')
      ? new Number(scientificNotation).toFixed(this.baseNumeric)
      : scientificNotation
  }
}
