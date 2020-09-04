import {useNavigation} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React from 'react'
import {
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
  onContactSelected?: (contact: Contact) => void
}

interface Item {
  data: Contact
  onContactSelected?: (contact: Contact) => void
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

const ItemComponent = (info: SectionListRenderItemInfo<Item>) => {
  const navigation = useNavigation()

  return (
    <ButtonView
      onPress={() => {
        if (info.item.onContactSelected) {
          info.item.onContactSelected(info.item.data)
        } else {
          navigation.navigate(Facade.route.ContactDetails.name, {
            contact: info.item,
          })
        }
      }}
    >
      <LinearLayout pl={'14px'} mt={'21px'} mb={'21px'}>
        <TextView font={'semi-bold'} color={'text.0'} fontSize={20}>
          {info.item.data.name}
        </TextView>
        <TextView font={'medium'} color={'primary'} fontSize={16}>
          {info.item.data.address}
        </TextView>
      </LinearLayout>
    </ButtonView>
  )
}

export const ContactList = (props: ContactListProps) => {
  const contactsMap: Map<string, Item[]> = new Map()
  const contacts = useSelector((state: RootState) => state.app.contacts)

  contacts.forEach((contact) => {
    if (contactsMap.has(contact.name?.[0] ?? '')) {
      // eslint-disable-next-line no-unused-expressions
      contactsMap
        .get(contact.name?.[0] ?? '')
        ?.push({data: contact, onContactSelected: props.onContactSelected})
    } else {
      contactsMap.set(contact.name?.[0] ?? '', [{data: contact, onContactSelected: props.onContactSelected}])
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
    <SectionList
      style={{
        width: '100%',
        height: '100%',
        marginTop: props.mt,
        marginBottom: props.mb,
      }}
      sections={sections}
      renderItem={ItemComponent}
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
  )
}

ContactList.propTypes = {
  onContactSelected: PropTypes.func,
}
