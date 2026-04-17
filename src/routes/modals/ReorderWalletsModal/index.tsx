import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables'

import { useAppDispatch } from '@/hooks/useRedux'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbGripVertical from '@/assets/images/tb-grip-vertical.svg'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TWallet } from '@/types/store'

const renderItem: SortableGridRenderItem<TWallet> = ({ item }) => {
  return (
    <View className="flex-row items-center justify-between rounded-md bg-gray-300/15 px-5 py-5">
      <Text className="font-sans-medium text-lg capitalize text-white">{item.name}</Text>
      <TbGripVertical aria-hidden className="size-6 text-neon" />
    </View>
  )
}

export const ReorderWalletsModal = ({ navigation }: TRootStackScreenProps<'ReorderWalletsModal'>) => {
  const { wallets } = useWalletsSelector()
  const dispatch = useAppDispatch()
  const { t } = useTranslation('modals', { keyPrefix: 'reorderWallets' })
  const { t: commonT } = useTranslation('common')

  const [reorderedWallets, setReorderedWallets] = useState<TWallet[]>(wallets)

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()

  const handleSave = () => {
    dispatch(walletReducerActions.reorder(reorderedWallets))
    navigation.goBack()
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Button
          position="left"
          label={commonT('general.cancel')}
          onPress={navigation.goBack}
          colorSchema="white"
        />
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.Button position="right" label={commonT('general.save')} onPress={handleSave} />
      </ModalLayout.Header>

      <ModalLayout.ViewContent className="px-0">
        <Text className="px-4 text-center font-sans-medium text-lg text-white">{t('subtitle')}</Text>

        <Animated.ScrollView
          ref={scrollViewRef}
          className="mt-8 flex-1"
          contentContainerClassName="px-4 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <Sortable.Grid
            columns={1}
            rowGap={8}
            onDragEnd={({ data }) => setReorderedWallets(data)}
            data={reorderedWallets}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showDropIndicator
            scrollableRef={scrollViewRef}
            autoScrollEnabled
          />
        </Animated.ScrollView>
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
