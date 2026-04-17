import React from 'react'

import { useTranslation } from 'react-i18next'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSelectButton } from '@/components/TwSelectButton'

import { StringHelper } from '@/helpers/StringHelper'

import { useActions } from '@/hooks/useActions'
import { useNameService } from '@/hooks/useNameService'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  address: string
  blockchain?: TBlockchainServiceKey
}

export const PersistContactAddressModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'PersistContactAddressModal'>) => {
  const onAdd = route.params?.onAdd
  const address = route.params?.address

  const { t } = useTranslation('modals', { keyPrefix: 'persistContactAddress' })
  const { t: commonT } = useTranslation('common')

  const {
    validateAddressOrNS,
    isValidatingAddressOrDomainAddress,
    isValidAddressOrDomainAddress,
    isNameService,
    validatedAddress,
  } = useNameService()

  const { actionData, setData } = useActions<TActionData>({
    address: address?.address || '',
    blockchain: address?.blockchain,
  })

  const handleSelectBlockchain = () => {
    navigation.navigate('BlockchainSelectionModal', {
      onSelect: (blockchains: TBlockchainServiceKey[]) => {
        const [blockchain] = blockchains

        setData({ blockchain })

        if (actionData.address) validateAddressOrNS(actionData.address, blockchain)
        navigation.goBack()
      },
    })
  }

  const handleChangeAddress = (value: string) => {
    value = StringHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true })

    setData({ address: value })
    validateAddressOrNS(value, actionData.blockchain)
  }

  const handleAdd = () => {
    navigation.goBack()
    onAdd?.({ blockchain: actionData.blockchain!, address: actionData.address })
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{address ? t('title.edit') : t('title.create')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      <ModalLayout.KeyboardAvoidingContent>
        <TwSelectButton
          className="mb-6"
          value={actionData.blockchain ? commonT(`blockchainServices.${actionData.blockchain}.label`) : undefined}
          leftElement={actionData.blockchain ? <TwBlockchainIcon blockchain={actionData.blockchain} /> : undefined}
          label={t('chainLabel')}
          placeholder={t('chainPlaceholder')}
          onPress={handleSelectBlockchain}
        />

        <TwInput
          label={t('addressLabel')}
          labelDescription={isNameService ? validatedAddress : undefined}
          placeholder={t('addressPlaceholder')}
          onChangeText={handleChangeAddress}
          value={actionData.address}
          error={isValidAddressOrDomainAddress === false ? t('invalidMessage') : undefined}
          success={isValidAddressOrDomainAddress === true ? t('successMessage') : undefined}
          disabled={!actionData.blockchain}
          loading={isValidatingAddressOrDomainAddress}
          scannable
          pastable
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />

        <ModalLayout.KeyboardAvoidingArea>
          <TwButton
            variant="contained-light"
            label={address ? commonT('general.save') : commonT('general.add')}
            onPress={handleAdd}
            disabled={!isValidAddressOrDomainAddress}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}
