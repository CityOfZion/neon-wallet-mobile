import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { ContactList } from '~/src/components/contacts/ContactList'
import { NoContacts } from '~/src/components/contacts/NoContacts'
import ThemedAddButton from '~/src/components/themed/ThemedAddButton'
import { Contact } from '~/src/models/redux/Contact'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactsStackParamList } from '~src/navigation/ContactsStackNavigation'
interface Props {
  navigation: StackNavigationProp<ContactsStackParamList & RootStackParamList>
}

const ContactsPage: React.FC<Props> = props => {
  const contacts = useSelector(selectContacts)

  const handleContactSelected = (contact: Contact) => {
    props.navigation.navigate(wrapper.route.ContactDetails.name, {
      contact,
    })
  }

  const handleAddPress = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContact.name,
      params: {},
    })
  }

  return (
    <ScreenLayout rightButton={<ThemedAddButton onPress={handleAddPress} />} hideBackButton>
      {contacts.length ? <ContactList onSelect={handleContactSelected} /> : <NoContacts />}
    </ScreenLayout>
  )
}

export default ContactsPage
