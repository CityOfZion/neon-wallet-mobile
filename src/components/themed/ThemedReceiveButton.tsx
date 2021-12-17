import PropTypes from 'prop-types'
import React from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  GestureResponderEvent,
  View,
} from 'react-native'

import {LinearLayout, RelativeLayout} from '~/src/styles/styled-components'
interface Props {
  onPress: (evt: GestureResponderEvent) => void
}

const ThemedReceiveButton: React.FC<Props> = (props) => {
  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 71,
      height: 45,
      borderRadius: 7,

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
            bg={'#41515b'}
            style={{borderRadius: 7}}
          >
            <LinearLayout
              width="100%"
              orientation="horiz"
              justifyContent={'center'}
            >
              <Image
                width={13}
                height={16}
                source={require('~src/assets/images/arrow-down-green.png')}
              />
            </LinearLayout>
          </LinearLayout>
        </RelativeLayout>
      </View>
    </TouchableWithoutFeedback>
  )
}

ThemedReceiveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export {ThemedReceiveButton}
