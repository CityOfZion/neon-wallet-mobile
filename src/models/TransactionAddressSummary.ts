import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import moment from '~/node_modules/moment'

@HttpExclude()
export class TransactionAddressSummary {
  @HttpExpose()
  txid: string | null = null

  @HttpExpose()
  time: number | null = null

  @HttpExpose('block_height')
  blockHeight: number | null = null

  @HttpExpose()
  asset: string | null = null

  @HttpExpose()
  amount: string | null = null

  @HttpExpose('address_to')
  addressTo: string | null = null

  @HttpExpose('address_from')
  addressFrom: string | null = null

  dayFormatter: string | null = null

  hourFormatter: string | null = null
}
