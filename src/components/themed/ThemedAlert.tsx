import Constants from 'expo-constants'
import React from 'react'
import { MessageComponentProps } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export const ThemedAlert: React.FC<MessageComponentProps> = props => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <LinearLayout
      bg={theme.colors.black}
      width="100%"
      paddingRight="14px"
      paddingLeft="14px"
      paddingBottom="14px"
      paddingTop={`${14 + Constants.statusBarHeight}px`}
      orientation="horiz"
      justifyContent="center"
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor={
        props.message.type === 'success'
          ? theme.colors.primary
          : props.message.type === 'danger'
          ? theme.colors.danger
          : theme.colors.text[0]
      }
    >
      {props.message.type === 'success' && (
        <ImageView
          source={require('~/src/assets/images/icon-circle-check-green.png')}
          alignSelf="center"
          width={34}
          height={34}
          resizeMode="contain"
          mr="14px"
        />
      )}

      <LinearLayout flexShrink={1}>
        {props.message.description && (
          <TextView
            fontFamily="bold"
            fontSize="12px"
            color={props.message.type === 'success' ? theme.colors.primary : theme.colors.text[0]}
          >
            {props.message.description}
          </TextView>
        )}

        <TextView
          fontFamily="bold"
          fontSize="18px"
          color={
            props.message.type === 'success'
              ? theme.colors.text[0]
              : props.message.type === 'danger'
              ? theme.colors.danger
              : theme.colors.text[0]
          }
        >
          {props.message.message}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}
