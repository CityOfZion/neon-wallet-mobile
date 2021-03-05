import PropTypes from 'prop-types'
import React from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderEvent,
  View,
} from 'react-native'

import {
  RelativeLayout,
  LinearLayout,
  LinearGradientLayout,
} from '~/src/styles/styled-components'
interface Props {
  onPress: (evt: GestureResponderEvent) => void
  isClaimAvailable: boolean
  children?: any
}

const ThemedClaimButton: React.FC<Props> = (props) => {
  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 209,
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
              end={[0.1, 0.8]}
            />
          </LinearLayout>
          <LinearGradientLayout
            width="98%"
            height="98%"
            borderRadius={7}
            overflow="hidden"
            justifyContent={'center'}
            colors={
              props.isClaimAvailable
                ? ['#41515b', '#28333b']
                : ['#313e46', '#20292f']
            }
          >
            <LinearLayout
              width="100%"
              orientation="horiz"
              justifyContent={'center'}
            >
              {props.children}
            </LinearLayout>
          </LinearGradientLayout>
        </RelativeLayout>
      </View>
    </TouchableWithoutFeedback>
  )
}

ThemedClaimButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  isClaimAvailable: PropTypes.bool.isRequired,
}

export {ThemedClaimButton}
