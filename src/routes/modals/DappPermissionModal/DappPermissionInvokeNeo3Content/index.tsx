import { useEffect } from 'react'

import type { ContractInvocationMulti } from '@cityofzion/bs-neo3'
import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { TwButton } from '@/components/TwButton'
import { TwDappHeader } from '@/components/TwDappHeader'

import { ToastHelper } from '@/helpers/ToastHelper'

import TbArrowsSort from '@/assets/images/tb-arrows-sort.svg'

import { DappPermissionGenericContentFee } from '../DappPermissionGenericContent/DappPermissionGenericContentFee'
import type { TDappPermissionProps } from '../index'
import { DappPermissionInvokeNeo3ContentInvocation } from './DappPermissionInvokeNeo3ContentInvocation'
import { DappPermissionInvokeNeo3ContentSigner } from './DappPermissionInvokeNeo3ContentSigner'

export const DappPermissionInvokeNeo3Content = (props: TDappPermissionProps) => {
  const { session, onAccept, onReject, isAccepting, isRejecting, request } = props

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { t: commonT } = useTranslation('common')

  const params = request.params.request.params as ContractInvocationMulti

  useEffect(() => {
    if (params.extraNetworkFee || params.extraSystemFee || params.systemFeeOverride || params.networkFeeOverride) {
      ToastHelper.info({ message: t('feeOverridesMessage'), id: 'dapp-permission-fee-overrides' })
    }
  }, [params, t])

  return (
    <View className="flex-1">
      <TwDappHeader
        uri={session.peer.metadata.icons[0]}
        title={
          <Trans t={t} i18nKey="description" values={{ dAppName: session.peer.metadata.name }}>
            <Text className="font-sans-bold">start</Text>
            end
          </Trans>
        }
      />

      <Text className="mt-2 text-center font-sans-regular text-base text-gray-100">{t('description2')}</Text>

      <Details.Root className="mt-5">
        <Details.Header
          className="border-b-0 pb-0"
          labelClassName="capitalize"
          leftElement={<TbArrowsSort aria-hidden className="rotate-90" />}
        >
          {request.params.request.method}
        </Details.Header>
      </Details.Root>

      <View className="mt-3 w-full gap-2.5">
        {params.invocations.map((invocation, index) => (
          <DappPermissionInvokeNeo3ContentInvocation key={`invocations-${index}`} {...props} invocation={invocation} />
        ))}
      </View>

      <View className="mt-3 w-full gap-2.5">
        {params.signers?.map((signer, index) => (
          <DappPermissionInvokeNeo3ContentSigner key={`signer-${index}`} {...props} signer={signer} />
        ))}
      </View>

      <DappPermissionGenericContentFee {...props} />

      <View className="mt-auto gap-4 pt-8">
        <TwButton
          variant="contained-light"
          label={commonT('general.accept')}
          onPress={() => onAccept()}
          isLoading={isAccepting}
          disabled={isRejecting}
        />

        <TwButton
          variant="outline"
          label={commonT('general.decline')}
          onPress={() => onReject()}
          isLoading={isRejecting}
          disabled={isAccepting}
        />
      </View>
    </View>
  )
}
