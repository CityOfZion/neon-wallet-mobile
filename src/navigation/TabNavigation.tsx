import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { RootState, RootStore } from '../store/RootStore'
import { DefaultNavigationParam } from '../types/global'
import { AsyncDispatch } from '../types/reducers/root'
import { ModalStackParamList } from './ModalStackNavigation'
import WalletConnectStackNavigation from './WalletConnectStackNavigation'
import WalletStackNavigation, { WalletStackParam } from './WalletsStackNavigation'

import * as data from '~src/Changelog.json'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Storage } from '~src/app/Storage'
import FooterBar from '~src/components/layout/FooterBar'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import ContactsStackNavigation, { ContactsStackParams } from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation, { MoreStackParam } from '~src/navigation/MoreStackNavigation'

export type TabStackParamList = {
  ListWallets: WalletStackParam
  Contacts: ContactsStackParams
  More: MoreStackParam
  WalletConnectPage: undefined
}

export type TabParams = DefaultNavigationParam<WalletStackParam> | DefaultNavigationParam<MoreStackParam> | undefined

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<RootStackParamList, 'Tab'>
}

const Tab = createBottomTabNavigator()

const TabNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { isFirstTime } = useSelector((state: RootState) => state.settings)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  useEffect(() => {
    async function handleData() {
      //TODO needs refactor to new flow onboarding
      const currentNumberOfVersions = Object.keys(data.changelog).length
      const storageNumberOfVersion = await Storage.numberOfVersions.load()

      if (isFirstTime) {
        Storage.changelogHidden.save(true)
        Storage.welcomeHidden.save(true)
        Storage.welcomeToNWSeen.save(true)
      }

      if (storageNumberOfVersion !== currentNumberOfVersions || isFirstTime) {
        await dispatchAsync(RootStore.settings.actions.save())
      }
    }

    handleData()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <StatusBar translucent barStyle={theme.statusBarStyle} backgroundColor="transparent" />
      <Tab.Navigator tabBar={props => <FooterBar {...props} />}>
        <Tab.Screen name={wrapper.route.ListWallets.name} component={WalletStackNavigation} />
        <Tab.Screen name={wrapper.route.WalletConnectPage.name} component={WalletConnectStackNavigation} />
        <Tab.Screen name={wrapper.route.Contacts.name} component={ContactsStackNavigation} />
        <Tab.Screen name={wrapper.route.More.name} component={MoreStackNavigation} />
      </Tab.Navigator>
    </ThemeProvider>
  )
}

export default TabNavigation
