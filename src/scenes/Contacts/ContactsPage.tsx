import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {AccountList} from '~/src/components/accounts/AccountList'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import {Facade} from '~src/app/Facade'
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

  return (
    <LinearLayout orientation="horiz" mx="16px">
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
            my="16px"
          >
            {Facade.t('contactPicker.contacts').toUpperCase()}
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
            my="16px"
          >
            {Facade.t('contactPicker.myAccounts').toUpperCase()}
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
          prop.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.PersistContact.name,
          })
        },
      }),
  })

  return (
    <ScreenLayout padding={0} solidColorBG={true}>
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
