import { BSBigHumanAmount, type TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { TwInput } from '@/components/TwInput'
import { TwSelectButton } from '@/components/TwSelectButton'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { useDebounceFunction } from '@/hooks/useDebounceFunction'
import { usePersistTrustlineMutation } from '@/hooks/useStellarTruslines'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  token?: TBSToken
  limit: string
  isLimitFormatting: boolean
}

export const StellarPersistTrustlineModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'StellarPersistTrustlineModal'>) => {
  const { stellarAccount, token, limit } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'stellarPersistTrustline' })
  const { t: tCommon } = useTranslation('common')
  const trustlineMutation = usePersistTrustlineMutation()
  const { wallet } = useWalletByIdSelector(stellarAccount.idWallet)
  const debounce = useDebounceFunction()

  const { actionData, actionState, setData, setDataWrapper, setError, handleAct } = useActions<TActionsData>({
    token,
    limit: limit || '',
    isLimitFormatting: false,
  })

  const isEditing = !!token

  const handleSelectToken = () => {
    navigation.navigate('StellarTrustilneTokenSelectionModal', { onSelect: setDataWrapper('token') })
  }

  const handleLimitChange = (limit: string) => {
    setData({ limit, isLimitFormatting: true })

    debounce(() => {
      setData({
        limit: new BSBigHumanAmount(limit, actionData.token?.decimals).toFormatted(),
        isLimitFormatting: false,
      })
    })
  }

  const handleSubmit = async () => {
    if (!actionData.token) return

    if (actionData.limit) {
      const limitBn = new BSBigHumanAmount(actionData.limit)
      if (limitBn.isNaN() || limitBn.isNegative() || (limit && limitBn.isLessThanOrEqualTo(limit))) {
        setError('limit', t('errors.invalidLimit'))
        return
      }
    }

    await trustlineMutation.mutateAsync({ stellarAccount, token: actionData.token, limit: actionData.limit })

    navigation.goBack()

    await UtilsHelper.sleep(500)

    navigation.replace('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'WalletsScreen',
        params: { wallet },
      },
    })

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'AccountScreen',
        params: { account: stellarAccount, wallet },
      },
    })

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'AccountTransactionsScreen',
        params: { account: stellarAccount },
      },
    })
  }

  return (
    <ModalLayout.Root disableSwipeToClose={actionState.isActing}>
      <ModalLayout.Header>
        <ModalLayout.Button
          position="left"
          label={tCommon('general.cancel')}
          onPress={navigation.goBack}
          colorSchema="white"
          disabled={actionState.isActing}
        />
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.Button
          position="right"
          label={tCommon('general.save')}
          disabled={!actionData.token || actionData.isLimitFormatting}
          isLoading={actionState.isActing}
          onPress={handleAct(handleSubmit)}
        />
      </ModalLayout.Header>

      <ModalLayout.ScrollContent contentContainerClassName="items-center gap-6">
        <TwSelectButton
          label={t('tokenLabel')}
          value={actionData.token ? actionData.token.symbol : t('tokenPlaceholder')}
          className="bg-asphalt"
          disabled={isEditing || actionState.isActing}
          leftElement={
            actionData.token ? (
              <TwTokenIcon {...actionData.token} blockchain="stellar" width={20} height={20} />
            ) : undefined
          }
          onPress={handleSelectToken}
        />

        <TwInput
          label={t('limitLabel')}
          placeholder={t('limitPlaceholder')}
          value={actionData.limit}
          onChangeText={handleLimitChange}
          error={actionState.errors.limit}
          disabled={actionState.isActing || !actionData.token}
          keyboardType="decimal-pad"
          loading={actionData.isLimitFormatting}
        />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
