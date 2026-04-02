import { isClaimable } from '@cityofzion/blockchain-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TransactionHelper } from '@/helpers/TransactionHelper'

import { useAppDispatch } from './useRedux'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHasClaimPendingTransactionSelector } from './useUtilitySelector'

import { thunks } from '@/store/thunks'
import type { TNetwork } from '@/types/blockchain'
import type { TUseUnclaimedResult } from '@/types/query'
import type { TAccount } from '@/types/store'

const { t } = I18nextHelper.get()

const buildUnclaimedQueryKey = (account: TAccount, network: TNetwork) => ['claim', account.address, network]

const getUnclaimedInfos = async (
  account: TAccount,
  hasClaimPendingTransaction: boolean
): Promise<TUseUnclaimedResult | null> => {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

  if (!isClaimable(blockchainService)) {
    return null
  }

  let unclaimed = '0'

  if (!hasClaimPendingTransaction) {
    unclaimed = await blockchainService.claimDataService.getUnclaimed(account.address)
  }

  const unclaimedNumber = parseFloat(unclaimed)

  let fee = '0'

  if (unclaimedNumber > 0) {
    const key = await SecureStoreHelper.getKey(account)

    if (key) {
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account, key })

      try {
        fee = await blockchainService.calculateClaimFee(serviceAccount)
      } catch {
        /* empty */
      }
    }
  }

  return { unclaimed, unclaimedNumber, fee, feeNumber: parseFloat(fee) }
}

export const useUnclaimed = (account: TAccount) => {
  const { hasClaimPendingTransactionRef } = useHasClaimPendingTransactionSelector(account)
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildUnclaimedQueryKey(account, selectedNetworkByBlockchain[account.blockchain]),
    staleTime: 0,
    gcTime: 0,
    queryFn: getUnclaimedInfos.bind(null, account, hasClaimPendingTransactionRef.current),
  })
}

export const useUnclaimedMutation = () => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (account: TAccount) => {
      const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

      if (!isClaimable(blockchainService)) {
        throw new AppError(t('common:errors.blockchainIsNotClaimable'))
      }

      const key = await SecureStoreHelper.getKey(account)

      if (!key) {
        throw new AppError(t('common:errors.noKey', { address: account.address }))
      }

      const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account, key })
      const transaction = await blockchainService.claim(serviceAccount)

      const pendingTransaction = TransactionHelper.buildPendingTransaction({
        transaction,
        account,
        senderAccount: account,
        receiverAccounts: [account],
      })

      const notificationPrefix = 'hooks:useUnclaimedMutation'
      const notificationSuccessPrefix = `${notificationPrefix}.successNotification`
      const notificationFailurePrefix = `${notificationPrefix}.failureNotification`

      dispatch(
        thunks.waitPendingTransaction({
          pendingTransaction,
          successNotification: {
            title: `${notificationSuccessPrefix}.title`,
            previewBody: `${notificationSuccessPrefix}.previewBody`,
          },
          failureNotification: {
            title: `${notificationFailurePrefix}.title`,
            previewBody: `${notificationFailurePrefix}.previewBody`,
          },
        })
      )
    },
    onError: error => {
      ToastHelper.error({ message: AppError.wrap(error, t('hooks:useUnclaimedMutation.errors.claimError')).message })
      LoggerHelper.sentry(error, { where: 'useUnclaimedMutation', operation: 'claim' })
    },
    onSuccess: (_data, account) => {
      queryClient.setQueryData(buildUnclaimedQueryKey(account, selectedNetworkByBlockchain[account.blockchain]), {
        unclaimed: '0',
        unclaimedNumber: 0,
        fee: '0',
        feeNumber: 0,
      })

      ToastHelper.success({ message: t('hooks:useUnclaimedMutation.messages.claimedSuccess') })
    },
  })
}
