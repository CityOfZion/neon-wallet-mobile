import { isCalculableFee, isClaimable } from '@cityofzion/blockchain-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAppDispatch } from './useRedux'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHasClaimPendingTransactionSelector } from './useUtilitySelector'

import { thunks } from '@/store/thunks'
import type { TNetwork } from '@/types/blockchain'
import type { TUseUnclaimedResult } from '@/types/query'
import type { IAccountState, TTransaction } from '@/types/store'

const { t } = I18nextHelper.get()

const buildUnclaimedQueryKey = (account: IAccountState, network: TNetwork) => ['claim', account.address, network]

const getUnclaimedInfos = async (
  account: IAccountState,
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

  if (isCalculableFee(blockchainService) && unclaimedNumber > 0) {
    const key = await SecureStoreHelper.getKey(account)
    const { address } = account

    if (key) {
      const serviceAccount = BlockchainServiceHelper.getServiceAccount({ account, key })

      fee = await blockchainService.calculateTransferFee({
        senderAccount: serviceAccount,
        intents: [
          {
            amount: '0',
            receiverAddress: address,
            tokenHash: blockchainService.burnToken.hash,
            tokenDecimals: blockchainService.burnToken.decimals,
          },
        ],
      })
    }
  }

  return { unclaimed, unclaimedNumber, fee, feeNumber: parseFloat(fee) }
}

export const useUnclaimed = (account: IAccountState) => {
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
  const dispatch = useAppDispatch()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ account, data }: { account: IAccountState; data: TUseUnclaimedResult }) => {
      const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
      if (!isClaimable(blockchainService)) {
        throw new AppError(t('common:errors.blockchainIsNotClaimable'))
      }

      const key = await SecureStoreHelper.getKey(account)
      if (!key) {
        throw new AppError(t('common:errors.noKey', { address: account.address }))
      }

      const serviceAccount = BlockchainServiceHelper.getServiceAccount({ account, key })
      const transactionHash = await blockchainService.claim(serviceAccount)

      const transaction: TTransaction = {
        block: 0,
        hash: transactionHash,
        notifications: [],
        time: DateHelper.getNowUnix(),
        account,
        isClaim: true,
        type: 'default',
        transfers: [
          {
            type: 'token',
            amount: '0',
            token: blockchainService.burnToken,
            from: 'claim',
            to: account.address,
            contractHash: blockchainService.burnToken.hash,
          },
          {
            type: 'token',
            amount: data.unclaimed,
            token: blockchainService.claimToken,
            from: 'claim',
            to: account.address,
            contractHash: blockchainService.claimToken.hash,
          },
        ],
        fee: data.fee,
      }

      dispatch(
        thunks.waitTransaction({
          transaction,
          failureNotification: {
            title: 'hooks:useUnclaimedMutation.failureNotification.title',
            previewBody: 'hooks:useUnclaimedMutation.failureNotification.previewBody',
          },
          successNotification: {
            title: 'hooks:useUnclaimedMutation.successNotification.title',
            previewBody: 'hooks:useUnclaimedMutation.successNotification.previewBody',
          },
        })
      )
    },
    onError: error => {
      ToastHelper.error({ message: AppError.wrap(error, t('hooks:useUnclaimedMutation.errors.claimError')).message })
      LoggerHelper.sentry(error, { where: 'useUnclaimedMutation', operation: 'claim' })
    },
    onSuccess: (_data, { account }) => {
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
