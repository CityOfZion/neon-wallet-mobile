import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {ImageSourcePropType, View} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import ReceiveAccountSelectionModal, {
  ReceiveAccountSelectionModalParams,
} from '../scenes/receive/ReceiveAccountSelectionModal'

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
import ReceiveToAccountModal, {
  ReceiveToAccountModalParams,
} from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'

export type ReceiveModalStackParamList = {
  ReceiveWalletSelectionModal: undefined
  ReceiveAccountSelectionModal: ReceiveAccountSelectionModalParams
  ReceiveToAccountModal: ReceiveToAccountModalParams
}

export type ReceiveStackModalParams =
  | DefaultNavigationParam<ReceiveAccountSelectionModalParams>
  | DefaultNavigationParam<ReceiveToAccountModalParams>

const ReceiveModalStack = createStackNavigator<ReceiveModalStackParamList>()

interface ReceiveModalStackProps {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'ReceiveModalStack'>
}

const ReceiveModalStackNavigation = (props: ReceiveModalStackProps) => {
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
        disableDefaultScrollView={true}
      >
        <View
          style={{
            height: '100%',
          }}
        >
          <ReceiveModalStack.Navigator
            initialRouteName={'ReceiveWalletSelectionModal'}
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
            <ReceiveModalStack.Screen
              name={Facade.route.ReceiveWalletSelectionModal.name}
              component={ReceiveWalletSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.receive.title'),
                  }),
              })}
            />
            <ReceiveModalStack.Screen
              name={Facade.route.ReceiveAccountSelectionModal.name}
              component={ReceiveAccountSelectionModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.receive.title'),
                  }),
              })}
            />
            <ReceiveModalStack.Screen
              name={Facade.route.ReceiveToAccountModal.name}
              component={ReceiveToAccountModal}
              options={() => ({
                headerTitle: () =>
                  HeaderBar({
                    title: Facade.t('modals.receive.title'),
                  }),
                headerLeft: HeaderBackButton,
              })}
            />
          </ReceiveModalStack.Navigator>
        </View>
      </SwiperPanel>
    </ThemeProvider>
  )
}

export default ReceiveModalStackNavigation
