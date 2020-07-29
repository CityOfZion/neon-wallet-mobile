import {RouteProp} from '@react-navigation/native'
import React from 'react'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Contact} from '~src/models/redux/Contact'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
export interface ContactDetailsParams {
  contact: Contact
}

interface ContactDetailsProps {
  route: RouteProp<ContactsStackParamList, 'ContactDetails'>
}

export const ContactDetails = (prop: ContactDetailsProps) => {
  const contact = prop.route.params.contact
  return (
    <ScreenLayout>
      <LinearLayout alignItems={'center'}>
        <ImageView
          height={'199px'}
          width={'199px'}
          source={require('~src/assets/images/icon-contact-details.png')}
        />
        <TextView
          fontFamily={'semibold'}
          fontSize={'20px'}
          color={'text.0'}
          mb={'10px'}
        >
          {contact.name}
        </TextView>
        <TextView textAlign={'center'} color={'text.6'} fontSize={'14px'}>
          {Facade.t('screens.contactDetails.walletAddress')}
        </TextView>

        <ButtonView
          alignSelf={'center'}
          width={'100%'}
          onPress={() => {
            Facade.utils.copyToClipboard(contact.address)
          }}
          orientation={'horiz'}
          alignItems={'center'}
          alignContent={'center'}
          justifyContent={'center'}
          mt={'6px'}
        >
          <TextView
            fontFamily={'regular'}
            fontSize={'18px'}
            color={'primary'}
            textAlign={'center'}
            mr={'6px'}
          >
            {contact.address}
          </TextView>
          <ImageView
            resizeMode="center"
            source={require('~/src/assets/images/icon-copy-green.png')}
            alignSelf={'center'}
          />
        </ButtonView>
      </LinearLayout>
    </ScreenLayout>
  )
}
