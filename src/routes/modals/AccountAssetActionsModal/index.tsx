import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'

import { useBalance } from '@/hooks/useBalances'
import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbStepInto from '@/assets/images/tb-step-into.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountAssetActionsModal = ({ navigation, route }: TRootStackScreenProps<'AccountAssetActionsModal'>) => {
  const { account } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'accountAssetActionsModal' })
  const { t: commonT } = useTranslation('common')
  const { isNotConnected } = useIsConnectedSelector()
  const balanceQuery = useBalance(account)

  const tokenBalances = balanceQuery.data?.tokensBalances ?? []
  const isSendDisabled =
    isNotConnected ||
    account.type === 'watch' ||
    tokenBalances.length === 0 ||
    tokenBalances.every(balance => balance.amountNumber <= 0)

  const handlePressReceive = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: {
          screen: 'ReceiveScreen',
          params: { account },
        },
      },
      {
        pop: true,
      }
    )
  }

  const handlePressSend = () => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'SendScreen',
        params: {
          account,
        },
      },
    })
  }

  return (
    <TwModalLayout full={false} withoutHeader>
      <TwMenuButton
        label={t('sendButtonLabel')}
        leftElement={<TbStepOut aria-hidden className="text-neon" />}
        onPress={handlePressSend}
        disabled={isSendDisabled}
      />

      <TwMenuButton
        label={t('receiveButtonLabel')}
        leftElement={<TbStepInto aria-hidden className="text-neon" />}
        onPress={handlePressReceive}
      />

      <TwButton variant="text" label={commonT('general.cancel')} className="mt-7" onPress={navigation.goBack} />
    </TwModalLayout>
  )
}
