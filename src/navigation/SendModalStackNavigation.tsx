import { RouteProp } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack'
import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBackButton from '~src/components/layout/HeaderBackButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { screenConfig } from '~src/config/ScreenConfig'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import SendAccountSelectionModal, { SendAccountSelectionModalParams } from '~src/scenes/send/SendAccountSelectionModal'
import SendTransactionConfirmationModal, {
  SendTransactionConfirmationModalParams,
} from '~src/scenes/send/SendTransactionConfirmationModal'
import SendTransactionInputModal, { SendTransactionInputModalParams } from '~src/scenes/send/SendTransactionInputModal'
import SendTransactionReviewModal from '~src/scenes/send/SendTransactionReviewModal'
import SendWalletSelectionModal, { SendWalletSelectionModalParams } from '~src/scenes/send/SendWalletSelectionModal'
export type SendModalStackParamList = {
  SendWalletSelectionModal: SendWalletSelectionModalParams
  SendAccountSelectionModal: SendAccountSelectionModalParams
  SendTransactionInputModal: SendTransactionInputModalParams
  SendTransactionReviewModal: undefined
  SendTransactionConfirmationModal: SendTransactionConfirmationModalParams
}

export type SendStackModalParams =
  | DefaultNavigationParam<SendWalletSelectionModalParams>
  | DefaultNavigationParam<SendAccountSelectionModalParams>
  | DefaultNavigationParam<SendTransactionInputModalParams>
  | DefaultNavigationParam<SendTransactionConfirmationModalParams>

const SendModalStack = createStackNavigator<SendModalStackParamList>()

interface SendModalStackProps {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'SendModalStack'>
}

const SendModalStackNavigation = (props: SendModalStackProps) => {
  const theme = useSelector((state: RootState) => {
    return wrapper.theme[state.settings.theme]
  })
  const controller = useSwiperController(true)
  return (
    <ThemeProvider theme={theme}>
      <SwiperPanel
        controller={controller}
        noHeader
        fullSize
        title="Ué"
        padding={0}
        rightButton={<ThemedCloseButton onPress={controller.close} />}
        onClose={() => props.navigation.goBack()}
        disableDefaultScrollView
        solidColorBG
      >
        <View
          style={{
            height: '100%',
          }}
        >
          <SendModalStack.Navigator
            initialRouteName="SendWalletSelectionModal"
            screenOptions={{
              ...screenConfig,
              headerLeft: HeaderBackButton,
              headerRight: () =>
                HeaderActionButton({
                  actionButtonStyle: 'close',
                  actionOnPress: controller.close,
                }),
              headerTransparent: true,
            }}
          >
            <SendModalStack.Screen
              name={wrapper.route.SendWalletSelectionModal.name}
              component={SendWalletSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: i18n.t('modals.send.title'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={wrapper.route.SendAccountSelectionModal.name}
              component={SendAccountSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: i18n.t('modals.send.title'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={wrapper.route.SendTransactionReviewModal.name}
              component={SendTransactionReviewModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: i18n.t('modals.send.title'),
                  }),
                headerLeft: HeaderBackButton,
              })}
            />
            <SendModalStack.Screen
              name={wrapper.route.SendTransactionInputModal.name}
              component={SendTransactionInputModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: i18n.t('modals.send.title'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={wrapper.route.SendTransactionConfirmationModal.name}
              component={SendTransactionConfirmationModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: i18n.t('modals.send.title'),
                  }),
              })}
            />
          </SendModalStack.Navigator>
        </View>
      </SwiperPanel>
    </ThemeProvider>
  )
}

export default SendModalStackNavigation
