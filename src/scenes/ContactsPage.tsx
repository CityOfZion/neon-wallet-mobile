import React from 'react'

import ScreenLayout from '~src/components/layout/ScreenLayout'
import {TextView} from '~src/styles/styled-components'

const ContactsPage = () => {
  return (
    <ScreenLayout useHeaderPadding={false}>
      <TextView color="text.0" fontSize="3xl" textAlign="center">
        Contacts Page
      </TextView>
    </ScreenLayout>
  )
}

export default ContactsPage
