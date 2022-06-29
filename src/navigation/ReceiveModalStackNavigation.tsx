import { RouteProp } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import ReceiveQrCodeModal, { ReceiveQrCodeModalParams } from '../scenes/receive/ReceiveQrCodeModal'
import { RootState } from '../store/RootStore'
import { DefaultNavigationParam } from '../types/global'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack'
import { wrapper } from '~src/app/ApplicationWrapper'
import { screenConfig } from '~src/config/ScreenConfig'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import ReceiveAccountSelectionModal, {
  ReceiveAccountSelectionModalParams,
} from '~src/scenes/receive/ReceiveAccountSelectionModal'
import ReceiveToAccountModal, { ReceiveToAccountModalParams } from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'

export type ReceiveModalStackParamList = {
  ReceiveWalletSelectionModal: undefined
  ReceiveAccountSelectionModal: ReceiveAccountSelectionModalParams
  ReceiveToAccountModal: ReceiveToAccountModalParams
  ReceiveQrCodeModal: ReceiveQrCodeModalParams
}

export type ReceiveStackModalParams =
  | DefaultNavigationParam<ReceiveAccountSelectionModalParams>
  | DefaultNavigationParam<ReceiveToAccountModalParams>
  | DefaultNavigationParam<ReceiveQrCodeModalParams>

const ReceiveModalStack = createStackNavigator<ReceiveModalStackParamList>()

interface ReceiveModalStackProps {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'ReceiveModalStack'>
}

const ReceiveModalStackNavigation = (props: ReceiveModalStackProps) => {
  const theme = useSelector((state: RootState) => {
    return wrapper.theme[state.settings.theme]
  })

  return (
    <ThemeProvider theme={theme}>
      <ReceiveModalStack.Navigator
        initialRouteName="ReceiveWalletSelectionModal"
        screenOptions={screenConfig}
        headerMode="none"
      >
        <ReceiveModalStack.Screen
          name={wrapper.route.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ReceiveModalStack.Screen
          name={wrapper.route.ReceiveAccountSelectionModal.name}
          component={ReceiveAccountSelectionModal}
        />
        <ReceiveModalStack.Screen name={wrapper.route.ReceiveToAccountModal.name} component={ReceiveToAccountModal} />
        <ReceiveModalStack.Screen name={wrapper.route.ReceiveQrCodeModal.name} component={ReceiveQrCodeModal} />
      </ReceiveModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ReceiveModalStackNavigation
