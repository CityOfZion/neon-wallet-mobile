import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainList } from '@/components/BlockchainList'
import { TwButton } from '@/components/TwButton'

import { useActions } from '@/hooks/useActions'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  blockchains: TBlockchainServiceKey[]
}

export const BlockchainSelectionModal = ({ route }: TRootStackScreenProps<'BlockchainSelectionModal'>) => {
  const { onSelect, isMulti = false, description, title, buttonProps } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'blockchainSelection' })
  const { t: tCommon } = useTranslation('common')
  const { actionData, setData, handleAct } = useActions<TActionData>({
    blockchains: ['neo3'],
  })

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({ blockchains })
  }

  const handleSubmit = () => {
    onSelect(actionData.blockchains)
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{title || t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        {description && <Text className="mb-6 text-center font-sans-medium text-lg text-white">{description}</Text>}

        <BlockchainList onSelect={handleSelect} selectedBlockchains={actionData.blockchains} isMulti={isMulti} />

        <View className="mt-auto py-4">
          <TwButton
            variant="contained-light"
            label={tCommon('general.continue')}
            disabled={!actionData.blockchains.length}
            onPress={handleAct(handleSubmit)}
            {...buttonProps}
          />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
