import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwContactList } from '@/components/TwContactList'

import { useNameServiceLazy } from '@/hooks/useNameService'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TContact, TContactAddress } from '@/types/store'

type TProps = {
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export const AddressSelectionModalContactsContent = ({ onSelect, blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'addressSelection' })
  const { validateAddressOrNS } = useNameServiceLazy()

  const [selectedContact, setSelectedContact] = useState<TContact>()
  const [selectedContactAddress, setSelectedContactAddress] = useState<TContactAddress>()
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = (contact?: TContact, address?: TContactAddress) => {
    setSelectedContact(contact)
    setSelectedContactAddress(address)
  }

  const handleSelect = async () => {
    if (!selectedContactAddress) return

    setIsLoading(true)

    const { address } = await validateAddressOrNS(selectedContactAddress.address, selectedContactAddress.blockchain)

    setIsLoading(false)

    if (!address) return

    onSelect(address)
  }

  return (
    <ModalLayout.ViewContent className="justify-between">
      <TwContactList
        selectedContact={selectedContact}
        selectedContactAddress={selectedContactAddress}
        onPress={handlePress}
        blockchains={blockchain ? [blockchain] : undefined}
      />

      <TwButton
        className="mt-8"
        variant="contained-light"
        label={t('buttonLabel')}
        disabled={!selectedContact || !selectedContactAddress}
        onPress={handleSelect}
        isLoading={isLoading}
      />
    </ModalLayout.ViewContent>
  )
}
