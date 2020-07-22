import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import CustomColorPage from '~src/scenes/CustomColorPage'
import ReceiveWalletSelectionModal from '~src/scenes/ReceiveWalletSelectionModal'
import ReoderWalletModal from '~src/scenes/ReorderWalletModal'
import SampleModal from '~src/scenes/SampleModal'
import WalletContextModal from '~src/scenes/WalletContextModal'
import WelcomePage from '~src/scenes/WelcomePage'
import SendTransactionConfirmationModal from '~src/scenes/send/SendTransactionConfirmationModal'
import SendWalletSelectionModal from '~src/scenes/send/SendWalletSelectionModal'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import SendTransactionInputModal from '~src/scenes/send/SendTransactionInputModal'

export type ModalStackParamList = {
  WelcomeModal: undefined
  SampleModal: undefined
  ReceiveWalletSelectionModal: undefined
  SendWalletSelectionModal: undefined
  SendTransactionInputModal: undefined
  SendTransactionConfirmationModal: undefined
  CustomColor: {onColorPicked: (hex: string) => void}
  WalletContextModal: undefined
  ReoderWalletModal: undefined
}

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ThemeProvider theme={theme}>
      <ModalStack.Navigator
        initialRouteName={Facade.route.SampleModal.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <ModalStack.Screen
          name={Facade.route.WelcomeModal.name}
          component={WelcomePage}
        />
        <ModalStack.Screen
          name={Facade.route.SampleModal.name}
          component={SampleModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendWalletSelectionModal.name}
          component={SendWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionInputModal.name}
          component={SendTransactionInputModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionConfirmationModal.name}
          component={SendTransactionConfirmationModal}
        />
        <ModalStack.Screen
          name={Facade.route.CustomColor.name}
          component={CustomColorPage}
          initialParams={props.route?.params}
        />
        <ModalStack.Screen
          name={Facade.route.WalletContextModal.name}
          component={WalletContextModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReoderWalletModal.name}
          component={ReoderWalletModal}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
