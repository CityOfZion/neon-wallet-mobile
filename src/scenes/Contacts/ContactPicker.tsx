import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {Fragment} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {ContactList} from '~src/components/contacts/ContactList'
import {NoContacts} from '~src/components/contacts/NoContacts'
import {Contact} from '~src/models/redux/Contact'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TextView} from '~src/styles/styled-components'

export interface ContactsModalParams {
  onContactSelected: (contact: Contact) => void
}

interface ContactsModalProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ContactsModal'>
}

export const ContactPicker = (props: ContactsModalProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      image={require('~src/assets/images/icon-contacts-white.png')}
      title={Facade.t('contactPicker.title')}
      controller={controller}
      rightButton={CloseButton()}
      onClose={props.navigation.goBack}
      onRightPress={controller.close}
      padding={0}
      paddingTop={40}
      fullSize={true}
    >
      {contacts.length ? (
        <Fragment>
          <TextView
            color={'text.0'}
            alignSelf={'center'}
            fontFamily={'medium'}
            fontSize={18}
            mb={20}
          >
            {Facade.t('contactPicker.selectContact')}
          </TextView>
          <ContactList
            onContactSelected={props.route.params.onContactSelected}
          />
        </Fragment>
      ) : (
        <NoContacts />
      )}
    </SwiperPanel>
  )
}
