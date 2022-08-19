import React from 'react'
import { ImageSourcePropType } from 'react-native'

import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

type Props = {
  title: string
  titleIcon?: ImageSourcePropType
  subtitle?: string
  icon?: ImageSourcePropType
  withSeparator?: boolean
  onPress: () => void
}

export const AlterMenuItem = ({ onPress, icon, subtitle, title, titleIcon, withSeparator = true }: Props) => {
  return (
    <LinearLayout>
      <ButtonView onPress={onPress}>
        <LinearLayout orientation="horiz" py="18px" alignItems="center" justifyContent="space-between">
          <LinearLayout>
            <LinearLayout orientation="horiz">
              <TextView color="text.0" fontSize="18px" fontFamily="regular">
                {title}
              </TextView>
              {!!titleIcon && (
                <ImageView ml="12px" source={titleIcon} resizeMode="contain" style={{ width: 20, height: 20 }} />
              )}
            </LinearLayout>

            {!!subtitle && (
              <TextView color="text.6" fontSize="16px" fontFamily="medium">
                {subtitle}
              </TextView>
            )}
          </LinearLayout>
          {!!icon && (
            <ImageView
              source={icon}
              resizeMode="contain"
              style={{
                width: 34,
                height: 34,
              }}
            />
          )}
        </LinearLayout>
      </ButtonView>

      {withSeparator && <LinearLayout height="1px" bg="background.10" />}
    </LinearLayout>
  )
}
