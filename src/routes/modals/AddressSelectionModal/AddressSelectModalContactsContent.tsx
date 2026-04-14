import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwContactList } from '@/components/TwContactList'

import { useNameServiceLazy } from '@/hooks/useNameService'

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
    <View className="flex-shrink flex-grow justify-between">
      <TwContactList
        selectedContact={selectedContact}
        selectedContactAddress={selectedContactAddress}
        onPress={handlePress}
        blockchains={blockchain ? [blockchain] : undefined}
      />

      <TwButton
        variant="contained-light"
        label={t('buttonLabel')}
        disabled={!selectedContact || !selectedContactAddress}
        onPress={handleSelect}
        isLoading={isLoading}
      />
    </View>
  )
}
