import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import ContactsPage from '~src/scenes/ContactsPage'
import {RootState} from '~src/store/reducers/root'

export type ContactsStackParamList = {
  Contacts: HeaderActionButtonProps
}

const ContactsStack = createStackNavigator<ContactsStackParamList>()

const ContactsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <ContactsStack.Navigator>
        <ContactsStack.Screen
          name={Facade.path.Contacts.name}
          initialParams={{
            actionButtonStyle: 'add',
            // TODO: Add event
            actionOnPress: () => {},
          }}
          component={ContactsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.path.Contacts.name,
              theme,
              route,
            })
          }
        />
      </ContactsStack.Navigator>
    </ThemeProvider>
  )
}

export default ContactsStackNavigation
