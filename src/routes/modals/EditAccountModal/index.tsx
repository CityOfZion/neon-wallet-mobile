import React from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AccountCard } from '@/components/AccountCard'
import { TwInput } from '@/components/TwInput'
import { TwInputLabel } from '@/components/TwInputLabel'

import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import { ColorSkinSelector } from './ColorSkinSelector'
import { PremiumSkinSelector } from './PremiumSkinSelector'

import { accountReducerActions } from '@/store/reducers/account'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TSkin } from '@/types/store'

type TActionData = {
  name: string
  skin: TSkin
}

const EditAccountModal = ({ navigation, route }: TRootStackScreenProps<'EditAccountModal'>) => {
  const { account } = route.params
  const dispatch = useAppDispatch()
  const { t } = useTranslation('modals', { keyPrefix: 'editAccount' })
  const { t: commonT } = useTranslation('common')

  const { actionData, setData, setDataWrapper, setError, actionState, handleAct } = useActions<TActionData>({
    name: account.name,
    skin: account.skin,
  })

  const handleChangeName = (name: string) => {
    setData({ name })

    const trimmedName = name.trim()

    if (trimmedName.length <= 0 || trimmedName.length > 20) setError('name', t('invalidName'))
  }

  const handlePressSave = async () => {
    if (!actionData.name || !actionData.skin.id) {
      ToastHelper.error({ message: t('invalidForm') })
      return
    }

    dispatch(
      accountReducerActions.saveAccount({
        ...account,
        ...actionData,
        name: actionData.name.trim(),
      })
    )

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
      <ModalLayout.ScrollContent contentContainerClassName="items-center">
        <AccountCard
          className="mt-7"
          account={{ ...account, skin: actionData.skin, name: actionData.name }}
          isStack={false}
          hideBalance={false}
        />

        <TwInput
          containerProps={{ className: 'w-full mt-8' }}
          label={t('accountInput.title')}
          placeholder={t('accountInput.placeholder')}
          value={actionData.name}
          onChangeText={handleChangeName}
          error={actionState.errors.name}
          clearable
        />

        <View className="mt-8 w-full">
          <TwInputLabel label={t('customizeYourCard')} />

          <ColorSkinSelector onPress={setDataWrapper('skin')} selectedSkin={actionData.skin} />

          {account.type !== 'watch' && (
            <PremiumSkinSelector onPress={setDataWrapper('skin')} selectedSkin={actionData.skin} account={account} />
          )}
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}

export default EditAccountModal
