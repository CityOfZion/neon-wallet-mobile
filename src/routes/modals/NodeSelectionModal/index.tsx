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

import { usePingNodes } from '@/hooks/useNodes'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const NodeSelectionModal = ({ route }: TRootStackScreenProps<'NodeSelectionModal'>) => {
  const { blockchain } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'nodeSelectionModal' })

  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)
  const dispatch = useAppDispatch()
  const pingNodesQuery = usePingNodes(blockchain, { refetchInterval: 5000 })

  const handlePress = (url: string) => {
    dispatch(
      settingsReducerActions.setSelectedNetworkUrl({
        blockchain,
        url,
        isAutomatic: false,
      })
    )
  }

  const handleIsAutomaticChange = (checked: boolean) => {
    const firstNode = pingNodesQuery.data?.[0]

    dispatch(
      settingsReducerActions.setSelectedNetworkUrl({
        blockchain,
        url: checked && firstNode ? firstNode.url : selectedNetwork.url,
        isAutomatic: checked,
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
            onPress={() => pingNodesQuery.refetch()}
            disabled={pingNodesQuery.isRefetching || pingNodesQuery.isLoading}
            icon={<Loader paused={!pingNodesQuery.isRefetching} className="text-neon" />}
          />
          <TwModalLayoutCloseIconButton />
        </View>
      }
    >
      <Text className="font-sans-regular text-lg text-white">{t('description')}</Text>

      {pingNodesQuery.isLoading ? (
        <Loader containerClassName="mt-6" className="h-10 w-10" />
      ) : (
        <Radio.Root
          value={selectedNetwork.url}
          onValueChange={handlePress}
          label={
            <View className="mt-4 flex-row justify-between">
              <Text className="font-sans-semibold text-sm uppercase text-gray-100">{t('nodesListLabel')}</Text>

              <TwCheckbox
                label={t('selectAutomaticallyCheckboxLabel')}
                checked={!!selectedNetwork.isAutomatic}
                onCheckedChange={handleIsAutomaticChange}
              />
            </View>
          }
          className="mb-8 mt-6"
        >
          {pingNodesQuery.data?.map((node, index, array) => {
            const isNeoxAntiMev =
              blockchain === 'neox' &&
              BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID[selectedNetwork.id].some(url => url === node.url)

            return (
              <Fragment key={`node-selection-${node.url}-${index}`}>
                <Radio.Item
                  value={node.url}
                  id={`node-selection-${node.url}`}
                  className="py-3"
                  leftElement={
                    <View className="w-14 items-center justify-center">
                      <View
                        className={StyleHelper.mergeStyles(
                          'h-[0.375rem] min-h-[0.375rem] w-[0.375rem] min-w-[0.375rem] rounded-full',
                          match(node.latency)
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
                        {node.latency ? t('latencyLabel', { latency: node.latency }) : '--'}
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
                        {node.url}
                      </Text>

                      <View className="flex-1 flex-row gap-1">
                        <Text className="flex-shrink font-sans-regular text-sm text-gray-300" numberOfLines={1}>
                          {t('blockHeightLabel')}
                        </Text>

                        <Text className="font-sans-regular text-sm text-gray-300" numberOfLines={1}>
                          {node.height ?? '--'}
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
