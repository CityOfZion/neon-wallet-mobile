import React, {useRef, useState, useEffect} from 'react'
import {Dimensions, View} from 'react-native'
import {TabView, SceneMap, TabBar, ScrollPager} from 'react-native-tab-view'

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
      </ButtonView>
    </LinearLayout>
  )
}

interface ITabSelectorBar {
  firstScene: IScene
  secondScene: IScene
  setFirstTabAsSelected?: React.Dispatch<React.SetStateAction<boolean>>
}
interface IScene {
  title: string
  Element: (props?: any) => JSX.Element
}

export const TabSelectorBar: React.FC<ITabSelectorBar> = (
  props: ITabSelectorBar
) => {
  const [index, SetIndex] = useState<number>(0)
  const renderScenes = SceneMap({
    [props.firstScene.title]: props.firstScene.Element,
    [props.secondScene.title]: props.secondScene.Element,
  })
  const initialLayout = {width: Dimensions.get('window').width, height: 10}
  const [routes] = useState([
    {key: props.firstScene.title, title: props.firstScene.title},
    {key: props.secondScene.title, title: props.secondScene.title},
  ])

  useEffect(() => {
    if (index === 0 && props.setFirstTabAsSelected) {
      props.setFirstTabAsSelected(false) //if not assets selected, make a fetch transactions
    }
  }, [index])

  return (
    <TabView
      renderScene={renderScenes}
      onIndexChange={SetIndex}
      initialLayout={initialLayout}
      navigationState={{index, routes}}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: '#4cffb3'}}
          style={{backgroundColor: '#ffffff00', elevation: 0}}
          pressColor={'#000BB'}
        />
      )}
    />
  )
}

export default TabSelector
