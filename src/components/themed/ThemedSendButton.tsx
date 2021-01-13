import PropTypes from 'prop-types'
import React from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  GestureResponderEvent,
  View,
} from 'react-native'

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
      backgroundColor: '#364046dd',
      shadowColor: '#464d53',
      shadowOffset: {
        width: 12,
        height: 12,
      },
      shadowRadius: 7,
      elevation: 30,
      borderWidth: 1,
      borderColor: '#ffffff22',
    },
  })
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.dropShadow}>
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
      </View>
    </TouchableWithoutFeedback>
  )
}

ThemedSendButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  account: PropTypes.any,
}

export {ThemedSendButton}
