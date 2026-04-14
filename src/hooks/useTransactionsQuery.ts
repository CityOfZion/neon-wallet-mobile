import { useMemo } from 'react'

import type { TGetTransactionsByAddressResponse } from '@cityofzion/blockchain-service'
import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as dateFns from 'date-fns'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'

import { useLanguageSelector, useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { useHiddenTokensByBlockchainSelector, usePendingTransactionsSelector } from './useUtilitySelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type {
  TUseTransactionsGroupedTransactionsByDate,
  TUseTransactionsQueryBuildTransactionsQueryKeyParams,
  TUseTransactionsQueryFetchTransactionParams,
  TUseTransactionsQueryParams,
  TUseTransactionsTransaction,
} from '@/types/hooks'

export const buildTransactionsQueryKey = ({
  blockchain,
  address,
  network,
  dateFrom,
  dateTo,
}: TUseTransactionsQueryBuildTransactionsQueryKeyParams) => {
  const queryKey: any[] = ['transactions', blockchain, address, network]

  if (dateFrom) {
    queryKey.push(DateHelper.format(dateFrom, 'yyyy-MM-dd'))
  }

  if (dateTo) {
    queryKey.push(DateHelper.format(dateTo, 'yyyy-MM-dd'))
  }

  return queryKey
}

async function fetchTransaction({ account, dateFrom, dateTo, page }: TUseTransactionsQueryFetchTransactionParams) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

  let response: TGetTransactionsByAddressResponse<TBlockchainServiceKey>

  if (dateFrom && dateTo && hasFullTransactions(blockchainService)) {
    const dateNow = new Date()

    response = await blockchainService.fullTransactionsDataService.getFullTransactionsByAddress({
      address: account.address,
      dateFrom: dateFrom.toJSON(),
      dateTo: (dateFns.isSameDay(dateTo, dateNow) ? dateNow : dateTo).toJSON(),
      nextPageParams: page,
      pageSize: 50,
    })
  } else {
    response = await blockchainService.blockchainDataService.getTransactionsByAddress({
      address: account.address,
      nextPageParams: page,
    })
  }

  return { transactions: response.transactions, nextPageParams: response.nextPageParams }
}

export const useTransactionsQuery = ({ account, dateFrom, dateTo }: TUseTransactionsQueryParams) => {
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)
  const { pendingTransactions } = usePendingTransactionsSelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()
  const { language } = useLanguageSelector()

  const query = useInfiniteQuery({
    queryKey: buildTransactionsQueryKey({
      blockchain: account.blockchain,
      address: account.address,
      network: selectedNetwork,
      dateFrom,
      dateTo,
    }),
    queryFn: async ({ pageParam: page }) => fetchTransaction({ account, dateFrom, dateTo, page }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextPageParams,
  })

  const aggregatedData = useMemo(() => {
    if (query.isLoading || !query.data) return []

    const allTransactions = query.data.pages.flatMap(page => page.transactions)

    const groupedTransactionsMap = new Map<string, TUseTransactionsTransaction>(
      allTransactions.map(transaction => [transaction.txId, transaction])
    )

    pendingTransactions.forEach(transaction => {
      if (
        transaction.relatedAddress &&
        AccountHelper.predicate({ address: transaction.relatedAddress, blockchain: transaction.blockchain })(account) &&
        (!dateFrom || !dateTo || dateFns.isWithinInterval(transaction.date, { start: dateFrom, end: dateTo }))
      ) {
        groupedTransactionsMap.set(transaction.txId, transaction)
      }
    })

    const sortedTransactions = Array.from(groupedTransactionsMap.values()).sort((a, b) => {
      const newerDate = new Date(a.date)
      const olderDate = new Date(b.date)

      if (newerDate > olderDate) return -1
      if (newerDate < olderDate) return 1

      return 0
    })

    const groupedDataByDates = new Map<string, TUseTransactionsGroupedTransactionsByDate>()

    sortedTransactions.forEach(transaction => {
      const hiddenTokens = hiddenTokensByBlockchain[transaction.blockchain]
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[transaction.blockchain]

      if (!!hiddenTokens && hiddenTokens.length > 0) {
        const isHiddenToken = (tokenHash: string) => {
          return hiddenTokens.includes(service.tokenService.normalizeHash(tokenHash))
        }

        if (transaction.view === 'utxo') {
          transaction.inputs = transaction.inputs.filter(({ token }) => !isHiddenToken(token.hash))
          transaction.outputs = transaction.outputs.filter(({ token }) => !isHiddenToken(token.hash))
        } else {
          transaction.events = transaction.events.filter(event => {
            if (event.eventType !== 'token') return true

            const tokenHash = event.token?.hash

            if (!tokenHash) return true

            return !isHiddenToken(tokenHash)
          })
        }
      }

      const date = DateHelper.format(transaction.date, 'MM-dd-yyyy')
      const existingGroupedData = groupedDataByDates.get(date)
      const formattedDate = DateHelper.formatLocalized(transaction.date, { format: 'PPP', language })

      if (existingGroupedData) {
        existingGroupedData.data.push(transaction)

        return
      }

      groupedDataByDates.set(date, { date, formattedDate, data: [transaction] })
    })

    return Array.from(groupedDataByDates.values())
  }, [account, dateFrom, dateTo, hiddenTokensByBlockchain, language, pendingTransactions, query.data, query.isLoading])

  return { ...query, aggregatedData }
}
