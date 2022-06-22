import PropTypes from 'prop-types'
import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { BoxShadow } from 'react-native-shadow'
interface IThemedeShadowContainer {
  radius?: number
  color?: string
  opacity?: number
  android: {
    width?: number
    height?: number
    border?: number
    radius?: number
    opacity?: number
    x?: number
    y?: number
  }
  children?: React.ReactNode
}

const ThemedShadowContainer: React.FC<IThemedeShadowContainer> = props => {
  const styles = StyleSheet.create({
    design: {
      shadowRadius: props.radius ?? 15,
      shadowOpacity: props.opacity ?? 0.5,
      shadowColor: props.color ?? '#000',
      shadowOffset: { height: 5, width: 5 },
    },
  })
  return Platform.OS === 'ios' ? (
    <View style={styles.design}>{props.children}</View>
  ) : (
    <BoxShadow
      setting={{
        width: props.android.width ?? 240,
        height: props.android.height ?? 360,
        color: props.color ?? '#000',
        border: props.android.border ?? 15,
        radius: props.android.radius ?? 50,
        opacity: props.android.opacity ?? 0.15,
        x: props.android.x ?? 15,
        y: props.android.y ?? 20,
      }}
    >
      {props.children}
    </BoxShadow>
  )
}

ThemedShadowContainer.propTypes = {
  radius: PropTypes.number,
  opacity: PropTypes.number,
  color: PropTypes.string,
  android: PropTypes.any,
  children: PropTypes.element,
}

export default ThemedShadowContainer
