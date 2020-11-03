import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {Fragment, useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  PANEL_OFFSET,
  useSwiperController,
  CloseButton,
} from '~src/components/SwiperPanel'
import {AccountList} from '~src/components/accounts/AccountList'
import {ContactList} from '~src/components/contacts/ContactList'
import {NoContacts} from '~src/components/contacts/NoContacts'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface ContactsModalParams {
  onSelected: (item: Contact | Account) => void
}

interface ContactsModalProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ContactsModal'>
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
            color={contactsSelected ? 'primary' : 'background.3'}
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
            color={!contactsSelected ? 'primary' : 'background.3'}
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

export const ContactPicker = (props: ContactsModalProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const controller = useSwiperController(true)

  const [tab, setTab] = useState<Tab>('contacts')

  return (
    <SwiperPanel
      title={Facade.t('contactPicker.title')}
      controller={controller}
      onClose={props.navigation.goBack}
      padding={0}
      paddingTop={40}
      fullSize={true}
      disableDefaultScrollView={true}
      onRightPress={controller.close}
      rightButton={<CloseButton mr="20px" />}
    >
      <Fragment>
        <TextView
          color={'text.0'}
          alignSelf={'center'}
          fontFamily={'medium'}
          fontSize={18}
        >
          {Facade.t('contactPicker.selectContact')}
        </TextView>
        <TabSelector selected={tab} onSelect={(t) => setTab(t)} />
        {tab === 'contacts' ? (
          contacts.length ? (
            <ContactList
              mt={20}
              mb={PANEL_OFFSET}
              onContactSelected={(it) => props.route.params.onSelected(it)}
              searchBar={true}
            />
          ) : (
            <NoContacts />
          )
        ) : (
          <AccountList
            mb={PANEL_OFFSET}
            onAccountSelected={(it) => props.route.params.onSelected(it)}
            searchBar={true}
          />
        )}
      </Fragment>
    </SwiperPanel>
  )
}
