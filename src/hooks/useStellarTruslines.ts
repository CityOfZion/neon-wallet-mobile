import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAppDispatch } from './useRedux'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

import { thunks } from '@/store/thunks'
import type { TNetwork } from '@/types/blockchain'
import type { TUseStellarPersistTrustlineMutationParams } from '@/types/hooks'
import type { TAccount } from '@/types/store'

export const buildStellarTrustlinesQueryKey = (account: TAccount<'stellar'>, stellarNetwork: TNetwork) => {
  return ['stellar-trustlines', account.address, stellarNetwork.id]
}

const buildStellarTrustlineTokensQueryKey = (stellarNetwork: TNetwork, filter: string) => {
  return ['stellar-trustline-tokens', stellarNetwork.id, filter]
}

const fetchStellarTrustlines = async (account: TAccount<'stellar'>) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar
  return await service.trustlineService.getTrustlines(account.address)
}

const fetchStellarTrustlineTokens = async (filter: string) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar
  return await service.trustlineService.getAllTokens({ code: filter })
}

export const useStellarTrustlinesQuery = (account: TAccount<'stellar'>) => {
  const {
    selectedNetworkByBlockchain: { stellar: stellarNetwork },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildStellarTrustlinesQueryKey(account, stellarNetwork),
    queryFn: () => fetchStellarTrustlines(account),
  })
}

export const useLazyStellarGetTrustlineTokens = () => {
  const queryClient = useQueryClient()
  const {
    selectedNetworkByBlockchain: { stellar: stellarNetwork },
  } = useSelectedNetworkByBlockchainSelector()

  const getTrustlinesTokens = async (filter: string) => {
    return await queryClient.ensureQueryData({
      queryKey: buildStellarTrustlineTokensQueryKey(stellarNetwork, filter),
      queryFn: fetchStellarTrustlineTokens.bind(null, filter),
    })
  }

  return { getTrustlinesTokens }
}

export const usePersistTrustlineMutation = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'usePersistTrustlineMutation' })
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  return useMutation({
    mutationKey: ['stellar-persist-trustline'],
    mutationFn: async ({ stellarAccount, token, limit }: TUseStellarPersistTrustlineMutationParams) => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

      const senderAccount = await BlockchainServiceHelper.getServiceAccount(stellarAccount)

      const transaction = await service.trustlineService.changeTrustline({ senderAccount, token, limit })

      return { transaction, stellarAccount }
    },
    onSuccess: async ({ transaction, stellarAccount }) => {
      ToastHelper.success({ message: t('successToastMessage') })

      const notificationPrefix = 'hooks:usePersistTrustlineMutation'
      const notificationSuccessPrefix = `${notificationPrefix}.successNotification`
      const notificationFailurePrefix = `${notificationPrefix}.failureNotification`

      dispatch(
        thunks.waitPendingTransaction({
          pendingTransaction: transaction,
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

      queryClient.removeQueries({
        queryKey: buildStellarTrustlinesQueryKey(
          stellarAccount,
          selectedNetworkByBlockchain[stellarAccount.blockchain]
        ),
      })
    },
    onError: error => {
      LoggerHelper.sentry(error, { where: 'StellarPersistTrustlines', operation: 'persistTrustline' })
      ToastHelper.error({ message: t('errorToastMessage') })
    },
  })
}
