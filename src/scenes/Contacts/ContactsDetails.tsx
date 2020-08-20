import {RouteProp, useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Contact} from '~src/models/redux/Contact'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {RootState} from '~src/store/RootStore'
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
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<ContactsStackParamList, 'ContactDetails'>
}

export const ContactDetails = (props: ContactDetailsProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)

  const [contact, setContact] = useState(props.route.params.contact)

  useEffect(() => {
    const freshContact = contacts.find((it) => it.id === contact.id)

    if (freshContact) {
      setContact(freshContact)
    }
  }, [contacts])

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.PersistContact.name,
            params: {
              contact,
            },
          })
        },
      }),
  })
  return (
    <ScreenLayout>
      <LinearLayout alignItems={'center'} mr={'10px'} ml={'10px'}>
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
            if (contact.address) Facade.utils.copyToClipboard(contact.address)
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
