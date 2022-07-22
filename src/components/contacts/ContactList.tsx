import i18n from 'i18n-js'
import React, { useState, useMemo } from 'react'
import { FlatList, SectionList, SectionListData } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey, getBlockchainByAddress, getBlockchainLogo } from '~/src/blockchain'
import { LinearLayoutProps } from '~/src/types/styled-components'
import { SearchBar } from '~src/components/SearchBar'
import { Contact } from '~src/models/redux/Contact'
import { RootState } from '~src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface ContactListProps extends LinearLayoutProps {
  onSelect?: (contact: Contact, address: string) => void
  filterByBlockchain?: BlockchainServiceKey
}

interface ItemProps {
  contact: Contact
  onPress?: (contact: Contact, address: string) => void
}

interface AddressProps {
  address: string
  blockchain: BlockchainServiceKey
  onPress?: (contact: Contact, address: string) => void
  contact: Contact
}

interface SectionHeaderProps {
  label?: string
}

const AddressItem = React.memo(({ address, blockchain, onPress, contact }: AddressProps) => {
  const handlePress = () => {
    if (onPress) onPress(contact, address)
  }

  return (
    <ButtonView onPress={handlePress} paddingY="18px">
      <LinearLayout orientation="horiz" alignItems="center">
        <ImageView
          source={getBlockchainLogo(blockchain)}
          resizeMode="contain"
          alignSelf="center"
          mr={3}
          style={{
            width: 18,
            height: 18,
          }}
        />

        <LinearLayout orientation="verti" flex={1}>
          <TextView color="text.2" fontFamily="regular" fontSize="14px">
            {i18n.t(`blockchainServices.${blockchain}.id`)}
          </TextView>
          <TextView color="primary" fontFamily="medium" fontSize="14px" numberOfLines={1} ellipsizeMode="middle">
            {address}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
})

const Item = React.memo(({ contact, onPress }: ItemProps) => {
  return (
    <LinearLayout py="16px" px="12px">
      <LinearLayout orientation="horiz" alignItems="center">
        <LinearLayout
          backgroundColor="background.22"
          width="36px"
          height="36px"
          borderRadius="18px"
          marginRight="6px"
          alignItems="center"
          justifyContent="center"
        >
          {contact.name && (
            <TextView
              color="text.6"
              fontFamily="semibold"
              fontSize="18px"
              fontWeight={600}
              style={{
                includeFontPadding: false,
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </TextView>
          )}
        </LinearLayout>

        {contact.name && (
          <TextView
            fontWeight={600}
            color="text.0"
            fontSize="18px"
            style={{
              includeFontPadding: false,
            }}
          >
            {contact.name}
          </TextView>
        )}
      </LinearLayout>
      <LinearLayout flex={1} marginLeft="48px">
        <FlatList
          data={contact.addresses}
          renderItem={({ item }) => (
            <AddressItem address={item.address} blockchain={item.blockchain} onPress={onPress} contact={contact} />
          )}
          ItemSeparatorComponent={() => <LinearLayout height="1px" bg="background.10" />}
          keyExtractor={(item, index) => `${contact.id}-${item.address}-${index}`}
        />
      </LinearLayout>
    </LinearLayout>
  )
})

const SectionHeader = React.memo(({ label }: SectionHeaderProps) => {
  return (
    <TextView pt="6px" pb="6px" pl="14px" fontWeight={500} color="primary" fontSize="18px" bg="background.12">
      {label?.toUpperCase()}
    </TextView>
  )
})

export const ContactList = ({ filterByBlockchain, onSelect, ...props }: ContactListProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)

  const [filter, setFilter] = useState('')

  const filteredByBlockchain = useMemo(() => {
    if (!filterByBlockchain) return contacts

    return contacts
      .map(contact => {
        const newContact = new Contact()

        Object.assign(newContact, contact)

        newContact.addresses = contact.addresses.filter(({ address }) => {
          const blockchain = getBlockchainByAddress(address)

          return blockchain === filterByBlockchain
        })

        return newContact
      })
      .filter(contact => contact.addresses.length > 0)
  }, [contacts])

  const filteredContacts = useMemo(() => {
    if (!filter) return filteredByBlockchain

    return filteredByBlockchain.filter(
      contact =>
        contact.name?.toLowerCase().includes(filter.toLowerCase()) ||
        contact.addresses.find(infoContact => infoContact.address.toLowerCase().includes(filter.toLowerCase()))
    )
  }, [filter, filteredByBlockchain])

  const sortedContact = useMemo(
    () =>
      filteredContacts.sort((prev, actual) => {
        if (!prev.name || !actual.name) return 1

        if (prev.name.toLowerCase() < actual.name.toLowerCase()) return -1

        return 0
      }),
    [filteredContacts]
  )

  const sectionsByFirstLetter = useMemo(() => {
    const contactsMap: Map<string, Contact[]> = new Map()

    sortedContact.forEach(contact => {
      if (!contact.name) return

      const firstLetterKey = contact.name[0].toUpperCase()

      const gettedValues = contactsMap.get(firstLetterKey)

      if (gettedValues) {
        gettedValues.push(contact)
        return
      }

      contactsMap.set(firstLetterKey, [contact])
    })

    return Array.from(contactsMap.entries()).map(
      ([key, contacts]): SectionListData<Contact> => ({ data: contacts, key })
    )
  }, [sortedContact])

  return (
    <LinearLayout {...props}>
      <SearchBar onFilter={setFilter} />
      <SectionList
        sections={sectionsByFirstLetter}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <Item contact={item} onPress={onSelect} />}
        renderSectionHeader={({ section: { key } }) => <SectionHeader label={key} />}
        ItemSeparatorComponent={() => <LinearLayout height="1px" mx="6px" bg="background.10" />}
        ListEmptyComponent={
          <TextView fontWeight={600} color="text.0" fontSize="18px" pt="4px" textAlign="center">
            {i18n.t('persistContact.noResultsFound')}
          </TextView>
        }
      />
    </LinearLayout>
  )
}
