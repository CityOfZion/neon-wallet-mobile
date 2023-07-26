import i18n from 'i18n-js'
import { cloneDeep } from 'lodash'
import React, { useState, useMemo } from 'react'
import { FlatList, SectionList, SectionListData } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '~/src/blockchain'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import ListSeparator from '~/src/scenes/walletConnect/components/ListSeparator'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import { ContactAddresses } from '~/src/types/reducers/contact'
import { LinearLayoutProps } from '~/src/types/styled-components'
import { SearchBar } from '~src/components/SearchBar'
import { Contact } from '~src/models/redux/Contact'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface ContactListProps extends LinearLayoutProps {
  onSelect?: (contact: Contact, address?: ContactAddresses) => void
  filterByBlockchain?: BlockchainServiceKey
  emptyComponent?: JSX.Element
  emptyHideHeader?: boolean
  pressType?: 'all' | 'address'
}

interface ItemProps {
  contact: Contact
  onPress?: (contact: Contact, address?: ContactAddresses) => void
  pressType: 'all' | 'address'
}

interface AddressProps {
  address: ContactAddresses
  onPress?: (contact: Contact, address?: ContactAddresses) => void
  contact: Contact
  pressType: 'all' | 'address'
}

interface SectionHeaderProps {
  label: string
}

const AddressItem = React.memo(({ address, onPress, contact, pressType }: AddressProps) => {
  const handlePress = async () => {
    if (onPress && pressType === 'address') onPress(contact, address)
  }

  return (
    <ButtonView
      onPress={handlePress}
      disabled={pressType !== 'address'}
      paddingY="18px"
      orientation="horiz"
      alignItems="center"
    >
      <ImageView
        source={BlockchainHelper.getIcon(address.blockchain)}
        resizeMode="contain"
        mr="14px"
        width={20}
        height={20}
      />

      <LinearLayout flex={1}>
        <TextView color="text.10" fontSize="14px">
          {i18n.t(`blockchainServices.${address.blockchain}.id`)}
        </TextView>

        <TextView color="primary" fontSize="16px" numberOfLines={1} ellipsizeMode="middle">
          {address.address}
        </TextView>
      </LinearLayout>
    </ButtonView>
  )
})

const Item = React.memo(({ contact, onPress, pressType }: ItemProps) => {
  const handlePress = () => {
    if (onPress && pressType === 'all') onPress(contact)
  }

  return (
    <ButtonView onPress={handlePress} disabled={pressType !== 'all'} py="20px" px="16px">
      <LinearLayout orientation="horiz" alignItems="center">
        <LinearLayout
          backgroundColor="background.22"
          width="36px"
          height="36px"
          borderRadius="18px"
          marginRight="12px"
          alignItems="center"
          justifyContent="center"
        >
          <TextView
            color="text.6"
            fontSize="18px"
            style={{
              includeFontPadding: false,
            }}
          >
            {contact?.name?.charAt(0).toUpperCase()}
          </TextView>
        </LinearLayout>

        <TextView color="text.0" fontSize="18px">
          {contact?.name}
        </TextView>
      </LinearLayout>

      <LinearLayout marginLeft="48px">
        <FlatList
          data={contact.addresses}
          renderItem={({ item }) => (
            <AddressItem address={item} onPress={onPress} contact={contact} pressType={pressType} />
          )}
          ItemSeparatorComponent={() => <LinearLayout height="1px" bg="background.10" />}
          keyExtractor={(item, index) => `${contact.id}-${item.address}-${index}`}
        />
      </LinearLayout>
    </ButtonView>
  )
})

const SectionHeader = React.memo(({ label }: SectionHeaderProps) => {
  return (
    <TextView py="6px" pl="16px" fontWeight={500} color="primary" fontSize="14px" bg="background.12">
      {label.toUpperCase()}
    </TextView>
  )
})

export const ContactList = ({
  filterByBlockchain,
  onSelect,
  emptyComponent,
  emptyHideHeader,
  pressType = 'address',
  ...props
}: ContactListProps) => {
  const contacts = useSelector(selectContacts)
  const { getBlockchainByAddress } = useBlockchainServiceUtils()

  const [filter, setFilter] = useState('')

  const filteredByBlockchain = useMemo<Contact[]>(() => {
    const contactsCopy = cloneDeep(contacts)

    if (!filterByBlockchain) return contactsCopy

    return contactsCopy
      .filter(contact => contact.addresses.length > 0)
      .map(contact => {
        contact.addresses = contact.addresses.filter(({ blockchain }) => {
          return blockchain === filterByBlockchain
        })

        return contact
      })
  }, [contacts, getBlockchainByAddress, filterByBlockchain])

  const data = useMemo<SectionListData<Contact>[]>(() => {
    let items = filteredByBlockchain

    // Filter the contacts by the filter value
    if (filter) {
      const filterLowercase = filter.toLowerCase()
      items = items.filter(
        contact =>
          contact.name?.toLowerCase().includes(filterLowercase) ||
          contact.addresses.find(({ address }) => address.toLowerCase().includes(filterLowercase))
      )
    }

    // Sort the contacts by name
    items.sort((prev, actual) => {
      if (!prev.name || !actual.name) return 1
      if (prev.name.toLowerCase() < actual.name.toLowerCase()) return -1
      if (prev.name.toLowerCase() > actual.name.toLowerCase()) return 1
      return 0
    })

    // Group the contacts by first letter
    const contactsByFirstLetter = new Map<string, Contact[]>()
    items.forEach(contact => {
      if (!contact.name) return

      const key = contact.name[0].toUpperCase()

      const lastContacts = contactsByFirstLetter.get(key) ?? []
      contactsByFirstLetter.set(key, [...lastContacts, contact])
    })

    // Create the sections array
    return Array.from(contactsByFirstLetter.entries()).map(
      ([key, contacts]): SectionListData<Contact> => ({ data: contacts, key })
    )
  }, [filter, filteredByBlockchain])

  return (
    <LinearLayout {...props}>
      {(!emptyHideHeader || (emptyHideHeader && contacts.length > 0)) && (
        <LinearLayout paddingX="20px">
          <SearchBar onFilter={setFilter} hasClearButton />
        </LinearLayout>
      )}
      <SectionList
        contentContainerStyle={{ flexGrow: 1 }}
        sections={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <Item contact={item} onPress={onSelect} pressType={pressType} />}
        renderSectionHeader={({ section }) => <SectionHeader label={section.key ?? ''} />}
        ItemSeparatorComponent={() => <ListSeparator marginX="16px" />}
        ListEmptyComponent={
          contacts.length === 0 ? (
            emptyComponent
          ) : (
            <TextView fontWeight={600} color="text.0" fontSize="18px" pt="4px" textAlign="center">
              {i18n.t('persistContact.noResultsFound')}
            </TextView>
          )
        }
      />
    </LinearLayout>
  )
}
