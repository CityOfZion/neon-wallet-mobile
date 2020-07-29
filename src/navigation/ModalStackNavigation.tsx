import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {AddContact} from '~src/components/AddContact'
import {TokenValue} from '~src/models/TokenValue'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
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
import ReceiveAccountSelectionModal from '~src/scenes/receive/ReceiveAccountSelectionModal'
import ReceiveToAccountModal from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'
import SendAccountSelectionModal from '~src/scenes/send/SendAccountSelectionModal'
import SendTransactionConfirmationModal from '~src/scenes/send/SendTransactionConfirmationModal'
import SendTransactionInputModal from '~src/scenes/send/SendTransactionInputModal'
import SendTransactionReviewModal from '~src/scenes/send/SendTransactionReviewModal'
import SendWalletSelectionModal from '~src/scenes/send/SendWalletSelectionModal'
import {AccountQRCodeParams} from "~src/scenes/Account/AccountQRCode";

export type ModalStackParamList = {
  WelcomeModal: undefined
  CreateAccountModal: undefined
  EditAccountModal: EditAccountModalParam
  ReceiveWalletSelectionModal: undefined
  AccountQRCode: AccountQRCodeParams
  ReceiveAccountSelectionModal: {wallet: Wallet}
  ReceiveToAccountModal: {
    walletTitle: string
    account: Account
  }
  SendWalletSelectionModal: undefined
  SendAccountSelectionModal: {wallet: Wallet}
  SendTransactionInputModal: {
    walletTitle: string
    account: Account
  }
  SendTransactionReviewModal: undefined
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
  AddContact: undefined
  QRCodeScan: undefined
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
          name={Facade.route.ReceiveAccountSelectionModal.name}
          component={ReceiveAccountSelectionModal}
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
          name={Facade.route.SendAccountSelectionModal.name}
          component={SendAccountSelectionModal}
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
        <ModalStack.Screen
          name={Facade.route.AddContact.name}
          component={AddContact}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
