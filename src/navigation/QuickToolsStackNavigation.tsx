import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import HeaderBar, {HeaderProps} from '~src/components/HeaderBar'
import i18n from '~src/i18n'
import ReceiveQRCode from '~src/scenes/ReceiveQRCode'
import {RootState} from '~src/store/reducers/root'
import {DefaultTheme} from '~src/styles/styled-components'
import Home from '~src/scenes/Home'
import CustomColorPage from '~src/scenes/CustomColorPage'
import Account from '~src/scenes/Account'

type QuickToolsStackParamList = {
  Home: undefined
  ReceiveQRCode: undefined
  CustomColor: undefined
  Account: undefined
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const navbarOptions = (headerProps: HeaderProps, theme: DefaultTheme) => ({
  headerTitle: () => HeaderBar(headerProps),
  headerTransparent: true,
  headerStyle: {
    backgroundColor: theme.colors.background[0],
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    marginRight: 22,
  },
  headerTintColor: theme.colors.text[0],
})

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <QuickToolsStack.Navigator>
        <QuickToolsStack.Screen name={ROUTES.HOME.name} component={Home} />
        <QuickToolsStack.Screen name={ROUTES.CUSTOM_COLOR.name} component={CustomColorPage} />
        <QuickToolsStack.Screen
          name={ROUTES.RECEIVE_QR_CODE.name}
          component={ReceiveQRCode}
          options={() =>
            navbarOptions(
              {
                title: i18n.t(`routes.${ROUTES.RECEIVE_QR_CODE.name}`),
                image: require('~src/assets/images/icon-qrcode-white.png'),
                showIcon: true,
                iconMarginRight: 3,
                iconWidth: 20,
              },
              theme
            )
          }
        />
        <QuickToolsStack.Screen name={ROUTES.ACCOUNT.name} component={Account} />
      </QuickToolsStack.Navigator>
    </ThemeProvider>
  )
}

export default QuickToolsStackNavigation
