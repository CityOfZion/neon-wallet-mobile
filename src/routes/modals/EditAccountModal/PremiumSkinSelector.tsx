import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { ImageFallback } from '@/components/ImageFallback'
import { Skeleton } from '@/components/Skeleton'
import { TwInputLabel } from '@/components/TwInputLabel'

import { SkinHelper } from '@/helpers/SkinHelper'

import { useItemNeo3NftSkins } from '@/hooks/useItemNeo3NftSkins'
import { useUnlockedSkinIdsSelector } from '@/hooks/useUnlockedSkinIdsSelector'

import {
  MAX_ITEM_ROW,
  SKIN_CONTAINER_GAP,
  SKIN_CONTAINER_WINDOW_SIZE,
  SKIN_ITEM_SIZE,
  SkinSelectorItem,
} from './SkinSelectorItem'

import type { IAccountState, TLocalSkin, TNftSkin, TSkin } from '@/types/store'

type TProps = {
  account: IAccountState
  selectedSkin: TSkin
  onPress?: (skin: TSkin) => void
}

export const PremiumSkinSelector = ({ selectedSkin, onPress, account }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'editAccountModal' })
  const { unlockedSkinIds } = useUnlockedSkinIdsSelector()
  const { data, isLoading } = useItemNeo3NftSkins(account)

  const skins: (TLocalSkin | TNftSkin)[] = unlockedSkinIds.map(id => ({ id, type: 'local' }))
  if (data) {
    skins.push(...data)
  }

  return (
    <View className="mt-6">
      <TwInputLabel label={t('selectPremiumThemesTitle')} />

      <Skeleton.Root loading={isLoading} style={{ width: SKIN_CONTAINER_WINDOW_SIZE }}>
        <Skeleton.Group className="flex-row" style={{ gap: SKIN_CONTAINER_GAP }}>
          {Array.from({ length: MAX_ITEM_ROW }).map((_, index) => (
            <Skeleton.Item
              key={`premium-skeleton-${index}`}
              className="rounded-lg"
              style={{ height: SKIN_ITEM_SIZE, width: SKIN_ITEM_SIZE }}
            />
          ))}
        </Skeleton.Group>

        <Skeleton.Content className="flex flex-row flex-wrap" style={{ gap: SKIN_CONTAINER_GAP }}>
          {skins.length === 0 ? (
            <Text className="w-full text-center font-sans-regular text-sm text-gray-300">{t('noPremiumThemes')}</Text>
          ) : (
            skins.map((skin, index) => {
              const source = match(skin)
                .with({ type: 'local' }, localSkin => {
                  const skinData = SkinHelper.localSkins.get(localSkin.id)

                  return skinData ? { uri: skinData.imageUrl } : undefined
                })
                .with({ type: 'nft' }, nftSkin => ({ uri: nftSkin.imgUrl }))
                .exhaustive()

              return (
                <SkinSelectorItem
                  key={`${skin.id}-${skin.type}-${index}`}
                  isSelected={skin.id === selectedSkin.id && skin.type === selectedSkin.type}
                  onPress={() => onPress?.(skin)}
                >
                  <ImageFallback
                    contentFit="cover"
                    source={source}
                    defaultSource={require('@/assets/images/diamond-green.png')}
                    className="size-full"
                  />
                </SkinSelectorItem>
              )
            })
          )}
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
