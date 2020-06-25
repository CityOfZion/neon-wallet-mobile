import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {TouchableHighlight} from 'react-native'

import SwiperPanel, {
  BackButton,
  CancelButton,
} from '~src/components/SwiperPanel'
import {TextView} from '~src/styles/styled-components'

export default function SampleModal() {
  const navigation = useNavigation()

  return (
    <SwiperPanel
      title="Modal Title"
      leftButton={<BackButton text="Back" />}
      rightButton={<CancelButton />}
      onLeftPress={() => navigation.goBack()}
      onRightPress={() => navigation.goBack()}
      image={require('~/src/assets/images/card-neo.png')}
    >
      <TouchableHighlight
        style={{
          marginBottom: 250,
          marginTop: 100,
        }}
        onPress={() => navigation.goBack()}
      >
        <TextView
          color="white"
          fontSize={60}
          fontFamily="semibold"
          alignSelf="center"
        >
          Close me
        </TextView>
      </TouchableHighlight>
    </SwiperPanel>
  )
}
