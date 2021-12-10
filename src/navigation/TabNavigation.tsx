import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {appBus} from '../app/AppBus'
import {wrapper} from '../app/ApplicationWrapper'
import {SenderTransaction} from '../models/redux/SenderTransaction'

import * as data from '~src/Changelog.json'
import FooterBar from '~src/components/layout/FooterBar'
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
import {useWalletConnect} from '~src/contexts/WalletConnectContext'

export type TabStackParamList = {
  ListWallets: WalletStackParams
  Contacts: ContactsStackParams
  WalletConnectPage: undefined
  More: MoreStackParam
}

export type TabParams =
  | ((
      | DefaultNavigationParam<MoreStackParam>
      | DefaultNavigationParam<WalletStackParams>
    ) &
      Partial<{
        welcomeHidden?: boolean
        changelogHidden?: boolean
        numberOfVersions?: number
      }>)
  | undefined

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'Tab'>
}

const Tab = createBottomTabNavigator()

const TabNavigation = (props: Props) => {
  const currentNumberOfVersions = Object.keys(data.changelog).length
  const welcomeHiddenStorage = props.route.params?.welcomeHidden ?? false
  const changelogHiddenStorage = props.route.params?.changelogHidden ?? false
  const numberOfVersionsStorage = props.route.params?.numberOfVersions ?? 0
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {requests} = useWalletConnect()
  const [welcomeHidden, setWelcomeHidden] = useState(
    props.route.params?.welcomeHidden ?? true
  )

  const [changelogHidden, setChangelogHidden] = useState(
    props.route.params?.changelogHidden ?? true
  )

  if (numberOfVersionsStorage !== currentNumberOfVersions) {
    if (!changelogHidden && !changelogHiddenStorage) {
      if (!welcomeHiddenStorage) {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.WelcomeModal.name,
          params: {
            showChangelog: true,
          },
        })
      } else {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.ChangelogModal.name,
        })
      }
      setChangelogHidden(true)
    }
  } else {
    useEffect(() => {
      if (!welcomeHidden && welcomeHiddenStorage) {
        props.navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.WelcomeModal.name,
        })
        setWelcomeHidden(true)
      }
    }, [welcomeHidden])
  }

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

  useEffect(() => {
    if(requests.length > 0){
      props.navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.TransactionRequestModal.name
      })
    }
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
