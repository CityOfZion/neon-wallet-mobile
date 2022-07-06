import i18n from 'i18n-js'
import React from 'react'
import { ImageLoadEventData } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface IHeaderValue {
  value?: string
  color?: string
  size?: number
  align?: string
}

interface Props {
  weight: number
  title: string
  value: string | IHeaderValue[]
  image?: ImageLoadEventData
  showCopy?: boolean
  valueTextColor?: string
}

export const HeaderColumn = (props: Props) => {
  const handlePressCopy = () => {
    if (typeof props.value !== 'string') {
      return
    }

    UtilsHelper.copyToClipboard(props.value)
    showMessage({
      message: i18n.t('toast.copiedToClipboard'),
      type: 'success',
    })
  }

  return (
    <LinearLayout orientation="verti" weight={props.weight} pt={2} mr={4}>
      <TextView color="text.10" fontFamily="medium" fontSize={14}>
        {props.title}
      </TextView>
      <LinearLayout orientation="horiz">
        {props.image && <ImageView alignSelf="center" source={props.image} mr={2} mt={1} />}
        {typeof props.value === 'string' ? (
          <TextView
            width={props.showCopy ? '90%' : '100%'}
            mr={props.showCopy ? '4px' : undefined}
            color={props.valueTextColor ?? 'text.0'}
            fontFamily="medium"
            fontSize={16}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {props.value}
          </TextView>
        ) : (
          props.value.map((value, index) => (
            <TextView
              key={index}
              color={value.color ?? 'text.0'}
              fontFamily="medium"
              fontSize={value.size ?? 16}
              numberOfLines={1}
              ellipsizeMode="middle"
              textAlign={value.align ?? undefined}
            >
              {`${value.value} `}
            </TextView>
          ))
        )}
        {props.showCopy && (
          <ButtonView activeOpacity={0.4} onPress={handlePressCopy}>
            <ImageView
              width="16px"
              resizeMode="contain"
              source={require('~src/assets/images/icon-copy-green.png')}
              ml={2}
            />
          </ButtonView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}
