import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'
import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'

import TbCircleOff from '@/assets/images/tb-circle-off.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'

const CustomBar = () => {
  const { t } = useTranslation('components', { keyPrefix: 'screenLayoutBars' })

  return (
    <View className="w-full flex-row items-center justify-center gap-2 border-b-2 border-magenta bg-black p-4">
      <TbAlertTriangleFilled aria-hidden className="size-6 text-magenta" />
      <Text className="font-sans-regular text-lg leading-5 text-white">{t('customMode')}</Text>
    </View>
  )
}

const TestnetBar = () => {
  const { t } = useTranslation('components', { keyPrefix: 'screenLayoutBars' })

  return (
    <View className="w-full flex-row items-center justify-center gap-2 border-b-2 border-magenta bg-black p-4">
      <TbAlertTriangleFilled aria-hidden className="size-6 text-magenta" />
      <Text className="font-sans-regular text-lg leading-5 text-white">{t('testnetMode')}</Text>
    </View>
  )
}

const OfflineBar = () => {
  const { t } = useTranslation('components', { keyPrefix: 'screenLayoutBars' })

  return (
    <View className="w-full flex-row items-center justify-center gap-2 border-b border-neon bg-gray-900 p-4">
      <TbCircleOff aria-hidden className="size-8.5 text-neon" />
      <View>
        <Text className="font-sans-regular text-1xs uppercase text-neon">{t('warning')}</Text>
        <Text className="font-sans-regular text-xs text-white">{t('noInternet')}</Text>
      </View>
    </View>
  )
}

export const TwScreenLayoutBars = () => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { isNotConnected } = useIsConnectedSelector()
  const { top } = useSafeAreaInsets()

  let hasCustom = false
  let hasTestnet = false

  Object.entries(selectedNetworkByBlockchain).forEach(([_blockchain, network]) => {
    hasCustom = hasCustom || network.type === 'custom'
    hasTestnet = hasTestnet || network.type === 'testnet'
  })

  return (
    <Fragment>
      <View
        className={StyleHelper.mergeStyles({
          'bg-black': hasCustom || hasTestnet,
          'bg-transparent': !hasCustom && !hasTestnet && isNotConnected,
        })}
        style={{ height: top }}
      />

      {hasCustom && <CustomBar />}
      {hasTestnet && <TestnetBar />}
      {isNotConnected && <OfflineBar />}
    </Fragment>
  )
}
