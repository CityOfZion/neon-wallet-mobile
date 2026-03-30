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

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const NetworkUrlSelectionModal = ({ route }: TRootStackScreenProps<'NetworkUrlSelectionModal'>) => {
  const { blockchain } = route.params
  const { t } = useTranslation('modals', { keyPrefix: 'networkUrlSelectionModal' })
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
    <TwModalLayout
      title={t('title')}
      rightElement={
        <View className="flex-row">
          <TwIconButton
            aria-label={t('refreshButtonLabel')}
            onPress={() => pingNetworksQuery.refetch()}
            disabled={pingNetworksQuery.isRefetching || pingNetworksQuery.isLoading}
            icon={<Loader paused={!pingNetworksQuery.isRefetching} className="text-neon" />}
          />
          <TwModalLayoutCloseIconButton />
        </View>
      }
    >
      <Text className="font-sans-regular text-lg text-white">{t('description')}</Text>

      {pingNetworksQuery.isLoading ? (
        <Loader containerClassName="mt-6" className="size-10" />
      ) : (
        <Radio.Root
          value={selectedNetwork.url}
          onValueChange={handlePress}
          label={
            <View className="mt-4 flex-row justify-between">
              <Text className="font-sans-semibold text-sm uppercase text-gray-100">{t('listLabel')}</Text>

              <TwCheckbox
                label={t('selectAutomaticallyCheckboxLabel')}
                checked={!!selectedNetwork.isAutomatic}
                onCheckedChange={handleIsAutomaticChange}
              />
            </View>
          }
          className="mb-8 mt-6"
        >
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
                          'h-[0.375rem] min-h-[0.375rem] w-[0.375rem] min-w-[0.375rem] rounded-full',
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
      )}
    </TwModalLayout>
  )
}
