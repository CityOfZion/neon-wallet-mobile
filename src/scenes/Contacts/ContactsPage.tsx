import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {Platform, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {AccountList} from '~/src/components/accounts/AccountList'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
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

type Tab = 'contacts' | 'accounts'

const TabSelector = (props: {selected: Tab; onSelect: (t: Tab) => void}) => {
  const contactsSelected = props.selected === 'contacts'
  const {isConnected} = useSelector((state: RootState) => state.network)
  return (
    <LinearLayout
      orientation="horiz"
      mx="16px"
      marginTop={!isConnected ? 30 : undefined}
    >
      <TouchableWithoutFeedback
        onPress={() => !contactsSelected && props.onSelect('contacts')}
      >
        <LinearLayout orientation="verti" weight="1">
          <TextView
            width="100%"
            fontFamily="bold"
            fontSize="16px"
            textAlign="center"
            color={contactsSelected ? 'text.0' : 'background.3'}
            my={Platform.OS === 'ios' ? '20px' : '4px'}
          >
            {i18n.t('contactPicker.contacts').toUpperCase()}
          </TextView>
          <LinearLayout
            width="100%"
            height={contactsSelected ? '4px' : '2px'}
            bg={contactsSelected ? 'primary' : 'background.3'}
          />
        </LinearLayout>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => contactsSelected && props.onSelect('accounts')}
      >
        <LinearLayout orientation="verti" weight="1">
          <TextView
            width="100%"
            fontFamily="bold"
            fontSize="16px"
            textAlign="center"
            color={!contactsSelected ? 'text.0' : 'background.3'}
            my={Platform.OS === 'ios' ? '20px' : '4px'}
          >
            {i18n.t('contactPicker.myAccounts').toUpperCase()}
          </TextView>
          <LinearLayout
            width="100%"
            height={!contactsSelected ? '4px' : '2px'}
            bg={!contactsSelected ? 'primary' : 'background.3'}
          />
        </LinearLayout>
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}

const ContactsPage: React.FC<Props> = (prop) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)

  const [tab, setTab] = useState<Tab>('contacts')

  prop.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'add',
        actionOnPress: () => {
          prop.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
          })
        },
      }),
  })

  return (
    <ScreenLayout padding={0} darkerSolidColorBG={true}>
      <TabSelector selected={tab} onSelect={(t) => setTab(t)} />
      {tab === 'contacts' ? (
        !contacts || contacts.length === 0 ? (
          <NoContacts />
        ) : (
          <ContactList mt={40} searchBar={true} />
        )
      ) : (
        <AccountList mb={PANEL_OFFSET} searchBar={true} />
      )}
    </ScreenLayout>
  )
}

ContactsPage.propTypes = {
  navigation: PropTypes.any,
}

export default ContactsPage
