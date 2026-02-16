import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { SendDetails } from '@/components/SendDetails'
import { TwButton } from '@/components/TwButton'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useModalErase } from '@/hooks/useModalErase'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import TbExternalLink from '@/assets/images/tb-external-link.svg'
import TbEye from '@/assets/images/tb-eye.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState, TUseTransactionsTransaction } from '@/types/store'

type TProps = {
  transactions: TUseTransactionsTransaction[]
  selectedAccount: IAccountState
  fee?: string
  navigation: TWalletsStackScreenProps<'SendScreen'>['navigation']
}

export const SendSuccessContent = ({ transactions, fee, selectedAccount, navigation }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sendConfirmModal.successContent' })
  const { wallet } = useWalletByIdSelector(selectedAccount.idWallet)
  const { handleErase } = useModalErase()

  const handleNavigateViewTransactionStatus = async () => {
    handleErase()

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
        params: { account: selectedAccount, wallet },
      },
    })

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'AccountTransactionsScreen',
        params: { account: selectedAccount },
      },
    })
  }

  const handlePressHelp = () => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'MoreScreen',
        params: { isHelpAccordionOpen: true },
      },
    })
  }

  return (
    <View>
      <Text className="mx-12 mb-6 text-center font-sans-medium text-1xl text-white">{t('description')}</Text>

      <SendDetails transactions={transactions} fee={fee} />

      <View className="mt-auto flex flex-col items-center justify-between gap-y-4 py-4">
        <TwButton
          onPress={handleNavigateViewTransactionStatus}
          variant="text"
          label={t('viewTransactionStatusButtonLabel')}
          leftElement={<TbEye aria-hidden />}
        />
        <TwButton
          variant="contained-light"
          label={t('helpButtonLabel')}
          leftElement={<TbExternalLink aria-hidden />}
          onPress={handlePressHelp}
        />
      </View>
    </View>
  )
}
