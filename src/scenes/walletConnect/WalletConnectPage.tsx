import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'

import {wrapper} from '~/src/app/ApplicationWrapper'
import HeaderActionButton from '~/src/components/layout/HeaderActionButton'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {WalletConnectStackParamList} from '~/src/navigation/WalletConnectStackNavigation'
import {WCConnectedDapps} from '~/src/scenes/walletConnect/components/WCConnectedDapps'
import {WCNoConnectDapps} from '~/src/scenes/walletConnect/components/WCNoConnectDapps'

interface WalletConnectPageProps {
  navigation: StackNavigationProp<WalletConnectStackParamList>
  route: RouteProp<WalletConnectStackParamList, 'WalletConnectPage'>
}

const WalletConnectPage = (props: WalletConnectPageProps) => {
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const {sessions} = useWalletConnect()

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'add',
        actionOnPress: () => {
          navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.WCConnectDappModal.name,
          })
        },
      }),
  })

  return sessions.length < 1 ? <WCNoConnectDapps /> : <WCConnectedDapps />
}

export default WalletConnectPage
