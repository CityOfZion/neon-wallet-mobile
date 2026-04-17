import { Fragment } from 'react'

import { BSNeoXConstants } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { Loader } from '@/components/Loader'
import { Radio } from '@/components/Radio'
import { TwCheckbox } from '@/components/TwCheckbox'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { StyleHelper } from '@/helpers/StyleHelper'

import { usePingNetworks } from '@/hooks/usePingNetworks'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const NetworkUrlSelectionModal = ({ route }: TRootStackScreenProps<'NetworkUrlSelectionModal'>) => {
  const { blockchain } = route.params
  const { t } = useTranslation('modals', { keyPrefix: 'networkUrlSelection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)
  const pingNetworksQuery = usePingNetworks(blockchain, { refetchInterval: 5000 })
  const dispatch = useAppDispatch()

  const handlePress = (url: string) => {
    dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain, url, isAutomatic: false }))
  }

  const handleIsAutomaticChange = (isAutomatic: boolean) => {
    const firstNetwork = pingNetworksQuery.data?.[0]

    dispatch(
      settingsReducerActions.setSelectedNetworkUrl({
        blockchain,
        url: isAutomatic && firstNetwork ? firstNetwork.url : selectedNetwork.url,
        isAutomatic,
      })
    )
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>

        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <Text className="font-sans-regular text-lg text-white">{t('description')}</Text>

        {pingNetworksQuery.isLoading ? (
          <Loader containerClassName="mt-6" className="size-10" />
        ) : (
          <Fragment>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-sans-semibold text-sm uppercase text-gray-100">{t('listLabel')}</Text>

              <View className="flex-row items-center">
                <TwCheckbox
                  label={t('selectAutomaticallyCheckboxLabel')}
                  checked={!!selectedNetwork.isAutomatic}
                  onCheckedChange={handleIsAutomaticChange}
                />

                <TwIconButton
                  aria-label={t('refreshButtonLabel')}
                  onPress={() => pingNetworksQuery.refetch()}
                  disabled={pingNetworksQuery.isRefetching || pingNetworksQuery.isLoading}
                  icon={<Loader paused={!pingNetworksQuery.isRefetching} className="text-neon" />}
                />
              </View>
            </View>

            <Radio.Root value={selectedNetwork.url} onValueChange={handlePress}>
              {pingNetworksQuery.data?.map((network, index, array) => {
                const isNeoxAntiMev =
                  blockchain === 'neox' &&
                  BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID[selectedNetwork.id].some(url => url === network.url)

                return (
                  <Fragment key={network.url}>
                    <Radio.Item
                      value={network.url}
                      id={network.url}
                      className="py-3"
                      leftElement={
                        <View className="w-14 items-center justify-center">
                          <View
                            className={StyleHelper.mergeStyles(
                              'min-size-1.5 size-1.5 rounded-full',
                              match(network.latency)
                                .with(undefined, () => 'bg-gray-300')
                                .with(
                                  P.when(value => value < 400),
                                  () => 'bg-green'
                                )
                                .with(
                                  P.when(value => value < 800),
                                  () => 'bg-orange'
                                )
                                .otherwise(() => 'bg-pink')
                            )}
                          />

                          <Text className="font-sans-regular text-sm text-gray-300">
                            {typeof network.latency === 'number'
                              ? t('latencyLabel', { latency: network.latency })
                              : tCommon('emptyData')}
                          </Text>
                        </View>
                      }
                      label={
                        <View className="flex-1 items-start">
                          {isNeoxAntiMev && (
                            <Text className="mb-0.5 w-fit rounded bg-neon/70 px-1 py-px text-center font-sans-semibold text-xs text-asphalt">
                              {t('antiMevLabel')}
                            </Text>
                          )}

                          <Text className="font-sans-regular text-base text-white" numberOfLines={1}>
                            {network.url}
                          </Text>

                          <View className="flex-1 flex-row gap-1">
                            <Text className="flex-shrink font-sans-regular text-sm text-gray-300" numberOfLines={1}>
                              {t('blockHeightLabel')}
                            </Text>

                            <Text className="font-sans-regular text-sm text-gray-300" numberOfLines={1}>
                              {typeof network.height === 'number' ? network.height : tCommon('emptyData')}
                            </Text>
                          </View>
                        </View>
                      }
                    />

                    {array.length - 1 !== index && <TwSeparator />}
                  </Fragment>
                )
              })}
            </Radio.Root>
          </Fragment>
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
