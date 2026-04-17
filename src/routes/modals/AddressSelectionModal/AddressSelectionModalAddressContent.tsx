import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { StringHelper } from '@/helpers/StringHelper'

import { useNameService } from '@/hooks/useNameService'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export const AddressSelectionModalAddressContent = ({ onSelect, blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'addressSelection' })
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
    <ModalLayout.KeyboardAvoidingContent keyboardVerticalOffset={240}>
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

      <ModalLayout.KeyboardAvoidingArea>
        <TwButton
          variant="contained-light"
          label={t('buttonLabel')}
          disabled={isButtonDisabled}
          onPress={handleSelect}
        />
      </ModalLayout.KeyboardAvoidingArea>
    </ModalLayout.KeyboardAvoidingContent>
  )
}
