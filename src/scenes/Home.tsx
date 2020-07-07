import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {expo} from '~/app.json'
import {$} from '~/facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {NeoNode} from '~src/models/NeoNode'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'

type HomeStackParametersList = {
  Welcome: undefined
  CreateWallet: undefined
  Onboarding: undefined
  CustomColor: undefined
  ReceiveQRCode: undefined
  Modal: {screen: string}
  Wallet: undefined
  Settings: undefined
  More: undefined
  GetWallet: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
  theme: DefaultTheme
}

const Home = (props: Props) => {
  return (
    <ScreenLayout>
      <LinearLayout weight={1} mb={4}>
        <LinearLayout m={3}>
          <ThemedButton
            onPress={() => props.navigation.navigate('CreateWallet')}
            label={'Create Wallet'}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onPress={() => props.navigation.navigate('ReceiveQRCode')}
            label={'Receive QRCode'}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onPress={() => props.navigation.navigate('CustomColor')}
            label={'Custom Color Page'}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onPress={() =>
              props.navigation.navigate('Modal', {screen: 'SampleModal'})
            }
            label={'Sample Modal Page'}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onPress={() => props.navigation.navigate($.path.GetWallet.name)}
            label={'Account'}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout alignItems="flex-end">
        <TextView color="text.0"> Version: {expo.version}</TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Home
