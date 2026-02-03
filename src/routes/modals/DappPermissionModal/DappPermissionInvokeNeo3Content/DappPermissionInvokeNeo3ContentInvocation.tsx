import { Fragment } from 'react'

import type { ContractInvocation, IBSNeo3 } from '@cityofzion/bs-neo3'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { Loader } from '@/components/Loader'
import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwIconButton } from '@/components/TwIconButton'

import { LinkHelper } from '@/helpers/LinkHelper'

import { useContractQuery } from '@/hooks/useContractQuery'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'
import TbArrowsSort from '@/assets/images/tb-arrows-sort.svg'
import TbExternalLink from '@/assets/images/tb-external-link.svg'

import type { TDappPermissionProps } from '../index'

type TProps = {
  invocation: ContractInvocation
} & TDappPermissionProps

export const DappPermissionInvokeNeo3ContentInvocation = ({ invocation, sessionDetails, session }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionModal.customContents.invokeNeo3' })
  const navigation = useNavigation()

  const contractQuery = useContractQuery({ blockchain: sessionDetails.blockchain, hash: invocation.scriptHash })

  const service = sessionDetails.service as IBSNeo3

  const amount =
    invocation.operation === 'transfer' && invocation.args?.length === 4 && invocation.args[2].type === 'Integer'
      ? invocation.args[2].value
      : null

  const handleOpenContractHashUrl = () => {
    LinkHelper.open(service.explorerService.buildContractUrl(invocation.scriptHash))
  }

  const handleViewContractDetails = () => {
    navigation.navigate('DappPermissionContractDetailsModal', {
      session,
      hash: invocation.scriptHash,
      operation: invocation.operation,
      blockchain: sessionDetails.blockchain,
      values: invocation.args?.map(arg => arg.value) ?? [],
    })
  }

  return (
    <TouchableOpacity onPress={handleViewContractDetails} activeOpacity={0.9}>
      <TwDetailsCard.Root>
        <TwDetailsCard.Header
          leftElement={<TbArrowsSort className="rotate-90" aria-hidden />}
          rightElement={match(contractQuery)
            .with({ isLoading: true }, () => <Loader className="h-4 w-4" containerClassName="w-fit" />)
            .with({ data: P.nullish }, () => <Fragment />)
            .otherwise(({ data }) => (
              <View className="flex flex-row items-center gap-2">
                <Text className="font-sans-semibold text-base capitalize text-gray-100">{data.name}</Text>

                <MdChevronRight className="size-6 text-gray-100" aria-hidden />
              </View>
            ))}
        >
          <Text className="font-sans-regular text-base capitalize text-white">{invocation.operation}</Text>
        </TwDetailsCard.Header>

        <TwDetailsCard.HeaderSeparator />

        <TwDetailsCard.Row>
          <TwDetailsCard.Item label={t('hashDetailsItemLabel')}>
            <View className="flex-shrink flex-grow flex-row items-center justify-between gap-3 rounded bg-gray-700/60 px-3 py-1.5">
              <Text
                className="flex-shrink font-sans-semibold text-base text-white"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {invocation.scriptHash}
              </Text>

              <TwIconButton
                aria-label={t('externalButtonLabel')}
                className="p-0"
                icon={<TbExternalLink aria-hidden className="text-neon" />}
                onPress={handleOpenContractHashUrl}
              />
            </View>
          </TwDetailsCard.Item>
        </TwDetailsCard.Row>

        <TwDetailsCard.Row>
          {amount && (
            <TwDetailsCard.Item label={t('amountDetailsItemLabel')}>
              <View className="flex-shrink flex-grow flex-row items-center justify-between gap-3 rounded bg-gray-700/60 px-3 py-1.5">
                <Text
                  className="flex-shrink font-sans-semibold text-base text-white"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {amount}
                </Text>
              </View>
            </TwDetailsCard.Item>
          )}
        </TwDetailsCard.Row>
      </TwDetailsCard.Root>
    </TouchableOpacity>
  )
}
