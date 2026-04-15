import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwInputLabel } from '@/components/TwInputLabel'

import { SkinHelper } from '@/helpers/SkinHelper'

import { SKIN_CONTAINER_GAP, SKIN_CONTAINER_WINDOW_SIZE, SkinSelectorItem } from './SkinSelectorItem'

import type { TColorSkin, TSkin } from '@/types/store'

type TProps = {
  selectedSkin: TSkin
  onPress?: (skin: TColorSkin) => void
}

export const ColorSkinSelector = ({ selectedSkin, onPress }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'editAccount' })

  return (
    <Fragment>
      <TwInputLabel label={t('selectColor')} />

      <View className="flex flex-row flex-wrap" style={{ gap: SKIN_CONTAINER_GAP, width: SKIN_CONTAINER_WINDOW_SIZE }}>
        {Array.from(SkinHelper.accountColorSkinsSet.values()).map((color, index) => {
          return (
            <SkinSelectorItem
              key={`${color}-color-${index}`}
              isSelected={selectedSkin.id === color}
              style={{ backgroundColor: color }}
              onPress={() => onPress?.({ id: color, type: 'color' })}
            />
          )
        })}
      </View>
    </Fragment>
  )
}
