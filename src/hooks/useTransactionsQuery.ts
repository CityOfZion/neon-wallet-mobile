import { useMemo } from 'react'

import { hasExplorerService } from '@cityofzion/blockchain-service'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as dateFns from 'date-fns'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { ReduxHelper } from '@/helpers/ReduxHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useLanguageSelector, useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { usePendingTransactionsSelector } from './useUtilitySelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TUseTransactionsQueryAggregatedData } from '@/types/query'
import type { IAccountState, TTransaction } from '@/types/store'

export const buildTransactionsQueryKey = (blockchain: TBlockchainServiceKey, address: string, network: TNetwork) => {
  const queryKey: any[] = ['transactions', blockchain, address, network]

  return queryKey
}

async function fetchTransaction(account: IAccountState, pageParam: any) {
  const state = ReduxHelper.store.getState()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const response = await blockchainService.blockchainDataService.getTransactionsByAddress({
    address: account.address,
    nextPageParams: pageParam,
  })

  const transactions: TTransaction[] = []

  const promises = response.transactions.map(async transaction => {
    const swapRecord = state.utility.data.swapRecords.find(
      ({ txFrom }) => !!txFrom && blockchainService.tokenService.predicateByHash(transaction.hash, txFrom)
    )

    const hiddenTokens = state.utility.data.hiddenTokensByBlockchain[account.blockchain]
    const transfers =
      !!hiddenTokens && hiddenTokens.length > 0
        ? transaction.transfers.filter(transfer => {
            if (transfer.type === 'nft') return true

            return !hiddenTokens.includes(blockchainService.tokenService.normalizeHash(transfer.contractHash))
          })
        : transaction.transfers

    const [transactionUrl] = UtilsHelper.tryCatch(() => {
      if (hasExplorerService(blockchainService)) {
        return blockchainService.explorerService.buildTransactionUrl(transaction.hash)
      }
    })

    transactions.push({
      ...transaction,
      transfers,
      account,
      swapRecord,
      transactionUrl,
    })
  })

  await Promise.allSettled(promises)

  return { transactions, nextPageParams: response.nextPageParams }
}

export const useTransactionsQuery = (account: IAccountState) => {
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)
  const { pendingTransactions } = usePendingTransactionsSelector()
  const { language } = useLanguageSelector()

  const query = useInfiniteQuery({
    queryKey: buildTransactionsQueryKey(account.blockchain, account.address, selectedNetwork),
    queryFn: async ({ pageParam }) => fetchTransaction(account, pageParam),
    initialPageParam: undefined as any,
    getNextPageParam: lastPage => lastPage.nextPageParams,
  })

  const aggregatedData = useMemo(() => {
    const transactionsPerDate = new Map<string, TUseTransactionsQueryAggregatedData>()
    const pendingTransactionHashes = new Set<string>()

    if (pendingTransactions.length > 0)
      pendingTransactions.forEach(pendingTransaction => {
        if (AccountHelper.predicateNot(pendingTransaction.account)(account)) return

        const date = new Date(pendingTransaction.time * 1000)
        const formattedDate = dateFns.format(date, 'yyyy-MM-dd')
        const transactionPerDate = transactionsPerDate.get(formattedDate)

        if (transactionPerDate) {
          transactionPerDate.pendingData.push(pendingTransaction)

          return
        }

        transactionsPerDate.set(formattedDate, {
          data: [],
          pendingData: [pendingTransaction],
          date,
          localizedDate: DateHelper.formatLocalized(date, { format: 'PPP', language }),
        })
        pendingTransactionHashes.add(pendingTransaction.hash)
      })

    query.data?.pages
      ?.flatMap(page => page.transactions)
      .forEach(transaction => {
        if (pendingTransactionHashes.has(transaction.hash)) return

        const date = new Date(transaction.time * 1000)
        const formattedDate = dateFns.format(date, 'yyyy-MM-dd')
        const transactionPerDate = transactionsPerDate.get(formattedDate)

        if (transactionPerDate) {
          transactionPerDate.data.push(transaction)

          return
        }

        transactionsPerDate.set(formattedDate, {
          data: [transaction],
          pendingData: [],
          date,
          localizedDate: DateHelper.formatLocalized(date, { format: 'PPP', language }),
        })
      })

    return Array.from(transactionsPerDate.values()).sort((a, b) => {
      if (a.date > b.date) return -1
      if (a.date < b.date) return 1

      return 0
    })
  }, [account, pendingTransactions, query.data?.pages, language])

  return { ...query, aggregatedData }
}
