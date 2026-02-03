import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { TwTabs } from '@/components/TwTabs'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { AddressSelectionModalAccountsContent } from './AddressSelectionModalAccountsContent'
import { AddressSelectionModalAddressContent } from './AddressSelectionModalAddressContent'
import { AddressSelectionModalContactsContent } from './AddressSelectModalContactsContent'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AddressSelectionModal = ({ navigation, route }: TRootStackScreenProps<'AddressSelectionModal'>) => {
  const { onSelect, title, blockchain } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'addressSelectionModal' })

  const [value, setValue] = useState('address')

  const handleSelect = (address: string) => {
    onSelect(address)
    navigation.goBack()
  }

  return (
    <TwModalLayout title={title ?? t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <TwTabs.Root value={value} onValueChange={setValue} className="mt-5 flex-grow">
        <TwTabs.List>
          <TwTabs.Trigger value="address" label={t('addressTabLabel')} />
          <TwTabs.Trigger value="accounts" label={t('accountsTabLabel')} disabled={!blockchain} />
          <TwTabs.Trigger value="contacts" label={t('contactsTabLabel')} disabled={!blockchain} />
        </TwTabs.List>

        <TwTabs.Content value="address">
          <AddressSelectionModalAddressContent onSelect={handleSelect} blockchain={blockchain} />
        </TwTabs.Content>

        <TwTabs.Content value="accounts">
          <AddressSelectionModalAccountsContent onSelect={handleSelect} blockchain={blockchain} />
        </TwTabs.Content>

        <TwTabs.Content value="contacts">
          <AddressSelectionModalContactsContent onSelect={handleSelect} blockchain={blockchain} />
        </TwTabs.Content>
      </TwTabs.Root>
    </TwModalLayout>
  )
}
