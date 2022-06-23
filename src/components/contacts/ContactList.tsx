import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, SectionList, SectionListData, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { BlockchainServiceKey, getBlockchainByAddress, getBlockchainLogo } from '~/src/blockchain'
import { ContactsStackParamList } from '~/src/navigation/ContactsStackNavigation'
import { SearchBar } from '~src/components/input/SearchBar'
import { Contact } from '~src/models/redux/Contact'
import { RootState } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface ContactListProps {
  mt?: number | string
  mb?: number | string
  searchBar?: boolean
  onContactSelected?: (contact: Contact, addressSelected?: string) => void
  filterByBlockchain?: BlockchainServiceKey
}

interface Item {
  data: Contact
  onContactSelected?: (contact: Contact, addressSelected?: string) => void
}

interface IconItem {
  color?: string
  width?: number
  heigth?: number
  Component?: any //always wait a react native component
}

const SectionHeaderComponent = (info: { section: SectionListData<Item> }) => {
  return (
    <TextView pt="6px" pb="6px" pl="14px" font="medium" color="primary" fontSize={14} bg="background.12">
      {info.section.key}
    </TextView>
  )
}

const IconItemComponent: React.FC<IconItem> = ({ children, width, heigth, color, Component }) => {
  const styles = StyleSheet.create({
    container: {
      width: width ?? 36,
      height: heigth ?? 36,
      backgroundColor: color ?? '#394651',
      borderRadius: 50,
      marginHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
  if (Component) {
    return <Component style={styles.container}>{children}</Component>
  } else {
    return <View style={styles.container}>{children}</View>
  }
}

const IconText: React.FC = ({ children }) => {
  const styles = StyleSheet.create({
    design: {
      marginBottom: 3,
      color: '#899fa8',
      fontFamily: 'semibold',
      fontSize: 18,
      fontWeight: '600',
    },
  })
  return <Text style={styles.design}>{children}</Text>
}

interface IAddressItem {
  address: string
  onContactSelected?: (contact: Contact, addressSelected?: string) => void
  contact: Contact
}
const AddressItem: React.FC<IAddressItem> = ({ address, onContactSelected, contact }) => {
  const blockchainName = getBlockchainByAddress(address)
  const navigation = useNavigation<StackNavigationProp<ContactsStackParamList>>()
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const styles = StyleSheet.create({
    text: {
      color: theme.colors.primary,
      fontFamily: 'medium',
      fontSize: 15,
    },
    nameBlockchain: {
      color: theme.colors.text[2],
      fontFamily: 'regular',
      fontSize: 14,
    },
    container: {
      borderBottomWidth: 1,
      borderColor: '#ffffff55',
      paddingVertical: 17,
    },
  })
  return (
    <TouchableOpacity
      onPress={() => {
        if (onContactSelected) {
          onContactSelected(contact, address)
        } else {
          navigation.navigate(wrapper.route.ContactDetails.name, {
            contact,
          })
        }
      }}
      style={styles.container}
    >
      <LinearLayout orientation="horiz">
        {blockchainName && (
          <ImageView
            width={Normalize.scale(17)}
            height={Normalize.scale(18)}
            source={getBlockchainLogo(blockchainName)}
            resizeMode="contain"
            alignSelf="center"
            mt={3}
            mr={3}
          />
        )}
        <LinearLayout orientation="verti" width="92%">
          <Text style={styles.nameBlockchain}>{i18n.t(`blockchainServices.${blockchainName}.id`)}</Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
            {address}
          </Text>
        </LinearLayout>
      </LinearLayout>
    </TouchableOpacity>
  )
}

const ItemComponent = (props: { item: Item }) => {
  return (
    <LinearLayout>
      <LinearLayout mt="18px" mb="18px" ml="6px" orientation="horiz">
        <LinearLayout mt={-2} mr={1}>
          <IconItemComponent color="#394651" width={36} heigth={36}>
            <IconText>{props.item.data.name?.charAt(0).toUpperCase()}</IconText>
          </IconItemComponent>
        </LinearLayout>
        <LinearLayout mr={3} width="85%">
          <TextView font="semi-bold" color="text.0" fontSize={18}>
            {props.item.data.name}
          </TextView>
          <View>
            {props.item.data.addresses.map(({ address }, index) => (
              <AddressItem
                key={index}
                address={address}
                onContactSelected={props.item.onContactSelected}
                contact={props.item.data}
              />
            ))}
          </View>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

export const ContactList = (props: ContactListProps) => {
  const contactsMap: Map<string, Item[]> = new Map()
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const { filterByBlockchain } = props
  const [contactsList, setContactsList] = useState<Contact[]>(
    contacts.map<Contact>(contact => {
      const { addresses } = contact
      const newContact = new Contact()
      newContact.address = contact.address
      newContact.id = contact.id
      newContact.name = contact.name
      const filteredAddresses = addresses.filter(it => it.blockchain === filterByBlockchain)
      newContact.addresses = filteredAddresses
      return newContact
    })
  )
  const [emptySearchList, setEmptySearchList] = useState<boolean>(false)

  contactsList.sort((item: Contact, item2: Contact) => {
    if (item.name !== null && item2.name !== null) {
      if (item.name.toLowerCase() < item2.name.toLowerCase()) {
        return -1
      } else {
        return 0
      }
    } else {
      return 1
    }
  })

  contactsList.forEach(contact => {
    if (contactsMap.has(contact.name?.[0] ?? '')) {
      // eslint-disable-next-line no-unused-expressions
      contactsMap
        .get(contact.name?.[0].toUpperCase() ?? '')
        ?.push({ data: contact, onContactSelected: props.onContactSelected })
    } else {
      contactsMap.set(contact.name?.[0].toUpperCase() ?? '', [
        { data: contact, onContactSelected: props.onContactSelected },
      ])
    }
  })

  const sections: SectionListData<Item>[] = []

  contactsMap.forEach((c, k) => {
    const section: SectionListData<Item> = {
      key: k,
      data: c,
    }

    sections.push(section)
  })

  useEffect(() => {
    if (!filterByBlockchain) {
      setContactsList(contacts)
    }
    return () => {
      setContactsList(contacts)
    }
  }, [contacts])
  return (
    <>
      {props.searchBar && (
        <SearchBar
          dispatchData={setContactsList}
          emptySearchList={setEmptySearchList}
          prevData={contacts}
          callbackFilter={searchText => {
            const filterContacts = contacts.filter(contact => {
              if (contact.addresses.length > 0 && contact.name) {
                return (
                  contact.name.includes(searchText) ||
                  contact.addresses.find(infoContact => infoContact.address === searchText)
                )
              }
            })
            if (filterContacts.length > 0) {
              setEmptySearchList(false)
              setContactsList(filterContacts)
            } else {
              setEmptySearchList(true)
            }
          }}
        />
      )}
      {emptySearchList ? (
        <TextView font="semi-bold" color="text.0" fontSize={18} pt={5} textAlign="center">
          {i18n.t('persistContact.noResultsFound')}
        </TextView>
      ) : (
        <SectionList
          style={{
            width: '100%',
            height: '100%',
            marginBottom: props.mb,
          }}
          sections={sections}
          renderItem={info => <ItemComponent item={info.item} />}
          renderSectionHeader={SectionHeaderComponent}
          ItemSeparatorComponent={() => {
            return <LinearLayout height="1px" ml="16px" mr="16px" bg="background.10" />
          }}
        />
      )}
    </>
  )
}

ContactList.propTypes = {
  onContactSelected: PropTypes.func,
}

IconText.propTypes = {
  children: PropTypes.string.isRequired,
}

AddressItem.propTypes = {
  onContactSelected: PropTypes.func,
  address: PropTypes.any,
  contact: PropTypes.any,
}
