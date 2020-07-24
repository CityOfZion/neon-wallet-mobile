import {useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  TouchableHighlight,
} from 'react-native'
import {useSelector} from 'react-redux'
import {marginBottom} from 'styled-system'

import {Facade} from '~src/app/Facade'
import {AddContact} from '~src/components/AddContact'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel from '~src/components/SwiperPanel'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockedContacts} from '~src/mocks/mockContacts'
import {Contact} from '~src/models/Contact'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

const noContactsView = (
  theme: ApplicationTheme,
  navigation: StackNavigationProp<RootStackParamList>
) => {
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
            navigation.navigate(Facade.route.Modal.name, {
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
                source={require('~/src/assets/images/add-contact-white.png')}
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

const renderItem = (
  onClick: () => void,
  info: SectionListRenderItemInfo<Contact>
) => {
  return (
    <ButtonView>
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

const contactList = (
  theme: ApplicationTheme,
  contacts: Contact[],
  navigation: StackNavigationProp<RootStackParamList>
) => {
  const contactsMap: Map<string, Contact[]> = new Map()
  contacts.forEach((contact) => {
    if (contactsMap.has(contact.name[0])) {
      const contacts = contactsMap.get(contact.name[0])
      contacts?.push(contact)
    } else {
      const contacts: Contact[] = [contact]
      contactsMap.set(contact.name[0], contacts)
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

  const onContactClick = () =>{
    navigation.navigate()
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

interface ContactsProps {
  navigation: StackNavigationProp<RootStackParamList>
}

const ContactsPage = (props: ContactsProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  let contacts: Contact[] = mockedContacts.sort((c1, c2) =>
    c1.name.localeCompare(c2.name)
  )

  useFocusEffect(() => {
    contacts = mockedContacts.sort((c1, c2) => c1.name.localeCompare(c2.name))
  })

  if (!contacts || contacts.length == 0) {
    return noContactsView(theme, props.navigation)
  } else {
    return contactList(theme, contacts)
  }
}

export default ContactsPage
