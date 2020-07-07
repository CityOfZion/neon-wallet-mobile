import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {$} from '~/facade'
import CustomColorPage from '~src/scenes/CustomColorPage'
import ReceiveWalletSelectionModal from '~src/scenes/ReceiveWalletSelectionModal'
import SampleModal from '~src/scenes/SampleModal'
import SendTransactionConfirmationModal from '~src/scenes/send/SendTransactionConfirmationModal'
import SendWalletSelectionModal from '~src/scenes/send/SendWalletSelectionModal'
import {RootState} from '~src/store/reducers/root'

export type ModalStackParamList = {
  SampleModal: undefined
  ReceiveWalletSelectionModal: undefined
  SendWalletSelectionModal: undefined
  SendTransactionConfirmationModal: undefined
  CustomColor: undefined
}

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <ModalStack.Navigator
        initialRouteName={$.path.SampleModal.name}
        headerMode="none"
        screenOptions={$.config.screen}
      >
        <ModalStack.Screen
          name={$.path.SampleModal.name}
          component={SampleModal}
        />
        <ModalStack.Screen
          name={$.path.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={$.path.SendWalletSelectionModal.name}
          component={SendWalletSelectionModal}
        />
        <ModalStack.Screen
          name={$.path.SendTransactionConfirmationModal.name}
          component={SendTransactionConfirmationModal}
        />
        <ModalStack.Screen
          name={$.path.CustomColor.name}
          component={CustomColorPage}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
