import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TMoreStackScreenProps } from '@/types/stacks'

type TItem = {
  blockchain: TBlockchainServiceKey
  label: string
  subtitle: string
  onPress(): void
}

const renderItem: ListRenderItem<TItem> = ({ item }) => (
  <TwMenuButton
    leftElement={<TwBlockchainIcon blockchain={item.blockchain} className="h-6 w-6" />}
    label={item.label}
    subtitle={item.subtitle}
    onPress={item.onPress}
  />
)

export const SettingsProtocolsScreen = ({ navigation }: TMoreStackScreenProps<'SettingsProtocolsScreen'>) => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { t } = useTranslation('screens', { keyPrefix: 'settingsProtocolsScreen' })
  const { t: commonT } = useTranslation('common')

  const data = useMemo(() => {
    return BlockchainServiceHelper.blockchainNames.map(blockchain => ({
      blockchain,
      label: commonT(`blockchainServices.${blockchain}.label`),
      subtitle: selectedNetworkByBlockchain[blockchain].name,
      onPress: () => {
        navigation.navigate('SettingsProtocolEditScreen', { blockchain })
      },
    }))
  }, [commonT, navigation, selectedNetworkByBlockchain])

  return (
    <TwScreenLayout title={t('title')} withoutScroll>
      <FlatList data={data} renderItem={renderItem} ItemSeparatorComponent={TwSeparator} />
    </TwScreenLayout>
  )
}
