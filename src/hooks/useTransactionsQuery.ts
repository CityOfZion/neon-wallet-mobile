import { useMemo } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'

import { useLanguageSelector, useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { useAccountMapSelector } from './useAccountSelector'
import { useHiddenTokensByBlockchainSelector, usePendingTransactionsSelector } from './useUtilitySelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type {
  IAccountState,
  TAccountWithWallet,
  TUseTransactionsGroupedTransactionsByDate,
  TUseTransactionsTransaction,
} from '@/types/store'

export const buildTransactionsQueryKey = (blockchain: TBlockchainServiceKey, address: string, network: TNetwork) => {
  const queryKey: any[] = ['transactions', blockchain, address, network]

  return queryKey
}

async function fetchTransaction(
  account: IAccountState,
  pageParam: any,
  allAccountsMap: Map<string, TAccountWithWallet>
) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const response = await blockchainService.blockchainDataService.getTransactionsByAddress({
    address: account.address,
    nextPageParams: pageParam,
  })

  const blockchain = account.blockchain

  const transactionsMap = new Map<string, TUseTransactionsTransaction>()

  response.transactions.forEach(transaction => {
    const events = transaction.events.map(({ from, to, ...event }) => ({
      ...event,
      from,
      to,
      fromAccount: from ? allAccountsMap.get(AccountHelper.buildAccountKey({ address: from, blockchain })) : undefined,
      toAccount: to ? allAccountsMap.get(AccountHelper.buildAccountKey({ address: to, blockchain })) : undefined,
    }))

    transactionsMap.set(transaction.txId, {
      ...transaction,
      account,
      blockchain,
      isPending: false,
      events,
    })
  })

  return { transactionsMap, nextPageParams: response.nextPageParams }
}

export const useTransactionsQuery = (account: IAccountState) => {
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)
  const { pendingTransactions } = usePendingTransactionsSelector()
  const { accountsMapRef } = useAccountMapSelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()
  const { language } = useLanguageSelector()

  const query = useInfiniteQuery({
    queryKey: buildTransactionsQueryKey(account.blockchain, account.address, selectedNetwork),
    queryFn: async ({ pageParam }) => fetchTransaction(account, pageParam, accountsMapRef.current),
    initialPageParam: undefined as any,
    getNextPageParam: lastPage => lastPage.nextPageParams,
  })

  const aggregatedData = useMemo(() => {
    if (query.isLoading || !query.data) return []

    let groupedTransactionsMap = new Map<string, TUseTransactionsTransaction>()
    const allTransactionsMap = cloneDeep(query.data.pages.flatMap(page => page.transactionsMap))

    allTransactionsMap.forEach(transactionsMap => {
      groupedTransactionsMap = new Map<string, TUseTransactionsTransaction>([
        ...groupedTransactionsMap,
        ...transactionsMap,
      ])
    })

    pendingTransactions.forEach(transaction => {
      if (AccountHelper.predicate(transaction.account)(account)) {
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
        transaction.events = transaction.events.filter(event => {
          if (event.eventType === 'nft') return true
          return !hiddenTokens.includes(service.tokenService.normalizeHash(event.contractHash))
        })
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
  }, [account, hiddenTokensByBlockchain, language, pendingTransactions, query.data, query.isLoading])

  return { ...query, aggregatedData }
}
