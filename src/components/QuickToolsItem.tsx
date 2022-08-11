import React from 'react'
import { ImageSourcePropType } from 'react-native'

import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

type Props = {
  title: string
  subtitle: string
  sourceIcon: ImageSourcePropType
  onPress: () => void
}

export const QuickToolsItem = ({ onPress, sourceIcon, subtitle, title }: Props) => {
  return (
    <ButtonView onPress={onPress}>
      <LinearLayout orientation="horiz" py="18px" px="24px" alignItems="center" justifyContent="space-between">
        <LinearLayout>
          <TextView color="text.0" fontSize="18px" fontFamily="regular">
            {title}
          </TextView>
          <TextView color="text.6" fontSize="16px" fontFamily="medium">
            {subtitle}
          </TextView>
        </LinearLayout>
        <ImageView
          source={sourceIcon}
          resizeMode="contain"
          style={{
            width: 34,
            height: 34,
          }}
        />
      </LinearLayout>
    </ButtonView>
  )
}

export const QuickToolsItemSeparator = () => {
  return <LinearLayout mx="24px" height="1px" bg="background.10" />
}
