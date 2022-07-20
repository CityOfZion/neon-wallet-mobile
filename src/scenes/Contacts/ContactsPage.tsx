import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { ContactList } from '~/src/components/contacts/ContactList'
import { NoContacts } from '~/src/components/contacts/NoContacts'
import { Contact } from '~/src/models/redux/Contact'
import { RootState } from '~/src/store/RootStore'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactsStackParamList } from '~src/navigation/ContactsStackNavigation'
interface Props {
  navigation: StackNavigationProp<ContactsStackParamList & RootStackParamList>
}

const ContactsPage: React.FC<Props> = props => {
  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'add',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
            params: {},
          })
        },
      }),
  })

  const contacts = useSelector((state: RootState) => state.app.contacts)

  const handleContactSelected = (contact: Contact) => {
    props.navigation.navigate(wrapper.route.ContactDetails.name, {
      contact,
    })
  }

  return (
    <ScreenLayout padding={0} darkerSolidColorBG>
      {contacts.length ? <ContactList onSelect={handleContactSelected} /> : <NoContacts />}
    </ScreenLayout>
  )
}

export default ContactsPage
