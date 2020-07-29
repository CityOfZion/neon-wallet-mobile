import {RouteProp} from '@react-navigation/native'
import React from 'react'

import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Contact} from '~src/models/Contact'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'
export interface ContactDetailsParams {
  contact: Contact
}

interface ContactDetailsProps {
  route: RouteProp<ContactsStackParamList, 'ContactDetails'>
}

export const ContactDetails = (props: ContactDetailsProps) => {
  const contact = props.route.params.contact
  return (
    <ScreenLayout>
      <LinearLayout>
        <TextView>{contact.name}</TextView>
        <TextView>{contact.address}</TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}
