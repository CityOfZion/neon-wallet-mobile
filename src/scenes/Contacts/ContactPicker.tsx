import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { TabSelectorContact } from '~/src/components/TabSelectorContacts'
import { Account } from '~/src/store/account/Account'
import { Contact } from '~/src/store/contact/Contact'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import { ContactAddresses } from '~/src/types/store'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TextView } from '~src/styles/styled-components'
export interface ContactsModalParams {
  onContactSelected?: (contact: Contact, address: ContactAddresses) => void
  onAccountSelected?: (account: Account) => void
  filterByBlockchain?: TBlockchainServiceKey
}

interface ContactsModalProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ContactsModal'>
}

export const ContactPicker = (props: ContactsModalProps) => {
  const controller = useSwiperController(true)

  const handleSelectAccount = (account: Account) => {
    if (props.route.params.onAccountSelected) {
      props.route.params.onAccountSelected(account)
    }
    controller.close()
  }

  const handleSelectContact = (contact: Contact, address?: ContactAddresses) => {
    if (props.route.params.onContactSelected && address) {
      props.route.params.onContactSelected(contact, address)
    }

    controller.close()
  }

  return (
    <SwiperPanel
      title={i18n.t('contactPicker.title')}
      controller={controller}
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      withoutScrollView
    >
      <TextView color="text.0" alignSelf="center" fontFamily="medium" fontSize="18px">
        {i18n.t('contactPicker.selectContact')}
      </TextView>

      <TabSelectorContact
        onAccountSelected={handleSelectAccount}
        onContactSelected={handleSelectContact}
        filterByBlockchain={props.route.params.filterByBlockchain}
      />
    </SwiperPanel>
  )
}
