import React from 'react'

import {Contact} from '~src/models/Contact'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface ContactDetailsProps {
  contact: Contact
}

export const ContactDetails = (props: ContactDetailsProps) => {
  return (
    <LinearLayout>
      <TextView>{props.contact.name}</TextView>
      <TextView>{props.contact.address}</TextView>
    </LinearLayout>
  )
}
