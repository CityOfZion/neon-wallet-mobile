import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {ContactList} from '~src/components/contacts/ContactList'
import {NoContacts} from '~src/components/contacts/NoContacts'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {RootState} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ContactsStackParamList & RootStackParamList>
}

const ContactsPage: React.FC<Props> = (prop) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)

  prop.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'add',
        actionOnPress: () => {
          prop.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.PersistContact.name,
          })
        },
      }),
  })

  return (
    <ScreenLayout padding={0}>
      {!contacts || contacts.length === 0 ? <NoContacts /> : <ContactList />}
    </ScreenLayout>
  )
}

ContactsPage.propTypes = {
  navigation: PropTypes.any,
}

export default ContactsPage
