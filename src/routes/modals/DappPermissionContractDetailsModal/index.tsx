import { useMemo } from 'react'

import { hasExplorerService } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { PressableScale } from '@/components/PressableScale'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwDappHeader } from '@/components/TwDappHeader'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useContractQuery } from '@/hooks/useContractQuery'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbArrowsSort from '@/assets/images/tb-arrows-sort.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
import TbExternalLink from '@/assets/images/tb-external-link.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

const COLORS_BY_TYPE: Record<string, { color: string; textColor: string }> = {
  Signature: {
    color: '#E9265C',
    textColor: 'black',
  },
  Boolean: {
    color: '#D355E7',
    textColor: 'black',
  },
  Integer: {
    color: '#B167F2',
    textColor: 'black',
  },
  Hash160: {
    color: '#008529',
    textColor: 'white',
  },
  Null: {
    color: 'rgba(255, 255, 255, 0.08)',
    textColor: 'black',
  },
  Hash256: {
    color: '#1DB5FF',
    textColor: 'black',
  },
  ByteArray: {
    color: '#0DCDFF',
    textColor: 'black',
  },
  PublicKey: {
    color: '#00D69D',
    textColor: 'black',
  },
  String: {
    color: '#67DD8B',
    textColor: 'black',
  },
  ByteString: {
    color: '#67DD8B',
    textColor: 'black',
  },
  Array: {
    color: '#F28F00',
    textColor: 'black',
  },
  Buffer: {
    color: '#F28F00',
    textColor: 'black',
  },
  InteropInterface: {
    color: '#A50000',
    textColor: 'white',
  },
  Void: {
    color: '#528D93',
    textColor: 'black',
  },
  Any: {
    color: '#00D69D',
    textColor: 'black',
  },
}

export const DappPermissionContractDetailsModal = ({
  route,
}: TRootStackScreenProps<'DappPermissionContractDetailsModal'>) => {
  const { blockchain, operation, hash, values, session } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionContractDetailsModal' })

  const contractQuery = useContractQuery({ blockchain, hash })

  const params = useMemo(() => {
    if (contractQuery.isLoading || !contractQuery.data) return []

    const methodsInfo = contractQuery.data.methods.find(method => method.name === operation)
    if (!methodsInfo) return []

    const params = methodsInfo.parameters.map((parameter, index) => {
      const value = values[index]
      const stringifiedValue = Array.isArray(value) ? JSON.stringify(value, null, 4) : value
      return {
        ...parameter,
        value: stringifiedValue,
      }
    })

    return params
  }, [contractQuery.data, contractQuery.isLoading, operation, values])

  const handleOpenContractHashUrl = () => {
    UtilsHelper.tryCatch(() => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
      if (!hasExplorerService(service)) return

      LinkHelper.open(service.explorerService.buildContractUrl(hash) ?? '')
    })
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      {contractQuery.isLoading ? (
        <ScreenLoader />
      ) : (
        <View>
          <TwDappHeader uri={session.peer.metadata.icons[0]} title={session.peer.metadata.name} />

          <PressableScale onPress={handleOpenContractHashUrl} className="mt-5">
            <Details.Root>
              <Details.Header
                labelClassName="capitalize"
                leftElement={<TbArrowsSort className="rotate-90" aria-hidden />}
                rightElement={
                  <View className="flex-row gap-2">
                    <Text className="font-sans-semibold text-base capitalize text-gray-100">
                      {contractQuery.data?.name}
                    </Text>
                    <TbExternalLink aria-hidden className="size-6 text-neon" />
                  </View>
                }
              >
                {operation}
              </Details.Header>

              <Details.HeaderSeparator />

              <Details.Item
                label={t('hashDetailsHeaderLabel')}
                contentClassName="gap-3 rounded bg-gray-700/60 px-3 py-1.5"
              >
                <Text
                  className="flex-shrink font-sans-semibold text-base text-white"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {hash}
                </Text>
              </Details.Item>
            </Details.Root>
          </PressableScale>

          <Text className="mt-3 font-sans-bold text-sm uppercase text-gray-300">{t('parametersDetailsLabel')}</Text>
          {params.map(param => {
            const color = COLORS_BY_TYPE[param.type]

            return (
              <PressableScale onPress={() => ClipboardHelper.write(param.value)} className="mt-3" key={param.name}>
                <Details.Root>
                  <Details.Header rightElement={<TbCopy aria-hidden className="size-6 text-neon" />}>
                    <View className="flex flex-row items-center gap-2.5">
                      <Text className="font-sans-medium text-base capitalize text-white">{param.name}</Text>

                      <Text
                        className="rounded-full px-3.5 py-1 font-sans-bold text-sm text-asphalt"
                        style={{
                          backgroundColor: color.color,
                          color: color.textColor,
                        }}
                      >
                        {param.type}
                      </Text>
                    </View>
                  </Details.Header>

                  <Details.HeaderSeparator />

                  <Details.Item contentClassName="gap-3 rounded bg-gray-700/60 px-3 py-1.5">
                    <Text
                      className="flex-shrink font-sans-semibold text-base text-white"
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {param.value}
                    </Text>
                  </Details.Item>
                </Details.Root>
              </PressableScale>
            )
          })}
        </View>
      )}
    </TwModalLayout>
  )
}
