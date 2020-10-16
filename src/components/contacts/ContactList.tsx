import {useNavigation} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
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
      <LinearLayout mt={'21px'} mb={'21px'} orientation="horiz">
        <IconItemComponent color="#394651" width={42} heigth={42}>
          <IconText>{props.item.data.name?.charAt(0).toUpperCase()}</IconText>
        </IconItemComponent>
        <LinearLayout>
          <TextView font={'semi-bold'} color={'text.0'} fontSize={20}>
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

const SearchBarContact: React.FC<TSearchBarContact> = ({dispatchData}) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const handleFilterContact = (strContact: string) => {
    if (strContact === '') {
      dispatchData(contacts)
    } else {
      const filterContacts = contacts.filter((contact) => {
        if (contact.address && contact.name) {
          return (
            contact.name.startsWith(strContact) ||
            contact.address.startsWith(strContact)
          )
        }
      })
      dispatchData(filterContacts)
    }
  }
  const styles = StyleSheet.create({
    design: {
      borderRadius: 21,
      height: 42,
      borderColor: '#f00',
      backgroundColor: '#191f23',
      marginHorizontal: 5,
      marginVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    input: {
      flex: 1,
      color: '#899fa8',
      fontFamily: 'light',
      fontWeight: '300',
      textAlignVertical: 'center',
      fontSize: 15,
    },
    icon: {
      marginRight: 5,
    },
  })
  return (
    <View style={styles.design}>
      <Image
        source={require('~/src/assets/images/icon-search-gray.png')}
        style={styles.icon}
      />
      <TextInput
        onChange={(e) => handleFilterContact(e.nativeEvent.text)}
        style={styles.input}
        placeholder={Facade.t('persistContact.search')}
      />
    </View>
  )
}

export const ContactList = (props: ContactListProps) => {
  const contactsMap: Map<string, Item[]> = new Map()
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const [contactsList, setContactsList] = useState<Contact[]>(contacts)

  contactsList.forEach((contact) => {
    if (contactsMap.has(contact.name?.[0] ?? '')) {
      // eslint-disable-next-line no-unused-expressions
      contactsMap
        .get(contact.name?.[0] ?? '')
        ?.push({data: contact, onContactSelected: props.onContactSelected})
    } else {
      contactsMap.set(contact.name?.[0] ?? '', [
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

  return (
    <>
      {props.searchBar && (
        <SearchBarContact data={contactsList} dispatchData={setContactsList} />
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

SearchBarContact.propTypes = {
  dispatchData: PropTypes.any.isRequired,
}
