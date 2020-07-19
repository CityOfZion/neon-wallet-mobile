import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {Text, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<RootStackParamList & LoginStackParamList>
}

export default function LoginPage(props: Props) {
  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={32}
    >
      <ImageView
        height={193}
        width={193}
        mb={12}
        source={require('~/src/assets/images/logo-small.png')}
      />
      <TextView color={'text.0'} fontSize={31} letterSpacing={3.29}>
        {Facade.t('login.brand')}
      </TextView>

      <LinearLayout position={'absolute'} bottom={0} alignItems={'center'}>
        <TextView
          mb={24}
          color={'primary'}
          fontSize={30}
          letterSpacing={0.46}
          fontFamily={'semibold'}
        >
          {Facade.t('login.title')}
        </TextView>

        <TextView
          mb={60}
          color={'text.0'}
          fontSize={'18px'}
          letterSpacing={0.2}
          textAlign={'center'}
        >
          {Facade.t('login.body')}
        </TextView>

        <LinearLayout width={'100%'}>
          <ThemedButton
            textColor={'text.9'}
            bgColor={'primary'}
            basic={true}
            label={Facade.t('login.continue')}
            fontFamily={'medium'}
            onPress={() => props.navigation.navigate(Facade.route.Passcode.name)}
          />
        </LinearLayout>

        <TouchableWithoutFeedback
          onPress={() => props.navigation.replace('Tab')}
        >
          <TextView
            mt={42}
            mb={16}
            p={16}
            color={'text.8'}
            fontSize={'18px'}
            letterSpacing={1.93}
            textAlign={'center'}
          >
            {Facade.t('login.skip')}
          </TextView>
        </TouchableWithoutFeedback>

        <ImageView
          width={98}
          height={30}
          mb={18}
          source={require('~src/assets/logos/logo-coz.png')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}
