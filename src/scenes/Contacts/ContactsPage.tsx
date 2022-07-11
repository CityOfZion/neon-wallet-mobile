import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { TabSelectorContact } from '~/src/components/TabSelectorContacts'
import { Contact } from '~/src/models/redux/Contact'
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

  const handleContactSelected = (contact: Contact) => {
    props.navigation.navigate(wrapper.route.ContactDetails.name, {
      contact,
    })
  }

  return (
    <ScreenLayout padding={0} darkerSolidColorBG>
      <TabSelectorContact onContactSelected={handleContactSelected} />
    </ScreenLayout>
  )
}

export default ContactsPage
