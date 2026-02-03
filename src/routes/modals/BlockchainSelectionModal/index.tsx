import React from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainList } from '@/components/BlockchainList'
import { TwButton } from '@/components/TwButton'

import { useActions } from '@/hooks/useActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  blockchains: TBlockchainServiceKey[]
}

export const BlockchainSelectionModal = ({ route, navigation }: TRootStackScreenProps<'BlockchainSelectionModal'>) => {
  const { onSelect } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'blockchainSelectionModal' })
  const { t: commonT } = useTranslation('common')
  const { actionData, setData, handleAct } = useActions<TActionData>({
    blockchains: ['neo3'],
  })

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({ blockchains })
  }

  const handleSubmit = () => {
    navigation.goBack()
    onSelect(actionData.blockchains[0])
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <BlockchainList onSelect={handleSelect} selectedBlockchains={actionData.blockchains} isMulti={false} />

      <TwButton
        className="mt-auto"
        variant="contained-light"
        label={commonT('general.done')}
        disabled={!actionData.blockchains.length}
        onPress={handleAct(handleSubmit)}
      />
    </TwModalLayout>
  )
}
