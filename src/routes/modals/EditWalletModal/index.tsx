import React from 'react'

import { useTranslation } from 'react-i18next'

import { TwInput } from '@/components/TwInput'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  name: string
}

export const EditWalletModal = ({ navigation, route }: TRootStackScreenProps<'EditWalletModal'>) => {
  const { wallet } = route.params

  const dispatch = useAppDispatch()
  const { t } = useTranslation('modals', { keyPrefix: 'editWallet' })
  const { t: commonT } = useTranslation('common')

  const { actionData, actionState, handleAct, setData, setError } = useActions<TActionData>({
    name: wallet.name,
  })

  const handleChangeName = (name: string) => {
    setData({ name })

    const trimmedName = name.trim()

    if (trimmedName.length <= 0 || trimmedName.length > 20) {
      setError('name', t('invalidName'))
    }
  }

  const handlePressSave = async () => {
    const trimmedName = actionData.name.trim()
    dispatch(walletReducerActions.saveWallet({ ...wallet, name: trimmedName }))
    navigation.goBack()
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Button
          position="left"
          label={commonT('general.cancel')}
          onPress={navigation.goBack}
          colorSchema="white"
        />
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.Button
          position="right"
          label={commonT('general.save')}
          disabled={!actionState.isValid}
          isLoading={actionState.isActing}
          onPress={handleAct(handlePressSave)}
        />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <TwInput
          containerProps={{ className: 'w-full mt-8' }}
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          value={actionData.name}
          onChangeText={handleChangeName}
          error={actionState.errors.name}
          clearable
        />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}

export default EditWalletModal
