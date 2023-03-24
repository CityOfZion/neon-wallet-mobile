import i18n from 'i18n-js'
import React, { useState } from 'react'

import { BlockchainServiceKey } from '../blockchain'
import { Account } from '../models/redux/Account'
import { Contact } from '../models/redux/Contact'
import { LinearLayout } from '../styles/styled-components'
import { LinearLayoutProps } from '../types/styled-components'
import { TabSelector } from './TabSelector'
import { AccountList } from './accounts/AccountList'
import { ContactList } from './contacts/ContactList'

export type TabSelectorContactType = 'contacts' | 'accounts'

type Props = {
  onContactSelected?: (contact: Contact, address: string) => void
  onAccountSelected?: (account: Account) => void
  filterByBlockchain?: BlockchainServiceKey
} & LinearLayoutProps

export const TabSelectorContact = ({ filterByBlockchain, onAccountSelected, onContactSelected, ...props }: Props) => {
  const [selectedTab, setSelectedTab] = useState<TabSelectorContactType>('contacts')

  return (
    <LinearLayout {...props} flexGrow={1} flexShrink={1}>
      <LinearLayout my="16px">
        <TabSelector
          selected={selectedTab}
          onPress={setSelectedTab}
          tabs={[
            { id: 'contacts', label: i18n.t('contactPicker.contacts').toUpperCase() },
            { id: 'accounts', label: i18n.t('contactPicker.myAccounts').toUpperCase() },
          ]}
        />
      </LinearLayout>

      {selectedTab === 'contacts' ? (
        <ContactList onSelect={onContactSelected} filterByBlockchain={filterByBlockchain} flexGrow={1} flexShrink={1} />
      ) : (
        <AccountList onSelect={onAccountSelected} filterByBlockchain={filterByBlockchain} flexGrow={1} flexShrink={1} />
      )}
    </LinearLayout>
  )
}
