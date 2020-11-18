import PropTypes from 'prop-types'
import React from 'react'
import {MessageComponentProps} from 'react-native-flash-message'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export const ThemedAlert: React.FC<MessageComponentProps> = (props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    //@ts-ignore
    <TouchableWithoutFeedback onPress={props.message.onPress}>
      <LinearLayout bg={theme.colors.background[12]} alignItems={'center'}>
        <LinearLayout
          orientation={'horiz'}
          alignItems={'center'}
          mt={'50px'}
          mb={'14px'}
        >
          {props.message.type === 'success' && (
            <ImageView
              source={require('~/src/assets/images/icon-circle-check-green.png')}
              alignSelf={'center'}
              width={'35px'}
              height={'35px'}
              mt={'20px'}
              resizeMode={'contain'}
              mr={'14px'}
            />
          )}

          <TextView
            fontSize={'18px'}
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
          color={
            props.message.type === 'success'
              ? theme.colors.primary
              : theme.colors.text[0]
          }
          width={'100%'}
          height={'5px'}
        />
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

ThemedAlert.propTypes = {
  message: PropTypes.any.isRequired,
}
