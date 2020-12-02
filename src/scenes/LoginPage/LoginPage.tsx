import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useDispatch} from 'react-redux'

import {ThemedFlatButton} from '~/src/components/themed/ThemedFlatButton'
import {Security} from '~/src/enums/Security'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
}

export default function LoginPage(props: Props) {
  const dispatch = useDispatch()

  const continueButton = async () => {
    props.navigation.replace(Facade.route.Tab.name, {
      screen: Facade.route.Settings.name,
      welcomeHidden: true,
      params: {
        screen: Facade.route.SettingsPage.name,
        params: {
          initialRoute: Facade.route.SecurityModal.name,
        },
      },
    })
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={32}
    >
      <LinearLayout weight={4} width="100%" minHeight="12px" />
      <LinearLayout>
        <ImageView
          height={193}
          width={193}
          source={require('~/src/assets/images/logo-small.png')}
        />
        <TextView color={'text.0'} fontSize={31} letterSpacing={3.29}>
          {Facade.t('login.brand')}
        </TextView>
      </LinearLayout>

      <LinearLayout weight={1} width="100%" minHeight="12px" />

      <LinearLayout width="100%" alignItems={'center'}>
        <TextView
          mb={24}
          color={'primary'}
          fontSize={26}
          letterSpacing={0.46}
          textAlign={'center'}
          fontFamily={'semibold'}
        >
          {Facade.t('login.title')}
        </TextView>

        <TextView
          color={'text.0'}
          fontSize={'18px'}
          letterSpacing={0.2}
          textAlign={'center'}
        >
          {Facade.t('login.body')}
        </TextView>
        <LinearLayout
          weight={1}
          width="100%"
          minHeight="24px"
          maxHeight="60px"
        />

        <LinearLayout width={'100%'}>
          <ThemedFlatButton
            text={Facade.t('login.continue')}
            onPress={continueButton}
          />
        </LinearLayout>

        <LinearLayout
          weight={1}
          width="100%"
          minHeight="24px"
          maxHeight="42px"
        />

        <TouchableWithoutFeedback
          onPress={() => {
            dispatch(RootStore.settings.actions.setSecurity(Security.disabled))
            dispatch(RootStore.settings.actions.save())
            Storage.welcomeToNWSeen.save(true)
            props.navigation.replace(Facade.route.Tab.name, undefined)
          }}
        >
          <TextView
            p={16}
            color={'text.8'}
            fontSize={'18px'}
            letterSpacing={1.93}
            textAlign={'center'}
          >
            {Facade.t('login.skip')}
          </TextView>
        </TouchableWithoutFeedback>

        <LinearLayout
          weight={1}
          width="100%"
          minHeight="12px"
          maxHeight="16px"
        />

        <ImageView
          width={98}
          height={30}
          mb={12}
          source={require('~src/assets/logos/logo-coz.png')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}
