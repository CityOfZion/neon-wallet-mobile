import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'
import { DefaultNavigationParam } from '../types/global'

import { wrapper } from '~src/app/ApplicationWrapper'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactDetails, ContactDetailsParams } from '~src/scenes/Contacts/ContactsDetails'
import ContactsPage from '~src/scenes/Contacts/ContactsPage'

export type ContactsStackParamList = {
  Contacts: undefined
  ContactDetails: ContactDetailsParams
}

interface ContactsStackProps {
  navigation: StackNavigationProp<RootStackParamList>
}

export type ContactsStackParams = DefaultNavigationParam<ContactDetailsParams>

const ContactsStack = createStackNavigator<ContactsStackParamList>()

const ContactsStackNavigation = (props: ContactsStackProps) => {
  return (
    <ContactsStack.Navigator initialRouteName={wrapper.route.Contacts.name} screenOptions={stackConfig}>
      <ContactsStack.Screen name={wrapper.route.Contacts.name} component={ContactsPage} />
      <ContactsStack.Screen name={wrapper.route.ContactDetails.name} component={ContactDetails} />
    </ContactsStack.Navigator>
  )
}

export default ContactsStackNavigation
