import { api } from '@cityofzion/dora-ts'
import { TypedResponse } from '@cityofzion/dora-ts/dist/interfaces/api/common'
import { AddressTransactionsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'
import { rpc, u, wallet } from '@cityofzion/neon-core-next'
import { Request } from '@simpli/serialized-request'
import { mapValues } from 'lodash'

import n3TokenList from '../../../assets/tokens/n3.json'
import { Neo3Provider } from './common'

import { ContractMethod } from '~/src/models/ContractMethod'
import { ContractParameter } from '~/src/models/ContractParameter'
import { NeoNode } from '~/src/models/NeoNode'
import { Node } from '~/src/models/Node'
import { TokenResponse } from '~/src/models/TokenResponse'
import { Transaction } from '~/src/models/Transaction'
import { TransactionAddressAsset } from '~/src/models/TransactionAddressAsset'
import { TransactionAddressNFT } from '~/src/models/TransactionAddressNFT'
import { TransactionAddressSummary } from '~/src/models/TransactionAddressSummary'
import { BalanceResponse } from '~/src/models/response/BalanceResponse'
import { ContractResponse } from '~/src/models/response/ContractResponse'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
import { ExchangeResponse } from '~/src/types/exchange'
import { IRPCContract } from '~src/blockchain'

export type DoraNetworkOptions = 'mainnet' | 'testnet' | 'testnet_rc4'
export class DoraSDKProvider implements Neo3Provider {
  //eslint-disable-next-line
  readonly network: DoraNetworkOptions = 'mainnet'
  readonly siteUrlQuery = `https://dora.coz.io/transaction/neo3/${this.network}/`
  readonly baseNumeric: number = 8

  constructor(network?: DoraNetworkOptions) {
    if (network) {
      this.network = network
    }
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    const result = new TransactionAddressResponse()

    let txFullResponse: AddressTransactionsResponse | any[] = []

    txFullResponse = await api.NeoRest.addressTXFull(address, page, this.network)

    if (Array.isArray(txFullResponse)) {
      return result
    }

    const { totalCount, items } = txFullResponse
    result.pageNumber = page
    result.pageSize = items.length
    result.totalEntries = totalCount
    result.totalPages = Math.ceil(totalCount / 15)

    for (const item of items) {
      const { block, hash, invocations, notifications, time } = item

      const transaction = new TransactionAddressSummary({
        blockHeight: block,
        hash,
        time: Number(time),
      })
      transaction.qtyInvocations = invocations.length
      transaction.qtyNotifications = notifications.length

      for (const notification of notifications) {
        const { contract, event_name: eventName } = notification
        const state = notification.state as any as TypedResponse[]

        if (eventName !== 'Transfer') {
          continue
        }

        if (state.length !== 3 && state.length !== 4) {
          continue
        }

        const [{ value: from }, { value: to }] = state

        const convertedFrom = from ? this.convertByteStringToAddress(from) : 'Mint'

        const convertedTo = to ? this.convertByteStringToAddress(to) : 'Burn'

        if (convertedFrom !== address && convertedTo !== address) {
          continue
        }

        if (state.length === 3) {
          const [, , { value: amount }] = state

          const asset = new TransactionAddressAsset({
            amount,
            to: convertedTo,
            from: convertedFrom,
            hash: contract,
          })

          transaction.transfers.push(asset)
          continue
        }

        const [, , , { value: tokenId }] = state

        const convertedTokenId = this.convertByteStringToInteger(tokenId)

        const nft = new TransactionAddressNFT({
          tokenId: convertedTokenId,
          to: convertedTo,
          from: convertedFrom,
          hash: contract,
        })

        transaction.transfers.push(nft)
      }

      result.transactions.push(transaction)
    }

    return result
  }

  async getBalance(address: string) {
    const result = new BalanceResponse()
    const response = await api.NeoRest.balance(address, this.network)
    const balances = Array.from(response.values())
    balances.forEach(({ asset, asset_name, balance, symbol }) => {
      result.balance.push({
        amount: balance,
        asset: asset_name,
        assetHash: asset,
        assetSymbol: symbol,
      })
    })
    result.address = address
    return result
  }

  async getContract(hash: string): Promise<ContractResponse> {
    const contract = new ContractResponse()

    const nodes = await this.getAllNodes()
    const url = NeoNode.getHighestNodeUrlFromPool(nodes)
    if (!url) throw new Error('Problem get contract')

    const rpcClient = new rpc.RPCClient(url)

    const response = await rpcClient.execute(
      new rpc.Query<string[], IRPCContract>({
        method: 'getcontractstate',
        params: [hash],
      })
    )

    contract.hash = response.hash
    contract.name = response.manifest.name

    response.manifest.abi?.methods.forEach(method => {
      const contractMethod = new ContractMethod()

      contractMethod.name = method.name

      method.parameters.forEach(parameter => {
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
    const neoRestTransaction = await api.NeoRest.transaction(transactionID, this.network)
    if (neoRestTransaction) {
      const { hash, size, block, time } = neoRestTransaction
      result.txid = hash
      result.size = size
      result.blockHeight = block
      result.time = Number(time)
    }
    return result
  }

  async getExchangeData(params: { tokenAssetSymbols: string[]; currencies: string }) {
    const { tokenAssetSymbols, currencies } = params
    const paramRequest = {
      fsyms: tokenAssetSymbols.join(','),
      tsyms: currencies,
    }

    const response = await Request.get('https://min-api.cryptocompare.com/data/pricemultifull', {
      params: paramRequest,
    })
      .name('syncExchange')
      .as<ExchangeResponse>()
      .getData()

    return mapValues(response.RAW, symbolRef => {
      const symbolRefMap = mapValues(symbolRef, symbolToUse => symbolToUse.PRICE)

      return {
        to: symbolRefMap,
      }
    })
  }

  async getTokenList() {
    return new TokenResponse({ tokens: n3TokenList })
  }

  async getAllNodes() {
    const result = [] as Node[]
    const response = await api.NeoRest.getAllNodes(this.network)

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
    const nodes = await this.getAllNodes()
    const url = NeoNode.getHighestNodeUrlFromPool(nodes)
    if (!url) throw new Error('Problem get unclaimed')

    const rpcClient = new rpc.RPCClient(url)
    const { unclaimed } = await rpcClient.execute(
      new rpc.Query<string[], { unclaimed: string }>({
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

  private convertByteStringToAddress(byteString: string): string {
    const account = new wallet.Account(u.reverseHex(u.HexString.fromBase64(byteString).toString()))

    return account.address
  }

  private convertByteStringToInteger(byteString: string): string {
    const integer = u.BigInteger.fromHex(u.reverseHex(u.HexString.fromBase64(byteString).toString())).toString()

    return integer
  }
}
