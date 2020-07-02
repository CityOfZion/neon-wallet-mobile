import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {defaultScreenOptions, ROUTES} from '~/constants'
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
        initialRouteName={ROUTES.SAMPLE_MODAL.name}
        headerMode="none"
        screenOptions={defaultScreenOptions}
      >
        <ModalStack.Screen
          name={ROUTES.SAMPLE_MODAL.name}
          component={SampleModal}
        />
        <ModalStack.Screen
          name={ROUTES.RECEIVE_WALLET_SELECTION_MODAL.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={ROUTES.SEND_WALLET_SELECTION_MODAL.name}
          component={SendWalletSelectionModal}
        />
        <ModalStack.Screen
          name={ROUTES.SEND_TRANSACTION_CONFIRMATION_MODAL.name}
          component={SendTransactionConfirmationModal}
        />
        <ModalStack.Screen
          name={ROUTES.CUSTOM_COLOR.name}
          component={CustomColorPage}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
