import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export const NoContacts = () => {
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()

  return (
    <LinearLayout orientation="verti" flex={1} justifyContent={'center'} p={20}>
      <TextView
        color={'background.3'}
        fontSize={24}
        alignSelf="center"
        font={'medium'}
        mb={'32px'}
      >
        {i18n.t('screens.contacts.empty')}
      </TextView>
      <ButtonView
        onPress={() => {
          navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
          })
        }}
      >
        <ImageView
          alignSelf={'center'}
          width={'95%'}
          source={require('~src/assets/images/add-new-contact-dashed-button.png')}
          resizeMode={'contain'}
          mt={'-14px'}
        />
        <LinearLayout
          alignItems={'center'}
          position={'absolute'}
          alignSelf={'center'}
        >
          <LinearLayout orientation={'horiz'}>
            <ImageView
              alignSelf={'center'}
              source={require('~src/assets/images/add-contact-white.png')}
              mr={4}
            />
            <TextView
              fontSize="16px"
              bottom={0}
              color={'text.0'}
              textAlign="center"
              justifyContent="center"
              alignItens="center"
            >
              {i18n.t('screens.contacts.addContact')}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
