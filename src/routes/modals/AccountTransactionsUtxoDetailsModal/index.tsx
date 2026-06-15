import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'
import { AccountTransactionsTransactionItemNft } from '@/components/AccountTransactionsTransactionItemNft'
import { TwTabs } from '@/components/TwTabs'

import { DateHelper } from '@/helpers/DateHelper'

import { useLanguageSelector } from '@/hooks/useSettingsSelector'
import { usePendingTransactionsSelector } from '@/hooks/useUtilitySelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import { AccountTransactionsUtxoDetailsList } from './AccountTransactionsUtxoDetailsList'

import type { TRootStackScreenProps } from '@/types/stacks'

type TTab = 'from' | 'to'

export const AccountTransactionsUtxoDetailsModal = ({
  route,
  navigation,
}: TRootStackScreenProps<'AccountTransactionsUtxoDetailsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountTransactionsUtxoDetails' })
  const { language } = useLanguageSelector()
  const { pendingTransactions } = usePendingTransactionsSelector()
  const [tab, setTab] = useState<TTab>('from')
  const [transaction, setTransaction] = useState(route.params.transaction)

  const { blockchain, inputs, outputs, nfts, txId } = transaction
  const inputsLength = inputs.length
  const outputsLength = outputs.length
  const hasInputs = inputsLength > 0
  const hasOutputs = outputsLength > 0

  useEffect(() => {
    if (!transaction.isPending) return

    const isStillPending = pendingTransactions.some(pendingTransaction => pendingTransaction.txId === txId)

    if (!isStillPending) {
      setTransaction(previousTransaction => ({ ...previousTransaction, isPending: false }))
    }
  }, [navigation, pendingTransactions, transaction.isPending, txId])

  useEffect(() => {
    if (!hasInputs) {
      setTab('to')
    }
  }, [hasInputs])

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <Text className="mb-4 font-sans-medium text-lg text-white">
          {DateHelper.formatLocalized(transaction.date, { format: 'PPP', language })}
        </Text>

        <AccountTransactionsTransactionCard transaction={transaction} className="mb-8">
          {nfts.length > 0 && (
            <View className="mt-2 flex gap-y-2">
              {nfts.map((nft, index) => (
                <AccountTransactionsTransactionItemNft key={`utxo-nft-${index}`} blockchain={blockchain} nft={nft} />
              ))}
            </View>
          )}
        </AccountTransactionsTransactionCard>

        {(hasInputs || hasOutputs) && (
          <TwTabs.Root className="mb-10" value={tab} onValueChange={newTab => setTab(newTab as TTab)}>
            <TwTabs.List>
              <TwTabs.Trigger value="from" label={t('fromLabel')} disabled={!hasInputs} />
              <TwTabs.Trigger value="to" label={t('toLabel')} disabled={!hasOutputs} />
            </TwTabs.List>

            <TwTabs.Content value="from">
              <AccountTransactionsUtxoDetailsList
                title={t(inputsLength === 1 ? 'inputTitle' : 'inputsTitle', { value: inputsLength })}
                blockchain={blockchain}
                inputsOutputs={inputs}
              />
            </TwTabs.Content>

            <TwTabs.Content value="to">
              <AccountTransactionsUtxoDetailsList
                title={t(outputsLength === 1 ? 'outputTitle' : 'outputsTitle', { value: outputsLength })}
                blockchain={blockchain}
                inputsOutputs={outputs}
              />
            </TwTabs.Content>
          </TwTabs.Root>
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
