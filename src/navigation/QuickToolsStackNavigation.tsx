import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {HeaderCustomProps} from '~src/components/layout/HeaderBar'
import {Account} from '~src/models/redux/Account'
import AccountAssetDetail from '~src/scenes/Account/AccountAssetDetail'

export type QuickToolsStackParamList = {
  AccountAssetDetail: {account: Account} & HeaderCustomProps
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => {
    return wrapper.theme[state.settings.theme]
  })

  return (
    <ThemeProvider theme={theme}>
      <QuickToolsStack.Navigator>
        <QuickToolsStack.Screen
          name={wrapper.route.AccountAssetDetail.name}
          component={AccountAssetDetail}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
      </QuickToolsStack.Navigator>
    </ThemeProvider>
  )
}

export default QuickToolsStackNavigation
