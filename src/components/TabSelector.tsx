import React, {useRef} from 'react'
import {StyleSheet, Animated} from 'react-native'

import {ButtonView, LinearLayout, TextView} from '~src/styles/styled-components'

interface TabSelectorProps {
  isFirstTabSelected: boolean
  setFirstTabAsSelected: React.Dispatch<React.SetStateAction<boolean>>
  firstTabLabel: string
  secondTabLabel: string
  mb?: number
  capitalize?: boolean
  hideBorderBottom?: boolean
  selectorBar?: boolean
  moveTabBarSelector?: number
}

const TabSelector = (props: TabSelectorProps) => {
  return (
    <LinearLayout orientation="horiz" mt="36px" mb={props.mb ?? '0px'}>
      <ButtonView
        activeOpacity={1}
        onPress={() => props.setFirstTabAsSelected(true)}
        weight={1}
        alignItems="center"
        borderBottomWidth={
          !props.isFirstTabSelected || props.hideBorderBottom ? '0px' : '3px'
        }
        borderColor="primary"
      >
        <TextView
          width={'100%'}
          textAlign={'center'}
          fontSize="16px"
          pb="8px"
          fontFamily="semibold"
          borderBottomWidth={'0.8px'}
          borderColor="text.3"
          color={props.isFirstTabSelected ? 'text.0' : 'text.3'}
        >
          {props.capitalize
            ? props.firstTabLabel.toUpperCase()
            : props.firstTabLabel}
        </TextView>
        {props.selectorBar && props.isFirstTabSelected && (
          <TabSelectorBar decrementPosX={props.moveTabBarSelector ?? 0.5} />
        )}
      </ButtonView>
      <ButtonView
        activeOpacity={1}
        onPress={() => props.setFirstTabAsSelected(false)}
        weight={1}
        alignItems="center"
        borderBottomWidth={
          props.isFirstTabSelected || props.hideBorderBottom ? '0px' : '3px'
        }
        borderColor="primary"
      >
        <TextView
          width={'100%'}
          textAlign={'center'}
          fontSize="16px"
          pb="8px"
          fontFamily="semibold"
          borderBottomWidth={'0.8px'}
          borderColor="text.3"
          color={props.isFirstTabSelected ? 'text.3' : 'text.0'}
        >
          {props.capitalize
            ? props.secondTabLabel.toUpperCase()
            : props.secondTabLabel}
        </TextView>
        {props.selectorBar && !props.isFirstTabSelected && (
          <TabSelectorBar decrementPosX={props.moveTabBarSelector ?? 0.5} />
        )}
      </ButtonView>
    </LinearLayout>
  )
}

interface ITabSelectorBar {
  decrementPosX: number
}

export const TabSelectorBar: React.FC<ITabSelectorBar> = (
  props: ITabSelectorBar
) => {
  const posX = useRef(new Animated.Value(props.decrementPosX || 0))
  //To do a animation with a bar
  const styles = StyleSheet.create({
    design: {
      height: 3,
      backgroundColor: '#4cffb3',
      flex: 1,
      alignSelf: 'stretch',
    },
  })
  return (
    <Animated.View
      style={[
        styles.design,
        {
          transform: [{translateX: props.decrementPosX}],
        },
      ]}
    ></Animated.View>
  )
}

export default TabSelector
