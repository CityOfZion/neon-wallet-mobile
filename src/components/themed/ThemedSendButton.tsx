import PropTypes from 'prop-types'
import React from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  GestureResponderEvent,
  View,
} from 'react-native'

import {Facade} from '~/src/app/Facade'
import {
  LinearGradientLayout,
  LinearLayout,
  RelativeLayout,
} from '~/src/styles/styled-components'
import {Account} from '~src/models/redux/Account'
interface Props {
  account?: Account
  onPress?: (evt: GestureResponderEvent) => void
}

const ThemedSendButton: React.FC<Props> = (props) => {
  const isWatchAccount = props.account?.accountType === 'watch'
  const isNotEmpty = props.account?.hasFunds

  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 71,
      height: 45,
      borderRadius: 7,
      shadowColor: '#464d53',
      shadowOffset: {
        width: 12,
        height: 12,
      },
      shadowRadius: 7,
      elevation: 30,
    },
  })
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.dropShadow}>
        <RelativeLayout
          width={'100%'}
          height={'100%'}
          alignItems="center"
          justifyContent="center"
          borderRadius={7}
        >
          <LinearLayout
            width="100%"
            height="100%"
            borderRadius={7}
            overflow="hidden"
            position="absolute"
          >
            <LinearGradientLayout
              width="100%"
              height="100%"
              colors={['#464c52', '#1c2329']}
              end={[0.3, 1]}
            />
          </LinearLayout>
          <LinearGradientLayout
            width="96%"
            height="96%"
            borderRadius={7}
            overflow="hidden"
            justifyContent={'center'}
            colors={
              isNotEmpty && !isWatchAccount
                ? ['#41515b', '#28333b']
                : ['#313e46', '#20292f']
            }
          >
            <LinearLayout
              width="100%"
              orientation="horiz"
              justifyContent={'center'}
            >
              {isNotEmpty && !isWatchAccount ? (
                <Image
                  width={13}
                  height={16}
                  source={require('~src/assets/images/arrow-up-green.png')}
                />
              ) : (
                <Image
                  width={13}
                  height={16}
                  source={require('~src/assets/images/arrow-gray.png')}
                />
              )}
            </LinearLayout>
          </LinearGradientLayout>
        </RelativeLayout>
      </View>
    </TouchableWithoutFeedback>
  )
}

ThemedSendButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  account: PropTypes.any,
}

export {ThemedSendButton}
