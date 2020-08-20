import {useNavigation} from '@react-navigation/native'
import React from 'react'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export const NoContacts = () => {
  const navigation = useNavigation()

  return (
    <LinearLayout orientation="verti" flex={1} justifyContent={'center'} p={20}>
      <TextView
        color={'background.3'}
        fontSize={24}
        alignSelf="center"
        font={'medium'}
        mb={'32px'}
      >
        {Facade.t('screens.contacts.empty')}
      </TextView>
      <ButtonView
        onPress={() => {
          navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.PersistContact.name,
          })
        }}
      >
        <ImageView
          alignSelf={'center'}
          width={'95%'}
          source={require('~src/assets/images/add-new-contact-dashed-button.png')}
          resizeMode={'contain'}
          mt={'-4%'}
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
            >
              {Facade.t('screens.contacts.addContact')}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
