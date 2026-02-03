import { Fragment, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Loader } from '@/components/Loader'
import { TwDetailsCard } from '@/components/TwDetailsCard'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'

import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TDappPermissionProps } from '../index'

export const DappPermissionGenericContentFee = ({
  request,
  sessionDetails,
  sessionAccount,
  onReject,
}: TDappPermissionProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionModal' })
  const { t: commonT } = useTranslation('common')

  const feeQuery = useQuery({
    queryKey: ['fee', request.id],
    queryFn: async () => {
      const key = await SecureStoreHelper.getKey(sessionAccount)
      if (!key) throw new AppError(commonT('errors.noKey'))

      const serviceAccount = BlockchainServiceHelper.getServiceAccount({ account: sessionAccount, key })

      return await sessionDetails.service.walletConnectService.calculateRequestFee({
        account: serviceAccount,
        params: request.params.request.params,
      })
    },
    gcTime: 0,
    staleTime: 0,
  })

  useEffect(() => {
    if (!feeQuery.error) return
    LoggerHelper.error(feeQuery.error, { where: 'DappPermissionGenericContentFee', operation: 'calculateRequestFee' })
    onReject(undefined, t('errors.fee'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeQuery.error])

  return (
    <TwDetailsCard.Root className="mt-3">
      <TwDetailsCard.Header
        leftElement={<TbReceipt aria-hidden className="text-blue" />}
        rightElement={
          <Fragment>
            {feeQuery.isLoading || !feeQuery.data ? (
              <Loader />
            ) : (
              <Text className="font-sans-semibold text-base capitalize text-gray-100">
                {feeQuery.data} {sessionDetails.service.feeToken.symbol}
              </Text>
            )}
          </Fragment>
        }
      >
        <Text className="font-sans-regular text-base capitalize text-white">{t('feeLabel')}</Text>
      </TwDetailsCard.Header>
    </TwDetailsCard.Root>
  )
}
