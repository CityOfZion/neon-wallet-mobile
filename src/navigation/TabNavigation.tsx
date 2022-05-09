import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback, useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {RootStore} from '../store/RootStore'

import * as data from '~src/Changelog.json'
import {appBus} from '~src/app/AppBus'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Storage} from '~src/app/Storage'
import FooterBar from '~src/components/layout/FooterBar'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import ContactsStackNavigation, {
  ContactsStackParams,
} from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation, {
  MoreStackParam,
} from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import WalletConnectStackNavigation from '~src/navigation/WalletConnectStackNavigation'
import WalletStackNavigation, {
  WalletStackParams,
} from '~src/navigation/WalletsStackNavigation'

export type TabStackParamList = {
  ListWallets: WalletStackParams
  Contacts: ContactsStackParams
  WalletConnectPage: undefined
  More: MoreStackParam
}

export type TabParams =
  | (
      | DefaultNavigationParam<MoreStackParam>
      | DefaultNavigationParam<WalletStackParams>
    )
  | undefined

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'Tab'>
}

const Tab = createBottomTabNavigator()

const TabNavigation = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {isFirstTime} = useSelector((state: RootState) => state.settings)
  const {requests, sessions} = useWalletConnect()
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  useEffect(() => {
    async function handleData() {
      const currentNumberOfVersions = Object.keys(data.changelog).length
      const storageNumberOfVersion = await Storage.numberOfVersions.load()

      if (isFirstTime) {
        Storage.changelogHidden.save(true)
        Storage.welcomeHidden.save(true)
        Storage.welcomeToNWSeen.save(true)
      }

      if (storageNumberOfVersion !== currentNumberOfVersions || isFirstTime) {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.WelcomeModal.name,
          params: {
            showChangelog: true,
          },
        })
        dispatch(RootStore.settings.actions.setIsFirstTime(false))
        await dispatchAsync(RootStore.settings.actions.save())
      }
    }

    handleData()
  }, [])

  useEffect(() => {
    appBus.on(
      'navigateTransactionDetails',
      (transaction: SenderTransaction) => {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.TransactionDetails.name,
          params: {
            transaction,
          },
        })
      }
    )
  }, [])

  const navigateToTransactionRequetModal = useCallback(async () => {
    if (requests.length > 0 && sessions.length > 0) {
      const foundSession = sessions.find((it) => it.topic === requests[0].topic)

      if (foundSession) {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.TransactionRequestModal.name,
          params: {
            request: requests[0],
            session: foundSession,
          },
        })
      }
    }
  }, [requests, sessions])

  useEffect(() => {
    navigateToTransactionRequetModal()
  }, [requests])

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <Tab.Navigator tabBar={(props) => <FooterBar {...props} />}>
        <Tab.Screen
          name={wrapper.route.ListWallets.name}
          component={WalletStackNavigation}
        />
        <Tab.Screen
          name={wrapper.route.WalletConnectPage.name}
          component={WalletConnectStackNavigation}
        />
        <Tab.Screen
          name={wrapper.route.Contacts.name}
          component={ContactsStackNavigation}
        />
        <Tab.Screen
          name={wrapper.route.QuickTools.name}
          component={QuickToolsStackNavigation}
        />
        <Tab.Screen
          name={wrapper.route.More.name}
          component={MoreStackNavigation}
        />
      </Tab.Navigator>
    </ThemeProvider>
  )
}

export default TabNavigation
