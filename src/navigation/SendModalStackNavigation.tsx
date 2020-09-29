import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {ImageSourcePropType, View} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  SwiperController,
  useSwiperController,
} from '~src/components/SwiperPanel'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBackButton from '~src/components/layout/HeaderBackButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import SendAccountSelectionModal, {
  SendAccountSelectionModalParams,
} from '~src/scenes/send/SendAccountSelectionModal'
import SendTransactionConfirmationModal, {
  SendTransactionConfirmationModalParams,
} from '~src/scenes/send/SendTransactionConfirmationModal'
import SendTransactionInputModal, {
  SendTransactionInputModalParams,
} from '~src/scenes/send/SendTransactionInputModal'
import SendTransactionReviewModal from '~src/scenes/send/SendTransactionReviewModal'
import SendWalletSelectionModal, {
  SendWalletSelectionModalParams,
} from '~src/scenes/send/SendWalletSelectionModal'

export type SendModalStackParamList = {
  SendWalletSelectionModal: SendWalletSelectionModalParams
  SendAccountSelectionModal: SendAccountSelectionModalParams
  SendTransactionInputModal: SendTransactionInputModalParams
  SendTransactionReviewModal: undefined
  SendTransactionConfirmationModal: SendTransactionConfirmationModalParams
}

const SendModalStack = createStackNavigator<SendModalStackParamList>()

interface SendModalStackProps {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'SendModalStack'>
}

interface HeaderProps {
  navigation: StackNavigationProp<SendModalStackParamList>
  controller: SwiperController
  title: string
  image: ImageSourcePropType
}

const SendModalStackNavigation = (props: SendModalStackProps) => {
  const theme = useSelector((state: RootState) => {
    return Facade.theme[state.settings.theme]
  })
  const controller = useSwiperController(true)

  return (
    <ThemeProvider theme={theme}>
      <SwiperPanel
        controller={controller}
        noHeader={true}
        fullSize={true}
        title={'Ué'}
        padding={0}
        rightButton={<ThemedCloseButton onPress={controller.close} />}
        onClose={() => props.navigation.goBack()}
        image={require('~/src/assets/images/upload-white.png')}
        disableDefaultScrollView={true}
      >
        <View
          style={{
            height: '100%',
          }}
        >
          <SendModalStack.Navigator
            initialRouteName={'SendWalletSelectionModal'}
            screenOptions={{
              ...Facade.config.screen,
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
              name={Facade.route.SendWalletSelectionModal.name}
              component={SendWalletSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.send.title'),
                    image: require('~/src/assets/images/upload-white.png'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={Facade.route.SendAccountSelectionModal.name}
              component={SendAccountSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.send.title'),
                    image: require('~/src/assets/images/upload-white.png'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={Facade.route.SendTransactionReviewModal.name}
              component={SendTransactionReviewModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.send.title'),
                    image: require('~/src/assets/images/upload-white.png'),
                  }),
                headerLeft: HeaderBackButton,
              })}
            />
            <SendModalStack.Screen
              name={Facade.route.SendTransactionInputModal.name}
              component={SendTransactionInputModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.send.title'),
                    image: require('~/src/assets/images/upload-white.png'),
                  }),
              })}
            />
            <SendModalStack.Screen
              name={Facade.route.SendTransactionConfirmationModal.name}
              component={SendTransactionConfirmationModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.send.title'),
                    image: require('~/src/assets/images/upload-white.png'),
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
