import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {TransactionAddressSummary} from '~src/models/TransactionAddressSummary'

@HttpExclude()
export class TransactionAddressResponse {
  @ResponseExpose('total_pages')
  totalPages: number | null = null

  @ResponseExpose('total_entries')
  totalEntries: number | null = null

  @ResponseExpose('page_size')
  pageSize: number | null = null

  @ResponseExpose('page_number')
  pageNumber: number | null = null

  @ResponseExpose()
  @ResponseSerialize(TransactionAddressSummary)
  entries: TransactionAddressSummary[] = []
}
