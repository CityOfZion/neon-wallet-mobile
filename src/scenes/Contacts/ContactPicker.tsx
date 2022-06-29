import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { Fragment, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '~/src/blockchain'
import { RootState } from '~/src/store/RootStore'
import SwiperPanel, { PANEL_OFFSET, useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { AccountList } from '~src/components/accounts/AccountList'
import { ContactList } from '~src/components/contacts/ContactList'
import { NoContacts } from '~src/components/contacts/NoContacts'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
export interface ContactsModalParams {
  onSelected: (item: Contact | Account, addressSelected?: string) => void
  filterByBlockchain?: BlockchainServiceKey
}

interface ContactsModalProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ContactsModal'>
}

type Tab = 'contacts' | 'accounts'

const TabSelector = (props: { selected: Tab; onSelect: (t: Tab) => void }) => {
  const contactsSelected = props.selected === 'contacts'

  return (
    <LinearLayout orientation="horiz" mx="16px">
      <TouchableWithoutFeedback onPress={() => !contactsSelected && props.onSelect('contacts')}>
        <LinearLayout orientation="verti" weight="1">
          <TextView
            width="100%"
            fontFamily="bold"
            fontSize="16px"
            textAlign="center"
            color={contactsSelected ? 'text.0' : 'background.3'}
            my="16px"
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
      <TouchableWithoutFeedback onPress={() => contactsSelected && props.onSelect('accounts')}>
        <LinearLayout orientation="verti" weight="1">
          <TextView
            width="100%"
            fontFamily="bold"
            fontSize="16px"
            textAlign="center"
            color={!contactsSelected ? 'text.0' : 'background.3'}
            my="16px"
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

export const ContactPicker = (props: ContactsModalProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const controller = useSwiperController(true)

  const [tab, setTab] = useState<Tab>('contacts')

  return (
    <SwiperPanel
      title={i18n.t('contactPicker.title')}
      controller={controller}
      onClose={props.navigation.goBack}
      padding={0}
      paddingTop={40}
      fullSize
      disableDefaultScrollView
      onRightPress={controller.close}
      rightButton={<CloseButton mr="20px" />}
    >
      <>
        <TextView color="text.0" alignSelf="center" fontFamily="medium" fontSize={18}>
          {i18n.t('contactPicker.selectContact')}
        </TextView>
        <TabSelector selected={tab} onSelect={t => setTab(t)} />
        {tab === 'contacts' ? (
          contacts.length ? (
            <ContactList
              mt={20}
              mb={PANEL_OFFSET}
              onContactSelected={(it, address) => props.route.params.onSelected(it, address)}
              searchBar
              filterByBlockchain={props.route.params.filterByBlockchain}
            />
          ) : (
            <NoContacts />
          )
        ) : (
          <AccountList
            mb={PANEL_OFFSET}
            onAccountSelected={it => props.route.params.onSelected(it)}
            searchBar
            filterByBlockchain={props.route.params.filterByBlockchain}
          />
        )}
      </>
    </SwiperPanel>
  )
}
