import i18n from 'i18n-js'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { Account } from '../models/redux/Account'
import { Contact } from '../models/redux/Contact'
import { RootState } from '../store/RootStore'
import { ButtonWithoutFeedbackView, LinearLayout, TextView } from '../styles/styled-components'
import { LinearLayoutProps } from '../types/styled-components'
import { AccountList } from './accounts/AccountList'
import { ContactList } from './contacts/ContactList'
import { NoContacts } from './contacts/NoContacts'

export type TabSelectorContactType = 'contacts' | 'accounts'

type Props = {
  onContactSelected?: (contact: Contact, address: string) => void
  onAccountSelected?: (account: Account) => void
  filterByBlockchain?: BlockchainServiceKey
} & LinearLayoutProps

type TabProps = {
  onPress: () => void
  isSelected: boolean
  label: string
}

const Tab = ({ onPress, isSelected, label }: TabProps) => {
  return (
    <ButtonWithoutFeedbackView onPress={onPress}>
      <LinearLayout orientation="verti" weight={1}>
        <TextView
          width="100%"
          fontFamily="bold"
          fontSize="16px"
          textAlign="center"
          color={isSelected ? 'text.0' : 'background.3'}
          my="16px"
        >
          {label}
        </TextView>
        <LinearLayout width="100%" height={isSelected ? '4px' : '2px'} bg={isSelected ? 'primary' : 'background.3'} />
      </LinearLayout>
    </ButtonWithoutFeedbackView>
  )
}

export const TabSelectorContact = ({ filterByBlockchain, onAccountSelected, onContactSelected, ...props }: Props) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const [selectedTab, setSelectedTab] = useState<TabSelectorContactType>('contacts')

  const handlePress = (tab: TabSelectorContactType) => {
    if (selectedTab === tab) return

    setSelectedTab(tab)
  }

  return (
    <LinearLayout {...props} flex={1}>
      <LinearLayout orientation="horiz" mx="16px">
        <Tab
          onPress={() => handlePress('contacts')}
          isSelected={selectedTab === 'contacts'}
          label={i18n.t('contactPicker.contacts').toUpperCase()}
        />

        <Tab
          onPress={() => handlePress('accounts')}
          isSelected={selectedTab === 'accounts'}
          label={i18n.t('contactPicker.myAccounts').toUpperCase()}
        />
      </LinearLayout>

      {selectedTab === 'contacts' ? (
        contacts.length ? (
          <ContactList mt={20} onSelect={onContactSelected} filterByBlockchain={filterByBlockchain} />
        ) : (
          <NoContacts />
        )
      ) : (
        <AccountList onSelect={onAccountSelected} filterByBlockchain={filterByBlockchain} />
      )}
    </LinearLayout>
  )
}
