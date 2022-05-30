import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {
  ContactDetails,
  ContactDetailsParams,
} from '~src/scenes/Contacts/ContactsDetails'
import ContactsPage from '~src/scenes/Contacts/ContactsPage'

export type ContactsStackParamList = {
  Contacts: HeaderActionButtonProps
  ContactDetails: ContactDetailsParams
}

interface ContactsStackProps {
  navigation: StackNavigationProp<RootStackParamList>
}

export type ContactsStackParams = DefaultNavigationParam<ContactDetailsParams>

const ContactsStack = createStackNavigator<ContactsStackParamList>()

const ContactsStackNavigation = (props: ContactsStackProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <ContactsStack.Navigator initialRouteName={wrapper.route.Contacts.name}>
        <ContactsStack.Screen
          name={wrapper.route.Contacts.name}
          component={ContactsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Contacts.name,
              theme,
              route,
            })
          }
        />
        <ContactsStack.Screen
          name={wrapper.route.ContactDetails.name}
          component={ContactDetails}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Contacts.translate(),
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
