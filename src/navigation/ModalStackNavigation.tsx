import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {TokenValue} from '~src/models/TokenValue'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import CreateAccountModal from '~src/scenes/CreateAccountModal'
import CurrencyPickerModal from '~src/scenes/CurrencyPickerModal'
import CustomColorPage, {
  CustomColorPageParam,
} from '~src/scenes/CustomColorPage'
import EditAccountModal, {
  EditAccountModalParam,
} from '~src/scenes/EditAccountModal'
import LanguagePickerModal from '~src/scenes/LanguagePickerModal'
import ListTokenModal from '~src/scenes/ListTokenModal'
import ReorderWalletModal from '~src/scenes/ReorderWalletModal'
import ThemePickerModal from '~src/scenes/ThemePickerModal'
import WalletContextModal from '~src/scenes/WalletContextModal'
import WelcomePage from '~src/scenes/WelcomePage'
import ReceiveToAccountModal from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'
import SendTransactionConfirmationModal from '~src/scenes/send/SendTransactionConfirmationModal'
import SendTransactionInputModal from '~src/scenes/send/SendTransactionInputModal'
import SendTransactionReviewModal from '~src/scenes/send/SendTransactionReviewModal'
import SendWalletSelectionModal from '~src/scenes/send/SendWalletSelectionModal'

export type ModalStackParamList = {
  WelcomeModal: undefined
  CreateAccountModal: undefined
  EditAccountModal: EditAccountModalParam
  ReceiveWalletSelectionModal: undefined
  ReceiveToAccountModal: undefined
  SendWalletSelectionModal: undefined
  SendTransactionReviewModal: undefined
  SendTransactionInputModal: undefined
  SendTransactionConfirmationModal: undefined
  CustomColor: {onColorPicked: (hex: string) => void}
  WalletContextModal: undefined
  ReorderWalletModal: undefined
  ListTokenModal: {
    selectedToken: TokenValue | null
    setToken: React.Dispatch<React.SetStateAction<TokenValue | null>>
  }
  LanguagePickerModal: undefined
  CurrencyPickerModal: undefined
  ThemePickerModal: undefined
}

export type ModalParams =
  | (DefaultNavigationParam &
      Partial<CustomColorPageParam> &
      Partial<EditAccountModalParam>)
  | undefined

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <ModalStack.Navigator
        initialRouteName={Facade.route.CreateAccountModal.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <ModalStack.Screen
          name={Facade.route.WelcomeModal.name}
          component={WelcomePage}
        />
        <ModalStack.Screen
          name={Facade.route.CreateAccountModal.name}
          component={CreateAccountModal}
        />
        <ModalStack.Screen
          name={Facade.route.EditAccountModal.name}
          component={EditAccountModal}
          initialParams={props.route?.params}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveToAccountModal.name}
          component={ReceiveToAccountModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendWalletSelectionModal.name}
          component={SendWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionReviewModal.name}
          component={SendTransactionReviewModal}
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
          name={Facade.route.ReorderWalletModal.name}
          component={ReorderWalletModal}
        />
        <ModalStack.Screen
          name={Facade.route.ListTokenModal.name}
          component={ListTokenModal}
        />
        <ModalStack.Screen
          name={Facade.route.LanguagePickerModal.name}
          component={LanguagePickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.CurrencyPickerModal.name}
          component={CurrencyPickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.ThemePickerModal.name}
          component={ThemePickerModal}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
