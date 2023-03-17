import { rpc, u } from '@cityofzion/neon-core'

import { Neo3Provider } from './common'

import { Transaction } from '~/src/models/Transaction'
import { BalanceInfo } from '~/src/models/response/BalanceInfo'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'
import { TNetwork } from '~src/blockchain'

export class RPCProviderNeo3 implements Neo3Provider {
  constructor(readonly network: TNetwork) {}

  async getAddressAbstracts(_address: string, _page?: number): Promise<TransactionAddressResponse> {
    throw new Error('Method not supported.')
  }

  async getBalance(address: string): Promise<BalanceInfo[]> {
    const rpcClient = new rpc.RPCClient(this.network.url)
    const response = await rpcClient.getNep17Balances(address)

    const balances = await Promise.all(
      response.balance.map(async (balance): Promise<BalanceInfo> => {
        const {
          manifest: { name },
        } = await rpcClient.getContractState(balance.assethash)

        const decimalsResponse = await rpcClient.invokeFunction(balance.assethash, 'decimals')
        const decimals = Number(decimalsResponse.stack[0].value)

        const symbolResponse = await rpcClient.invokeFunction(balance.assethash, 'symbol')
        const symbol = u.base642utf8(symbolResponse.stack[0].value as string)

        return {
          amount: this.formatAmount(balance.amount, decimals),
          hash: balance.assethash,
          name,
          symbol,
          decimals,
          blockchain: 'neo3',
        }
      })
    )

    return balances
  }

  async getTransaction(hash: string) {
    const rpcClient = new rpc.RPCClient(this.network.url)
    const response = await rpcClient.getRawTransaction(hash, true)

    const transaction = new Transaction()
    transaction.txid = response.hash
    transaction.size = response.size
    transaction.blockHeight = response.validuntilblock
    transaction.time = Number(response.blocktime)

    return transaction
  }

  async getUnclaimed(address: string) {
    const rpcClient = new rpc.RPCClient(this.network.url)
    const unclaimed = await rpcClient.getUnclaimedGas(address)
    const unclaimedResult = u.BigInteger.fromNumber(unclaimed).toDecimal(8)

    const result = new UnclaimedResponse()
    result.address = address
    result.unclaimed = Number(unclaimedResult)

    return result
  }

  private formatAmount(amount: string, decimals: number | string) {
    const amountNumber = Number(amount)
    return amountNumber / 10 ** Number(decimals)
  }
}
