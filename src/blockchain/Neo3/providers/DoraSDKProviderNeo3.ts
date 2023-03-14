import { api } from '@cityofzion/dora-ts'
import { TypedResponse } from '@cityofzion/dora-ts/dist/interfaces/api/common'
import { u, wallet } from '@cityofzion/n3-neon-core'

import { RPCProviderNeo3 } from './RPCProviderNeo3'
import { Neo3Provider } from './common'

import { TransactionAddressAsset } from '~/src/models/TransactionAddressAsset'
import { TransactionAddressNFT } from '~/src/models/TransactionAddressNFT'
import { TransactionAddressSummary } from '~/src/models/TransactionAddressSummary'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { TNetwork } from '~src/blockchain'
export class DoraSDKProvider extends RPCProviderNeo3 implements Neo3Provider {
  constructor(readonly network: TNetwork) {
    super(network)
  }

  async getAddressAbstracts(address: string, page?: number): Promise<TransactionAddressResponse> {
    if (this.network.type === 'custom') throw new Error('Custom network not supported')

    const result = new TransactionAddressResponse()
    result.pageNumber = page ?? null
    result.pageSize = 15

    const { items, totalCount } = await api.NeoRest.addressTXFull(address, page, this.network.type)

    if (!items || !totalCount) return result

    result.totalEntries = totalCount
    result.totalPages = Math.ceil(totalCount / 15)

    const transactions = await Promise.all(
      items.map(async ({ block, hash, invocations, notifications, time }) => {
        const transaction = new TransactionAddressSummary({
          blockHeight: block,
          hash,
          time: Number(time),
        })
        transaction.qtyInvocations = invocations.length
        transaction.qtyNotifications = notifications.length

        const transfers = await Promise.all(
          notifications.map(async notification => {
            const { contract, event_name: eventName } = notification
            const state = notification.state as any as TypedResponse[]

            if (eventName !== 'Transfer') return

            const isAsset = state.length === 3
            const isNFT = state.length === 4

            if (!isAsset && !isNFT) return

            const [{ value: from }, { value: to }] = state
            const convertedFrom = from ? this.convertByteStringToAddress(from) : 'Mint'
            const convertedTo = to ? this.convertByteStringToAddress(to) : 'Burn'

            if (convertedFrom !== address && convertedTo !== address) return

            if (isAsset) {
              const [, , { value: amount }] = state

              const assetInfo = await api.NeoRest.asset(contract, this.network.type)

              return new TransactionAddressAsset({
                amount,
                to: convertedTo,
                from: convertedFrom,
                hash: contract,
                decimals: assetInfo.decimals ? Number(assetInfo.decimals) : 0,
                symbol: assetInfo.symbol ?? '',
              })
            }

            const [, , , { value: tokenId }] = state
            const convertedTokenId = this.convertByteStringToInteger(tokenId)

            return new TransactionAddressNFT({
              tokenId: convertedTokenId,
              to: convertedTo,
              from: convertedFrom,
              hash: contract,
            })
          })
        )

        const filteredTransfers = transfers.filter(
          (transfer): transfer is TransactionAddressAsset | TransactionAddressNFT => transfer !== undefined
        )

        transaction.transfers = filteredTransfers

        return transaction
      })
    )

    result.transactions = transactions

    return result
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
