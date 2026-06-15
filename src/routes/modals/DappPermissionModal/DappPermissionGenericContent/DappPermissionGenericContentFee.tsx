import { Fragment, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Details } from '@/components/Details'
import { Loader } from '@/components/Loader'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'

import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TDappPermissionProps } from '../index'

export const DappPermissionGenericContentFee = ({
  request,
  sessionDetails,
  sessionAccount,
  onReject,
}: TDappPermissionProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })

  const feeQuery = useQuery({
    queryKey: ['fee', request.id],
    queryFn: async () => {
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(sessionAccount)
      return await sessionDetails.service.walletConnectService.calculateRequestFee({
        account: serviceAccount,
        params: request.params.request.params,
        method: request.params.request.method,
      })
    },
    gcTime: 0,
    staleTime: 0,
  })

  useEffect(() => {
    if (!feeQuery.error) return
    LoggerHelper.error(feeQuery.error, { where: 'DappPermissionGenericContentFee', operation: 'calculateRequestFee' })
    onReject({ message: feeQuery.error.message, code: -32000 }, t('errors.fee'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeQuery.error])

  return (
    <Details.Root className="mt-3">
      <Details.Header
        leftElement={<TbReceipt aria-hidden className="text-blue" />}
        rightElement={
          <Fragment>
            {feeQuery.isLoading || !feeQuery.data ? (
              <Loader />
            ) : (
              <Text className="font-sans-semibold text-base text-gray-100">
                {feeQuery.data} {sessionDetails.service.feeToken.symbol}
              </Text>
            )}
          </Fragment>
        }
      >
        {t('feeLabel')}
      </Details.Header>
    </Details.Root>
  )
}
