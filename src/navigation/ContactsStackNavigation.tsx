import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {useRoutePath} from '~src/app/RouteUtils'
import ContactsPage from '~src/scenes/ContactsPage'
import {RootState} from '~src/store/reducers/root'

export type ContactsStackParamList = {
  Contacts: undefined
}

const ContactsStack = createStackNavigator<ContactsStackParamList>()

const ContactsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const path = useRoutePath()

  return (
    <ThemeProvider theme={theme}>
      <ContactsStack.Navigator screenOptions={{headerShown: false}}>
        <ContactsStack.Screen
          name={path.Contacts.name}
          component={ContactsPage}
        />
      </ContactsStack.Navigator>
    </ThemeProvider>
  )
}

export default ContactsStackNavigation
