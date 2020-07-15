import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {Text, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ImageView, LinearLayout, RelativeLayout, TextView} from '~src/styles/styled-components'
import { NativeModulesProxy } from '@unimodules/core';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
}

export default function PasscodePage(props: Props) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={16}
    >
      <LinearLayout
        mt={32}
        orientation="horiz">
        <LinearLayout flex={1} />
        <ImageView source={require('~/src/assets/images/icon-lock.png')} />
        <LinearLayout flex={1} alignItems="flex-end" justifyContent="center">
          <TextView
            fontSize={16}
            color="text.0"
          >Cancel</TextView>
        </LinearLayout>
      </LinearLayout>
      <TouchableWithoutFeedback onPress={() => NativeModulesProxy.ExpoLocalAuthentication.authenticateAsync().then(value => console.log(value))}>
        <LinearLayout bg={'red'} height={50} width={600} />
      </TouchableWithoutFeedback>
    </ScreenLayout>
  )
}
