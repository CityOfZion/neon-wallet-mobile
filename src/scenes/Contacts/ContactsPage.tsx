import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { ContactList } from '~/src/components/contacts/ContactList'
import ThemedAddButton from '~/src/components/themed/ThemedAddButton'
import { Contact } from '~/src/models/redux/Contact'
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactsStackParamList } from '~src/navigation/ContactsStackNavigation'
interface Props {
  navigation: StackNavigationProp<ContactsStackParamList & RootStackParamList>
}

const ContactsPage: React.FC<Props> = props => {
  const handleContactSelected = (contact: Contact) => {
    props.navigation.navigate(wrapper.route.ContactDetails.name, {
      contact,
    })
  }

  const handleAddPress = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContactModal.name,
      params: {},
    })
  }

  return (
    <ScreenLayout
      rightButton={<ThemedAddButton onPress={handleAddPress} />}
      hideBackButton
      contentStyle={{
        paddingHorizontal: 0,
      }}
    >
      <ContactList
        onSelect={handleContactSelected}
        pressType="all"
        flex={1}
        emptyHideHeader
        emptyComponent={
          <LinearLayout flex={1} paddingX="20px" justifyContent="center" alignItems="center">
            <TextView color="text.6" fontSize="24px" fontWeight={500} mb="42px">
              {i18n.t('screens.contacts.empty')}
            </TextView>

            <ButtonView
              orientation="horiz"
              justifyContent="center"
              width="100%"
              borderWidth="1px"
              borderColor="background.10"
              borderStyle="dashed"
              borderRadius="8px"
              paddingY="18px"
              onPress={handleAddPress}
            >
              <ImageView
                alignSelf="center"
                source={require('~src/assets/images/add-contact-white.png')}
                mr="8px"
                resizeMode="contain"
                width={34}
              />
              <TextView fontSize="18px" color="text.0">
                {i18n.t('screens.contacts.addContact')}
              </TextView>
            </ButtonView>
          </LinearLayout>
        }
      />
    </ScreenLayout>
  )
}

export default ContactsPage
