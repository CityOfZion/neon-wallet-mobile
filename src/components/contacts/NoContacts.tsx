import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export const NoContacts = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  return (
    <LinearLayout flex={1} justifyContent="center">
      <TextView color="background.3" fontSize="24px" alignSelf="center" fontWeight={500} mb="32px">
        {i18n.t('screens.contacts.empty')}
      </TextView>
      <ButtonView
        orientation="horiz"
        position="relative"
        justifyContent="center"
        onPress={() => {
          navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
            params: {},
          })
        }}
      >
        <ImageView
          position="absolute"
          alignSelf="center"
          source={require('~src/assets/images/add-new-contact-dashed-button.png')}
          resizeMode="contain"
          style={{
            width: '95%',
          }}
        />
        <ImageView alignSelf="center" source={require('~src/assets/images/add-contact-white.png')} mr={4} />
        <TextView fontSize="16px" color="text.0" textAlign="center" justifyContent="center" alignItems="center">
          {i18n.t('screens.contacts.addContact')}
        </TextView>
      </ButtonView>
    </LinearLayout>
  )
}
