import React from 'react'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {PriorityFee} from '~src/models/PriorityFee'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  weight: number
  title: string
  value: string
  image?: ImageLoadEventData
  priorityFee?: PriorityFee
  showCopy?: boolean
  valueTextColor?: string
}

export const HeaderColumn = (props: Props) => {
  return (
    <LinearLayout orientation={'verti'} weight={props.weight} pt={2} mr={4}>
      <TextView color={'text.10'} fontFamily={'medium'} fontSize={14}>
        {props.title}
      </TextView>
      <LinearLayout orientation={'horiz'}>
        {props.image && (
          <ImageView alignSelf={'center'} source={props.image} mr={2} mt={1} />
        )}
        {props.priorityFee && (
          <TextView
            color={'primary'}
            fontFamily={'semibold'}
            fontSize={16}
            mr={2}
          >
            {props.priorityFee.name.toUpperCase()}
          </TextView>
        )}
        <ButtonView
          activeOpacity={props.showCopy ? 0.4 : 1}
          onPress={
            props.showCopy
              ? Facade.utils.copyToClipboard(props.value)
              : undefined
          }
        >
          <LinearLayout
            orientation={'horiz'}
            maxWidth={props.showCopy ? '95%' : '100%'}
          >
            <TextView
              color={props.valueTextColor ?? 'text.0'}
              fontFamily={'medium'}
              fontSize={16}
              numberOfLines={1}
              ellipsizeMode={'middle'}
            >
              {props.value}
            </TextView>
            {props.showCopy && (
              <ImageView
                width="16px"
                resizeMode="contain"
                source={require('~src/assets/images/icon-copy-green.png')}
                ml={4}
              />
            )}
          </LinearLayout>
        </ButtonView>
      </LinearLayout>
    </LinearLayout>
  )
}
