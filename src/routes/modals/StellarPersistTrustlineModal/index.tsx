import { BSBigNumber, type TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwInputLabel } from '@/components/TwInputLabel'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { usePersistTrustlineMutation } from '@/hooks/useStellarTruslines'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'
import TbPlus from '@/assets/images/tb-plus.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  token?: TBSToken
  limit: string
}

export const StellarPersistTrustlineModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'StellarPersistTrustlineModal'>) => {
  const { stellarAccount, token, limit } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'stellarPersistTrustlineModal' })
  const { t: tCommon } = useTranslation('common')
  const trustlineMutation = usePersistTrustlineMutation()
  const { wallet } = useWalletByIdSelector(stellarAccount.idWallet)

  const { actionData, actionState, setDataWrapper, setError, handleAct } = useActions<TActionsData>({
    token,
    limit: limit || '',
  })

  const isEditing = !!token

  const handleSelectToken = () => {
    navigation.navigate('StellarTrustilneTokenSelectionModal', { onSelect: setDataWrapper('token') })
  }

  const handleSubmit = async () => {
    if (!actionData.token) return

    if (actionData.limit) {
      const limitBn = BSBigNumber(actionData.limit)
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
    <TwModalLayout
      title={t('title')}
      leftElement={
        <TwModalLayoutButton label={tCommon('general.cancel')} onPress={navigation.goBack} colorSchema="white" />
      }
      rightElement={
        <TwModalLayoutButton
          label={tCommon('general.save')}
          disabled={!actionData.token}
          isLoading={actionState.isActing}
          onPress={handleAct(handleSubmit)}
        />
      }
      contentContainerClassName="items-center gap-6"
    >
      <View className="w-full">
        <TwInputLabel label={t('tokenLabel')} />

        <TwButton
          label={actionData.token ? actionData.token.symbol : t('tokenPlaceholder')}
          variant="card"
          className="bg-asphalt"
          disabled={isEditing || actionState.isActing}
          colorSchema={actionData.token ? 'white' : 'neon'}
          labelProps={actionData.token ? { className: 'text-left' } : undefined}
          iconsOnEdge={!!actionData.token}
          rightElement={actionData.token ? <MdChevronRight aria-hidden className="text-white" /> : undefined}
          leftElement={
            actionData.token ? (
              <TwTokenIcon {...actionData.token} blockchain="stellar" width={20} height={20} />
            ) : (
              <TbPlus className="text-neon" aria-hidden />
            )
          }
          onPress={handleSelectToken}
        />
      </View>

      <TwInput
        containerProps={{ className: 'w-full' }}
        label={t('limitLabel')}
        value={actionData.limit}
        onChangeText={setDataWrapper('limit')}
        error={actionState.errors.limit}
        disabled={actionState.isActing}
        keyboardType="decimal-pad"
      />
    </TwModalLayout>
  )
}
