import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  GestureResponderEvent,
  View,
} from 'react-native'
import {useSelector} from 'react-redux'

import {LinearLayout, RelativeLayout} from '~/src/styles/styled-components'
import {Account} from '~src/models/redux/Account'
interface Props {
  account?: Account
  onPress?: (evt: GestureResponderEvent) => void
}

const ThemedSendButton: React.FC<Props> = (props) => {
  const isWatchAccount = props.account?.accountType === 'watch'
  const isNotEmpty = props.account?.hasFunds
  const {isConnected} = useSelector((state: RootState) => state.network)
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
            <LinearLayout width="100%" height="100%" bg={'#1c2329'} />
          </LinearLayout>
          <LinearLayout
            width="96%"
            height="96%"
            borderRadius={7}
            overflow="hidden"
            justifyContent={'center'}
            bg={isNotEmpty && !isWatchAccount ? '#41515b' : '#313e46'}
            style={{borderRadius: 7}}
          >
            <LinearLayout
              width="100%"
              orientation="horiz"
              justifyContent={'center'}
            >
              {isNotEmpty && !isWatchAccount && isConnected ? (
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
          </LinearLayout>
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
