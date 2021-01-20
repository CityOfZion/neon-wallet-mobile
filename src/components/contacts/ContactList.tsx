import {useNavigation} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  Alert,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {SearchBar} from '~src/components/input/SearchBar'
import {Contact} from '~src/models/redux/Contact'
import {RootState} from '~src/store/RootStore'
import {ButtonView, LinearLayout, TextView} from '~src/styles/styled-components'

interface ContactListProps {
  mt?: number | string
  mb?: number | string
  searchBar?: boolean
  onContactSelected?: (contact: Contact) => void
}

interface Item {
  data: Contact
  onContactSelected?: (contact: Contact) => void
}

interface IconItem {
  color?: string
  width?: number
  heigth?: number
  Component?: any //always wait a react native component
}

const SectionHeaderComponent = (info: {section: SectionListData<Item>}) => {
  return (
    <TextView
      pt={'9px'}
      pb={'9px'}
      pl={'14px'}
      font={'medium'}
      color={'primary'}
      fontSize={14}
      bg={'background.12'}
    >
      {info.section.key}
    </TextView>
  )
}

const IconItemComponent: React.FC<IconItem> = ({
  children,
  width,
  heigth,
  color,
  Component,
}) => {
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

const IconText: React.FC = ({children}) => {
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

const ItemComponent = (props: {item: Item}) => {
  const navigation = useNavigation()
  return (
    <ButtonView
      onPress={() => {
        if (props.item.onContactSelected) {
          props.item.onContactSelected(props.item.data)
        } else {
          navigation.navigate(Facade.route.ContactDetails.name, {
            contact: props.item.data,
          })
        }
      }}
    >
      <LinearLayout mt={'20px'} mb={'20px'} ml={'7px'} orientation="horiz">
        <LinearLayout mt={3} mr={1}>
          <IconItemComponent color="#394651" width={36} heigth={36}>
            <IconText>{props.item.data.name?.charAt(0).toUpperCase()}</IconText>
          </IconItemComponent>
        </LinearLayout>
        <LinearLayout mr={3}>
          <TextView font={'semi-bold'} color={'text.0'} fontSize={18}>
            {props.item.data.name}
          </TextView>
          <TextView font={'medium'} color={'primary'} fontSize={16}>
            {props.item.data.address}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
}

interface TSearchBarContact {
  data?: Contact[]
  dispatchData: React.Dispatch<React.SetStateAction<Contact[]>>
}

export const ContactList = (props: ContactListProps) => {
  const contactsMap: Map<string, Item[]> = new Map()
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const [contactsList, setContactsList] = useState<Contact[]>(contacts)

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

  contactsList.forEach((contact) => {
    if (contactsMap.has(contact.name?.[0] ?? '')) {
      // eslint-disable-next-line no-unused-expressions
      contactsMap
        .get(contact.name?.[0].toUpperCase() ?? '')
        ?.push({data: contact, onContactSelected: props.onContactSelected})
    } else {
      contactsMap.set(contact.name?.[0].toUpperCase() ?? '', [
        {data: contact, onContactSelected: props.onContactSelected},
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
    setContactsList(contacts)
  }, [contacts])
  return (
    <>
      {props.searchBar && (
        <SearchBar
          dispatchData={setContactsList}
          prevData={contacts}
          callbackFilter={(searchText) => {
            const filterContacts = contacts.filter((contact) => {
              if (contact.address && contact.name) {
                return (
                  contact.name.includes(searchText) ||
                  contact.address.includes(searchText)
                )
              }
            })
            setContactsList(filterContacts)
          }}
        />
      )}
      <SectionList
        style={{
          width: '100%',
          height: '100%',
          marginBottom: props.mb,
        }}
        sections={sections}
        renderItem={(info) => <ItemComponent item={info.item} />}
        renderSectionHeader={SectionHeaderComponent}
        ItemSeparatorComponent={() => {
          return (
            <LinearLayout
              height={'1px'}
              ml={'16px'}
              mr={'16px'}
              bg={'background.10'}
            />
          )
        }}
      />
    </>
  )
}

ContactList.propTypes = {
  onContactSelected: PropTypes.func,
}

IconText.propTypes = {
  children: PropTypes.string.isRequired,
}
