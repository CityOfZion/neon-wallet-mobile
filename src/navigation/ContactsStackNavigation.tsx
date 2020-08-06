import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {GetAccountParams} from '~src/scenes/Account/GetAccountView'
import {
  ContactDetails,
  ContactDetailsParams,
} from '~src/scenes/Contacts/ContactsDetails'
import ContactsPage from '~src/scenes/Contacts/ContactsPage'
import {GetWalletParams} from '~src/scenes/GetWalletView'

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
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <ContactsStack.Navigator initialRouteName={Facade.route.Contacts.name}>
        <ContactsStack.Screen
          name={Facade.route.Contacts.name}
          component={ContactsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Contacts.name,
              image: require('~src/assets/images/icon-contacts-white.png'),
              theme,
              route,
            })
          }
        />
        <ContactsStack.Screen
          name={Facade.route.ContactDetails.name}
          component={ContactDetails}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Contacts.translate(),
              image: require('~src/assets/images/icon-contacts-white.png'),
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
