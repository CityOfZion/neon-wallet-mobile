import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { StringHelper } from '@/helpers/StringHelper'

import { useNameService } from '@/hooks/useNameService'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export const AddressSelectionModalAddressContent = ({ onSelect, blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'addressSelectionModal' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  const [addressInput, setAddressInput] = useState('')
  const { validateAddressOrNS, validatedAddress, isValidatingAddressOrDomainAddress, isValidAddressOrDomainAddress } =
    useNameService()

  const handleChange = (value: string) => {
    const cleaned = StringHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true })
    setAddressInput(cleaned)
  }

  const handleSelect = () => {
    if (validatedAddress) {
      onSelect(validatedAddress)
      return
    }
    onSelect(addressInput)
  }

  useEffect(() => {
    if (addressInput && blockchain) {
      validateAddressOrNS(addressInput, blockchain)
    }
  }, [addressInput, blockchain, validateAddressOrNS])

  const hasInvalidAddress = blockchain && isValidAddressOrDomainAddress === false

  const isButtonDisabled = addressInput.length === 0 || isValidatingAddressOrDomainAddress || hasInvalidAddress

  return (
    <View className="flex-shrink flex-grow justify-between">
      <TwInput
        placeholder={t('inputPlaceholder')}
        value={addressInput}
        clearable
        pastable
        onChangeText={handleChange}
        error={
          hasInvalidAddress
            ? t('errors.invalidAddress', { blockchain: tCommonBlockchainServices(`${blockchain}.label`) })
            : undefined
        }
        loading={isValidatingAddressOrDomainAddress}
      />

      <TwButton variant="contained-light" label={t('buttonLabel')} disabled={isButtonDisabled} onPress={handleSelect} />
    </View>
  )
}
