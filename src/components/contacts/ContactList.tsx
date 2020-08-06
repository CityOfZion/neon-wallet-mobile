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
  onContactSelected?: (contact: Contact) => void
}

const renderSectionHeader = (info: {section: SectionListData<Contact>}) => {
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

export const ContactList = (props: ContactListProps) => {
  const navigation = useNavigation()

  const contactsMap: Map<string, Contact[]> = new Map()
  const contacts = useSelector((state: RootState) => state.app.contacts)

  contacts.forEach((contact) => {
    if (contactsMap.has(contact.name?.[0] ?? '')) {
      // eslint-disable-next-line no-unused-expressions
      contactsMap.get(contact.name?.[0] ?? '')?.push(contact)
    } else {
      contactsMap.set(contact.name?.[0] ?? '', [contact])
    }
  })

  const sections: SectionListData<Contact>[] = []

  contactsMap.forEach((c, k) => {
    const section: SectionListData<Contact> = {
      key: k,
      data: c,
    }

    sections.push(section)
  })

  const renderItem = (info: SectionListRenderItemInfo<Contact>) => {
    return (
      <ButtonView
        onPress={() => {
          if (props.onContactSelected) {
            props.onContactSelected(info.item)
          } else {
            navigation.navigate(Facade.route.ContactDetails.name, {
              contact: info.item,
            })
          }
        }}
      >
        <LinearLayout pl={'14px'} mt={'21px'} mb={'21px'}>
          <TextView font={'semi-bold'} color={'text.0'} fontSize={20}>
            {info.item.name}
          </TextView>
          <TextView font={'medium'} color={'primary'} fontSize={16}>
            {info.item.address}
          </TextView>
        </LinearLayout>
      </ButtonView>
    )
  }

  return (
    <SectionList
      style={{width: '100%', height: '100%', marginTop: 40}}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
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
