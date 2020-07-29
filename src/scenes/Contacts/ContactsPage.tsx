import {useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  TouchableHighlight,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockedContacts} from '~src/mocks/mockContacts'
import {Contact} from '~src/models/redux/Contact'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {ContactDetails} from '~src/scenes/Contacts/ContactsDetails'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface ContactsProps {
  navigation: StackNavigationProp<ContactsStackParamList & RootStackParamList>
}

const ContactsPage = (prop: ContactsProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const navigation = prop.navigation
  const contacts = useSelector((state: RootState) => state.app.contacts)

  const contactList = () => {
    const contactsMap: Map<string, Contact[]> = new Map()

    contacts.forEach((contact) => {
      if (contactsMap.has(contact.name[0])) {
        // eslint-disable-next-line no-unused-expressions
        contactsMap.get(contact.name[0])?.push(contact)
      } else {
        contactsMap.set(contact.name[0], [contact])
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
            navigation.navigate(Facade.route.ContactDetails.name, {
              contact: info.item,
            })
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
      <ScreenLayout padding={0}>
        <SectionList
          style={{width: '100%', height: '100%'}}
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
      </ScreenLayout>
    )
  }

  const noContactsView = () => {
    return (
      <ScreenLayout>
        <LinearLayout orientation="verti" pt={200}>
          <TextView
            color={theme.colors.background[3]}
            fontSize={24}
            alignSelf="center"
            font={'medium'}
            mb={4}
          >
            {Facade.t('screens.contacts.empty')}
          </TextView>
          <ButtonView
            onPress={() => {
              prop.navigation.navigate(Facade.route.Modal.name, {
                screen: Facade.route.AddContact.name,
              })
            }}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/add-new-contact-dashed-button.png')}
            />
            <LinearLayout alignItems={'center'} mt={-38}>
              <LinearLayout orientation={'horiz'}>
                <ImageView
                  alignSelf={'center'}
                  source={require('~src/assets/images/add-contact-white.png')}
                  mr={4}
                />
                <TextView
                  fontSize="16px"
                  bottom={0}
                  color={theme.colors.text[0]}
                  textAlign="center"
                >
                  {Facade.t('screens.contacts.addContact')}
                </TextView>
              </LinearLayout>
            </LinearLayout>
          </ButtonView>
        </LinearLayout>
      </ScreenLayout>
    )
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

  if (!contacts || contacts.length === 0) {
    return noContactsView()
  } else {
    return contactList()
  }
}

ContactsPage.propTypes = {
  navigation: PropTypes.object,
}

export default ContactsPage
