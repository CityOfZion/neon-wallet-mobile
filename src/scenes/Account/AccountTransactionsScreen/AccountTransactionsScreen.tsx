import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { showMessage } from 'react-native-flash-message'

import { TransactionsList } from './TransactionsList'

import { blockchainServices } from '~/src/blockchain'
import { hasNFTIntegration } from '~/src/blockchain/common'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLayoutWithoutScroll from '~/src/components/layout/ScreenLayoutWithoutScroll'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { useExchange } from '~/src/hooks/useExchange'
import { useTokens } from '~/src/hooks/useTokens'
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

  const { tokens } = useTokens({ blockchain: account.blockchain })
  const { exchange } = useExchange({})

  const [completedTransactions, setCompletedTransactions] = useState<FormattedTransaction[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<FormattedTransaction[]>([])
  const [hasMoreTransactionsToLoad, setHasMoreTransactionsToLoad] = useState(true)

  const pageControl = useRef<number>(1)
  const requestControl = useRef<boolean>(false)
  const nftCache = useRef<Map<string, NFTResponse>>(new Map())
  const decimalsCache = useRef<Map<string, { symbol: string; decimals: number }>>(
    new Map(
      tokens
        .filter(token => blockchainServices[account.blockchain].nativeAssets.includes(token.symbol))
        .map(({ hash, symbol, decimals }) => [hash, { symbol, decimals: decimals ?? 0 }])
    )
  )

  const getDecimalsAndSymbolToken = useCallback(async (hash: string) => {
    const cachedAsset = decimalsCache.current.get(hash)

    if (cachedAsset) {
      return cachedAsset
    }

    try {
      const tokenAsset = await blockchainServices[account.blockchain].provider.getAssetByHash(hash)

      if (tokenAsset) {
        decimalsCache.current.set(hash, tokenAsset)

        return tokenAsset
      }

      return {
        symbol: '',
        decimals: 0,
      }
    } catch {}
  }, [])

  const getNFTInfo = useCallback(async (tokenId: string, hash: string) => {
    const cachedNFT = nftCache.current.get(tokenId)

    if (cachedNFT) {
      return cachedNFT
    }

    try {
      const service = blockchainServices[account.blockchain]

      if (!hasNFTIntegration(service)) {
        return
      }

      const nftResponse = await service.getNFT(tokenId, hash)

      if (nftResponse.name || nftResponse.image || nftResponse.collectionName) {
        nftCache.current.set(tokenId, nftResponse)
      }

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
        const { transactions, totalPages } = await blockchainServices[account.blockchain].provider.getAddressAbstracts(
          account.address,
          pageControl.current
        )

        const formattedTransactions = await Promise.all(
          transactions.map(async transaction => {
            const formattedTransfers = await Promise.all(
              transaction.transfers.map(
                async (transfer): Promise<FormattedTransferAsset | FormattedTransferNFT | undefined> => {
                  if (transfer.type === TransactionTransferType.ASSET) {
                    const decimalsAndSymbol = await getDecimalsAndSymbolToken(transfer.hash)

                    if (!decimalsAndSymbol) {
                      return
                    }

                    return {
                      ...transfer,
                      amount: String(transfer.amount / 10 ** decimalsAndSymbol.decimals),
                      symbol: decimalsAndSymbol.symbol,
                    }
                  }

                  const nftInfo = await getNFTInfo(transfer.tokenId, transfer.hash)

                  if (!nftInfo) {
                    return
                  }

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
  }, [account, getDecimalsAndSymbolToken, getNFTInfo])

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
    [getDecimalsAndSymbolToken, getDecimalsAndSymbolToken]
  )

  const populateTransactions = useCallback(async () => {
    const completedTransaction = await loadCompletedTransactions()
    await loadPendingTransactions(completedTransaction ?? [])
  }, [loadCompletedTransactions, loadPendingTransactions])

  useEffect(() => {
    Await.run('populateTransactions', populateTransactions)
  }, [loadCompletedTransactions])

  return (
    <ScreenLayoutWithoutScroll darkerSolidColorBG>
      <AccountSubTitle account={account} />
      <AwaitActivity name="populateTransactions" loadingView={<ScreenLoader />}>
        <TransactionsList
          account={account}
          exchange={exchange} //Implement a  skeleton here
          completedTransactions={completedTransactions}
          pendingTransactions={pendingTransactions}
          onEndReached={handleEndReached}
          showMoreLoading={hasMoreTransactionsToLoad}
        />
      </AwaitActivity>
    </ScreenLayoutWithoutScroll>
  )
}

export default AccountTransactionsScreen
