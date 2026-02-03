import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useModalErase } from '@/hooks/useModalErase'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import type { TSendRecipient } from '@/routes/screens/SendScreen/SendRecipient'

import TbExternalLink from '@/assets/images/tb-external-link.svg'
import TbEye from '@/assets/images/tb-eye.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import { SendConfirmTransactionDetailItem } from './SendConfirmTransactionDetailItem'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState } from '@/types/store'

type TProps = {
  recipients: TSendRecipient[]
  hashes: string[]
  selectedAccount: IAccountState
  navigation: TWalletsStackScreenProps<'SendScreen'>['navigation']
}

export const SendConfirmSuccessContent = ({ recipients, hashes, selectedAccount, navigation }: TProps) => {
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

      <View className="mb-4 flex flex-col rounded bg-asphalt p-3">
        <View className="flex flex-row items-center gap-x-2 pb-3">
          <TbReceipt aria-hidden className="size-6 text-blue" />
          <Text className="font-sans-medium text-base text-white">{t('detailsLabel')}</Text>
        </View>

        {recipients.map((recipient, index) => (
          <SendConfirmTransactionDetailItem
            key={`transaction-detail-item-${index}`}
            transaction={recipient}
            order={index + 1}
            hash={hashes[index]}
          />
        ))}
      </View>

      <View className="flex flex-col items-center justify-between gap-y-4">
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
