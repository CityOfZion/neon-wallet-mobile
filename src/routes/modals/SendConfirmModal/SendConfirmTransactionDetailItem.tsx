import { Fragment } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwSeparator } from '@/components/TwSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useContactsSelector } from '@/hooks/useContactSelector'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import type { TSendRecipient } from '@/routes/screens/SendScreen/SendRecipient'

import TbUsers from '@/assets/images/tb-users.svg'

type TProps = {
  transaction: TSendRecipient
  order: number
  hash?: string
}

export const SendConfirmTransactionDetailItem = ({ order, transaction, hash }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sendConfirmModal' })
  const { currency } = useCurrencySelector()
  const navigation = useNavigation()
  const { contacts } = useContactsSelector()

  const contact = contacts.find(contact =>
    contact.addresses.some(
      AccountHelper.predicate({ address: transaction.address!, blockchain: transaction.token!.blockchain })
    )
  )

  return (
    <View className="flex flex-col gap-y-1">
      <TwDetailsCard.Step label={t('transactionLabel', { order })} />
      <TwDetailsCard.Content title={t('recipientLabel')} className="py-4">
        <Text
          className="w-full max-w-52 font-sans-regular text-base text-white"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {contact ? contact.name : transaction.address}
        </Text>
      </TwDetailsCard.Content>

      {hash && !contact && (
        <View className="self-start pb-4">
          <TwButton
            label={t('successContent.saveContactButtonLabel')}
            leftElement={<TbUsers aria-hidden className="text-neon" />}
            variant="text"
            className="h-fit"
            contentProps={{ className: 'p-0' }}
            onPress={() =>
              navigation.navigate('PersistContactModal', {
                addresses: [{ blockchain: transaction.token!.blockchain, address: transaction.address! }],
              })
            }
          />
        </View>
      )}

      <TwSeparator />

      <TwDetailsCard.Content
        title={t('amountLabel')}
        subtitle={CurrencyHelper.format(
          transaction.amount && transaction.token
            ? BSBigNumberHelper.fromNumber(transaction.amount)
                .multipliedBy(transaction.token.exchangeConvertedPrice)
                .toFixed()
            : 0,
          { currency, maximumFractionDigits: 6 }
        )}
        className="py-4"
      >
        <View className="flex flex-row items-center justify-between gap-x-2">
          <TwDetailsCard.BlockchainToken token={transaction.token!.token} blockchain={transaction.token!.blockchain} />
          <Text className="font-sans-regular text-base text-white">{transaction.amount}</Text>
        </View>
      </TwDetailsCard.Content>

      {hash && (
        <Fragment>
          <TwSeparator />

          <TwDetailsCard.Content title={t('successContent.transactionHashLabel')} className="py-4">
            <View className="flex flex-row items-center justify-between gap-x-2">
              <Text className="font-sans-regular text-base text-white">{hash}</Text>
            </View>
          </TwDetailsCard.Content>
        </Fragment>
      )}
    </View>
  )
}
