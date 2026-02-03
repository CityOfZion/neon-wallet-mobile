import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { ImageFallback } from '@/components/ImageFallback'
import { TwInputLabel } from '@/components/TwInputLabel'
import { TwSkeleton } from '@/components/TwSkeleton'

import { SkinHelper } from '@/helpers/SkinHelper'

import { useItemNeo3NftSkins } from '@/hooks/useItemNeo3NftSkins'
import { useUnlockedSkinIdsSelector } from '@/hooks/useUnlockedSkinIdsSelector'

import { SKIN_CONTAINER_GAP, SKIN_CONTAINER_WINDOW_SIZE, SKIN_ITEM_SIZE, SkinSelectorItem } from './SkinSelectorItem'

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

      <TwSkeleton
        isLoading={isLoading}
        className="flex flex-row flex-wrap justify-between gap-4"
        layout={[
          { width: SKIN_ITEM_SIZE, height: SKIN_ITEM_SIZE, radius: 8 },
          { width: SKIN_ITEM_SIZE, height: SKIN_ITEM_SIZE, radius: 8 },
          { width: SKIN_ITEM_SIZE, height: SKIN_ITEM_SIZE, radius: 8 },
          { width: SKIN_ITEM_SIZE, height: SKIN_ITEM_SIZE, radius: 8 },
        ]}
      >
        <View
          className="flex flex-row flex-wrap"
          style={{ gap: SKIN_CONTAINER_GAP, width: SKIN_CONTAINER_WINDOW_SIZE }}
        >
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
        </View>
      </TwSkeleton>
    </View>
  )
}
