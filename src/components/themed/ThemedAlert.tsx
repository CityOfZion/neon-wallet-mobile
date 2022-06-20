import PropTypes from 'prop-types'
import React from 'react'
import { MessageComponentProps } from 'react-native-flash-message'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {RootState} from '~/src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export const ThemedAlert: React.FC<MessageComponentProps> = props => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return props.message.type !== 'warning' ? (
    //@ts-ignore
    <TouchableWithoutFeedback onPress={props.message.onPress}>
      <LinearLayout bg={theme.colors.background[12]} alignItems="center">
        <LinearLayout orientation="horiz" alignItems="center" mt="50px" mb="14px">
          {props.message.type === 'success' && (
            <ImageView
              source={require('~/src/assets/images/icon-circle-check-green.png')}
              alignSelf="center"
              width="35px"
              height="35px"
              mt="20px"
              resizeMode="contain"
              mr="14px"
            />
          )}

          <TextView
            fontSize="18px"
            mt="20px"
            color={
              props.message.type === 'success'
                ? theme.colors.primary
                : props.message.type === 'danger'
                ? theme.colors.danger
                : theme.colors.text[0]
            }
          >
            {props.message.message}
          </TextView>
        </LinearLayout>

        <LinearLayout
          color={props.message.type === 'success' ? theme.colors.primary : theme.colors.text[0]}
          width="100%"
          height="5px"
        />
      </LinearLayout>
    </TouchableWithoutFeedback>
  ) : (
    <WarningAlert {...props} />
  )
}

const WarningAlert: React.FC<MessageComponentProps> = props => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <LinearLayout
      bg="#000"
      width="100%"
      height="70px"
      orientation="horiz"
      alignItems="center"
      justifyContent="center"
      mt="35px"
      mb="14px"
      borderBottomWidth={1}
      borderBottomColor={theme.colors.primary}
    >
      <ImageView
        source={require('~/src/assets/images/icon-circle-check-green.png')}
        alignSelf="center"
        width="35px"
        height="33px"
        resizeMode="contain"
        mr="15px"
      />

      <LinearLayout>
        <TextView fontFamily="bold" fontSize="12px" color={theme.colors.primary}>
          Wallet Connect
        </TextView>
        <TextView fontFamily="bold" fontSize="18px" color="#fff">
          {props.message.message}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

ThemedAlert.propTypes = {
  message: PropTypes.any.isRequired,
}

WarningAlert.propTypes = {
  message: PropTypes.any.isRequired,
}
