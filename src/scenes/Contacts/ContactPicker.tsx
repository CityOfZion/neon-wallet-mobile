import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { BlockchainServiceKey } from '~/src/blockchain'
import { TabSelectorContact } from '~/src/components/TabSelectorContacts'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TextView } from '~src/styles/styled-components'
export interface ContactsModalParams {
  onContactSelected?: (contact: Contact, address: string) => void
  onAccountSelected?: (account: Account) => void
  filterByBlockchain?: BlockchainServiceKey
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

  const handleSelectContact = (contact: Contact, address: string) => {
    if (props.route.params.onContactSelected) {
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
