import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { showMessage } from 'react-native-flash-message'

import { TransactionsList } from './TransactionsList'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { useExchange } from '~/src/hooks/useExchange'
import { TransactionTransferType } from '~/src/models/TransactionAddressSummary'
import { Account } from '~/src/models/redux/Account'
import { NFTResponse } from '~/src/models/response/NFTResponse'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
export interface AccountTransactionsScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountTransactionsScreen'>
}

type FormattedTransfer = {
  hash: string
  from: string
  to: string
}

export type FormattedTransferAsset = FormattedTransfer & {
  amount: string
  symbol: string
  type: TransactionTransferType.ASSET
}

export type FormattedTransferNFT = FormattedTransfer & {
  type: TransactionTransferType.NFT
  name: string
  image: string
  collectionName: string
  tokenId: string
}

export type FormattedTransaction = {
  hash: string
  time: number
  qtyInvocations: number
  qtyNotifications: number
  transfers: (FormattedTransferAsset | FormattedTransferNFT)[]
}

export type FormattedTransactionPerDate = Record<string, FormattedTransaction[]>

const AccountTransactionsScreen = (props: Props) => {
  const { account } = props.route.params

  const { blockchainService } = useBlockchainService(account.blockchain)
  const { data: exchange } = useExchange()

  const [completedTransactions, setCompletedTransactions] = useState<FormattedTransaction[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<FormattedTransaction[]>([])
  const [hasMoreTransactionsToLoad, setHasMoreTransactionsToLoad] = useState(true)

  const pageControl = useRef<number>(1)
  const requestControl = useRef<boolean>(false)
  const nftCache = useRef<Map<string, NFTResponse>>(new Map())

  const getNFTInfo = useCallback(async (tokenId: string, hash: string) => {
    const cachedNFT = nftCache.current.get(tokenId)
    if (cachedNFT) return cachedNFT

    try {
      if (!blockchainService.hasNFTIntegration()) return

      const nftResponse = await blockchainService.getNFT(tokenId, hash)
      nftCache.current.set(tokenId, nftResponse)
      return nftResponse
    } catch {}
  }, [])

  const handleEndReached = async () => {
    loadCompletedTransactions()
  }

  const loadCompletedTransactions = useCallback(async () => {
    if (account.address && !requestControl.current && hasMoreTransactionsToLoad) {
      requestControl.current = true

      try {
        const { transactions, totalPages } = await blockchainService.provider.getAddressAbstracts(
          account.address,
          pageControl.current
        )

        const formattedTransactions = await Promise.all(
          transactions.map(async transaction => {
            const formattedTransfers = await Promise.all(
              transaction.transfers.map(
                async (transfer): Promise<FormattedTransferAsset | FormattedTransferNFT | undefined> => {
                  if (transfer.type === TransactionTransferType.ASSET) {
                    return {
                      ...transfer,
                      amount: String(transfer.amount / 10 ** transfer.decimals),
                    }
                  }

                  const nftInfo = await getNFTInfo(transfer.tokenId, transfer.hash)
                  if (!nftInfo) return

                  return {
                    ...transfer,
                    collectionName: nftInfo.collectionName ?? '',
                    image: nftInfo.image ?? '',
                    name: nftInfo.name ?? '',
                  }
                }
              )
            )

            const filteredTransfers = formattedTransfers.filter(
              (transfer): transfer is FormattedTransferAsset | FormattedTransferNFT => !!transfer
            )

            return {
              hash: transaction.hash,
              qtyInvocations: transaction.qtyInvocations,
              qtyNotifications: transaction.qtyNotifications,
              time: transaction.time,
              transfers: filteredTransfers,
            }
          })
        )

        setCompletedTransactions(prevState => [...formattedTransactions, ...prevState])

        pageControl.current += 1
        requestControl.current = false

        if (totalPages && pageControl.current < totalPages) {
          setHasMoreTransactionsToLoad(true)
        } else {
          setHasMoreTransactionsToLoad(false)
        }

        return formattedTransactions
      } catch {
        showMessage({
          message: i18n.t('screens.accountTransaction.errorToGetTransactions'),
          type: 'danger',
        })
        setHasMoreTransactionsToLoad(false)
      }
    }
  }, [account, getNFTInfo])

  const loadPendingTransactions = useCallback(
    async (completedTransaction: FormattedTransaction[]) => {
      const filteredTransactions = account.pendingTransactions.filter(
        transaction => !completedTransaction.some(({ hash }) => hash === transaction.hash)
      )

      const formattedTransactions = filteredTransactions.map(
        ({ senderAddress, receiverAddress, token, hash, time, amount }): FormattedTransaction => ({
          hash,
          qtyInvocations: 0,
          qtyNotifications: 0,
          time,
          transfers: [
            {
              from: senderAddress,
              to: receiverAddress,
              amount: String(amount),
              hash: token.hash,
              symbol: token.symbol,
              type: TransactionTransferType.ASSET,
            },
          ],
        })
      )

      setPendingTransactions(formattedTransactions)
    },
    [account]
  )

  const populateTransactions = useCallback(async () => {
    const completedTransaction = await loadCompletedTransactions()
    await loadPendingTransactions(completedTransaction ?? [])
  }, [loadCompletedTransactions, loadPendingTransactions])

  useEffect(() => {
    Await.run('populateTransactions', populateTransactions)
  }, [loadCompletedTransactions])

  return (
    <ScreenLayout darkerSolidColorBG scrollable={false}>
      <AccountSubTitle account={account} />
      <AwaitActivity name="populateTransactions" loadingView={<ScreenLoader />}>
        <TransactionsList
          account={account}
          exchange={exchange}
          completedTransactions={completedTransactions}
          pendingTransactions={pendingTransactions}
          onEndReached={handleEndReached}
          showMoreLoading={hasMoreTransactionsToLoad}
        />
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default AccountTransactionsScreen
