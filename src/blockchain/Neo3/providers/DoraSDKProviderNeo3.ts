import {api} from '@cityofzion/dora-ts'
import {AddressTransactionsResponse} from '@cityofzion/dora-ts/dist/interfaces/api/neo'
import {TransactionEnhanced} from '@cityofzion/dora-ts/dist/interfaces/api/neo/interface'
import {rpc, u} from '@cityofzion/neon-js-next'
import {Request} from '@simpli/serialized-request'
import {mapValues} from 'lodash'

import {Neo3Provider} from './common'

import {ContractMethod} from '~/src/models/ContractMethod'
import {ContractParameter} from '~/src/models/ContractParameter'
import {NeoNode} from '~/src/models/NeoNode'
import {Node} from '~/src/models/Node'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {ContractResponse} from '~/src/models/response/ContractResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'
import {ExchangeResponse} from '~/src/types/exchange'
import {TokenResponse} from '~/src/types/token'

type DoraNetworkOptions = 'mainnet' | 'testnet' | 'testnet_rc4'
export class DoraSDKProvider implements Neo3Provider {
  //eslint-disable-next-line
  readonly network: DoraNetworkOptions = __DEV__ ? 'mainnet' : 'mainnet'
  readonly baseNumeric: number = 8
  constructor(network?: DoraNetworkOptions) {
    if (network) {
      this.network = network
    }
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()

    let txFullResponse: AddressTransactionsResponse | any[] = []

    txFullResponse = await api.NeoRest.addressTXFull(address)

    if (!Array.isArray(txFullResponse)) {
      const {totalCount, items} = txFullResponse
      result.pageNumber = page
      result.pageSize = items.length
      result.totalEntries = totalCount

      for (const {
        block,
        invocations,
        notifications,
        time,
        transfers,
      } of items) {
        for (const {amount, scripthash, to, from, txid} of transfers) {
          const asset = await this.getAssetByHash(scripthash)
          result.entries.push({
            addressFrom: from,
            addressTo: to,
            amount: String(
              Number(amount) /
                (asset?.decimals && asset.decimals > 0
                  ? 10 ** asset.decimals
                  : 1)
            ),
            asset: scripthash,
            blockHeight: block,
            time: Number(time.replace('.', '')) / 1000, //dora endpoint is returning prop "time" as string with dot and with 3 zeros, so needs to remove dot and divide by 1000 to can convert to date using new Date()
            txid,
            qtyInvocations: invocations.length,
            qtyNotifications: notifications.length,
            symbol: asset ? asset.symbol : undefined,
          })
        }
      }
    } else {
      result.totalPages = 1
      result.totalEntries = 0
      result.pageSize = 15
      result.pageNumber = 1
      result.entries = []
    }

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

  async getContract(hash: string): Promise<ContractResponse> {
    const contract = new ContractResponse()

    const response = await api.NeoRest.contract(hash, this.network)

    contract.hash = response.hash
    contract.name = response.manifest.name

    response.manifest.abi?.methods.forEach((method) => {
      const contractMethod = new ContractMethod()

      contractMethod.name = method.name

      method.parameters.forEach((parameter) => {
        const contractParameter = new ContractParameter()

        contractParameter.name = parameter.name
        contractParameter.type = parameter.type

        contractMethod.parameters.push(contractParameter)
      })

      contract.methods.push(contractMethod)
    })

    return contract
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

  async getAssetByHash(hash: string) {
    const response = await api.NeoRest.asset(hash, this.network)

    if (response) {
      return {
        symbol: response.symbol,
        decimals: Number(response.decimals),
      }
    } else {
      return null
    }
  }

  private convertScientifcNotationToDecimal(scientificNotation: number) {
    return String(scientificNotation).includes('e')
      ? new Number(scientificNotation).toFixed(this.baseNumeric)
      : scientificNotation
  }
}
