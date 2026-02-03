import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'

import { TokenHelper } from '@/helpers/TokenHelper'

import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbEye from '@/assets/images/tb-eye.svg'
import TbEyeOff from '@/assets/images/tb-eye-off.svg'

import { utilityReducerActions } from '@/store/reducers/utility'
import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountAssetTokenActionsModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'AccountAssetTokenActionsModal'>) => {
  const { t: commonT } = useTranslation('common')
  const { t } = useTranslation('modals', { keyPrefix: 'accountAssetTokenActionsModal' })

  const dispatch = useAppDispatch()

  const { showType, tokenBalance } = route.params
  const isActive = showType === 'active'

  const isNativeToken = useMemo(
    () => TokenHelper.isNativeToken(tokenBalance.token.hash, tokenBalance.blockchain),
    [tokenBalance]
  )

  const handlePress = () => {
    if (isNativeToken) return

    navigation.goBack()

    dispatch(
      utilityReducerActions.toggleHiddenToken({
        blockchain: tokenBalance.blockchain,
        hash: tokenBalance.token.hash,
      })
    )
  }

  return (
    <TwModalLayout full={false} withoutHeader>
      <TwMenuButton
        label={isActive ? t('hideButtonLabel') : t('showButtonLabel')}
        leftElement={
          isActive ? <TbEyeOff aria-hidden className="text-neon" /> : <TbEye aria-hidden className="text-neon" />
        }
        onPress={handlePress}
        disabled={isNativeToken}
      />

      <TwButton variant="text" label={commonT('general.cancel')} className="mt-7" onPress={navigation.goBack} />
    </TwModalLayout>
  )
}
