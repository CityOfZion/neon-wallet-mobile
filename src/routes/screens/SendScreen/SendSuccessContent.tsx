import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { TSendDetailsData } from '@/components/SendDetails'
import { SendDetails } from '@/components/SendDetails'
import { TwButton } from '@/components/TwButton'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useModalErase } from '@/hooks/useModalErase'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import TbExternalLink from '@/assets/images/tb-external-link.svg'
import TbEye from '@/assets/images/tb-eye.svg'

import type { TUseTransactionsTransaction } from '@/types/hooks'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

type TProps = {
  transactions: TUseTransactionsTransaction[]
  selectedAccount: TAccount
  fee?: string
  navigation: TWalletsStackScreenProps<'SendScreen'>['navigation']
}

export const SendSuccessContent = ({ transactions, selectedAccount, fee, navigation }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sendConfirm.successContent' })
  const { wallet } = useWalletByIdSelector(selectedAccount.idWallet)
  const { handleErase } = useModalErase()

  const data: TSendDetailsData[] = transactions.map(transaction => {
    const { txId } = transaction

    if (transaction.view === 'utxo') {
      return {
        txId,
        items: transaction.outputs
          .filter(output => !!output.address)
          .map(({ address, amount, token }) => ({ address: address!, amount, token })),
      }
    }

    return {
      txId,
      items: transaction.events
        .filter(event => !!event.to && !!event.amount)
        .map(event => ({
          address: event.to!,
          amount: event.amount!,
          token: event.eventType === 'token' ? event.token : undefined,
        })),
    }
  })

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

  const handlePressHelp = async () => {
    handleErase()

    await UtilsHelper.sleep(500)

    navigation.replace('TabStack', {
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

      {/* Assuming all transactions are from the same blockchain */}
      <SendDetails data={data} blockchain={selectedAccount.blockchain} fee={fee} />

      <View className="mt-auto flex flex-col items-center justify-between gap-y-4 py-4">
        <TwButton
          label={t('viewTransactionStatusButtonLabel')}
          variant="text"
          leftElement={<TbEye aria-hidden />}
          onPress={handleNavigateViewTransactionStatus}
        />

        <TwButton
          label={t('helpButtonLabel')}
          variant="contained-light"
          leftElement={<TbExternalLink aria-hidden />}
          onPress={handlePressHelp}
        />
      </View>
    </View>
  )
}
