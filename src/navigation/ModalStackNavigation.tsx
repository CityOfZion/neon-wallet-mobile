import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {defaultScreenOptions, ROUTES} from '~/constants'
import SampleModal from '~src/scenes/SampleModal'
import {RootState} from '~src/store/reducers/root'

export type ModalStackParamList = {
  SampleModal: undefined
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
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
