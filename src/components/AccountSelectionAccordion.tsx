import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'

import { AccountHelper } from '@/helpers/AccountHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountsSelector } from '@/hooks/useAccountSelector'

import TbCheck from '@/assets/images/tb-check.svg'
import TbMinus from '@/assets/images/tb-minus.svg'
import TbPlus from '@/assets/images/tb-plus.svg'

import { TwBlockchainIcon } from './TwBlockchainIcon'

import type { TBlockchainServiceKey } from '@/types/blockchain'

export type TAccountSelectionAccordionAccount = {
  blockchain: TBlockchainServiceKey
  address: string
  bipPath?: string
  key?: string
}

type TProps = {
  accounts: TAccountSelectionAccordionAccount[]
  selectedAccounts: TAccountSelectionAccordionAccount[]
  onPressAccount: (account: TAccountSelectionAccordionAccount) => void
}

type TAccountSelectionAccordionHeaderProps = {
  blockchain: TBlockchainServiceKey
  accountsSelectedCount: number
  accountsCount: number
  isOpened: boolean
}

type TAccountSelectionAccordionContentProps = {
  accounts: TAccountSelectionAccordionAccount[]
  onPress: (account: TAccountSelectionAccordionAccount) => void
  selectedAccounts: TAccountSelectionAccordionAccount[]
}

const AccountSelectionAccordionHeader = ({
  blockchain,
  isOpened,
  accountsCount,
  accountsSelectedCount,
}: TAccountSelectionAccordionHeaderProps) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('components', { keyPrefix: 'accountSelectionAccordion' })

  return (
    <View className="flex-row justify-between gap-4 border-b border-gray-300/30 px-3 py-2.5">
      <View className="flex-shrink flex-grow flex-row items-center gap-2.5">
        <TwBlockchainIcon blockchain={blockchain} className="size-6" />

        <View className="flex-shrink flex-grow">
          <Text className="font-sans-medium text-xs text-gray-300">
            {tCommon(`blockchainServices.${blockchain}.label`)}
          </Text>

          <Text
            className="flex-shrink flex-grow font-sans-bold text-lg text-white"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {tCommon(`blockchainServices.${blockchain}.label`)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <Text className="font-sans-medium text-xs text-gray-300">
          {t('selectedOfTotal', {
            selectedCount: accountsSelectedCount,
            totalCount: accountsCount,
          })}
        </Text>

        {isOpened ? (
          <TbMinus aria-hidden className="size-6 text-neon" />
        ) : (
          <TbPlus aria-hidden className="size-6 text-neon" />
        )}
      </View>
    </View>
  )
}

const AccountSelectionAccordionContent = ({
  accounts,
  selectedAccounts,
  onPress,
}: TAccountSelectionAccordionContentProps) => {
  const { accountsRef } = useAccountsSelector()

  return (
    <View>
      {accounts.map(account => {
        const accountAlreadyExists = accountsRef.current.some(AccountHelper.predicate(account))
        const isSelected = selectedAccounts.some(AccountHelper.predicate(account))

        return (
          <Pressable
            onPress={onPress.bind(null, account)}
            key={`${account.address}-${account.blockchain}`}
            disabled={accountAlreadyExists}
            className={StyleHelper.mergeStyles('flex-row items-center justify-between bg-gray-900 p-3', {
              'opacity-50': accountAlreadyExists,
            })}
          >
            <View className="flex-shrink flex-grow">
              {account.bipPath && <Text className="font-sans-medium text-sm text-gray-300">{account.bipPath}</Text>}

              <Text className="font-sans-medium text-sm text-white">{account.address}</Text>
            </View>

            {isSelected && <TbCheck className="size-6 text-neon" />}
          </Pressable>
        )
      })}
    </View>
  )
}

export const AccountSelectionAccordion = ({ accounts, onPressAccount, selectedAccounts }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'accountSelectionAccordion' })
  const [openedSections, setOpenedSections] = useState<number[]>([])

  const accountsByBlockchain = useMemo(() => {
    const accountsByBlockchain = new Map<TBlockchainServiceKey, TAccountSelectionAccordionAccount[]>()

    accounts.forEach(account => {
      const accountsForBlockchain = accountsByBlockchain.get(account.blockchain) || []

      accountsByBlockchain.set(account.blockchain, [...accountsForBlockchain, account])
    })

    return accountsByBlockchain
  }, [accounts])

  const selectedAccountsByBlockchain = useMemo(() => {
    const selectedAccountsByBlockchain = new Map<TBlockchainServiceKey, TAccountSelectionAccordionAccount[]>()

    selectedAccounts.forEach(account => {
      const accountsForBlockchain = selectedAccountsByBlockchain.get(account.blockchain) || []

      selectedAccountsByBlockchain.set(account.blockchain, [...accountsForBlockchain, account])
    })

    return selectedAccountsByBlockchain
  }, [selectedAccounts])

  if (accounts.length === 0)
    return (
      <Text className="mx-auto px-6 text-center font-sans-regular text-base leading-5 text-gray-100">
        {t('notFoundLabel')}
      </Text>
    )

  return (
    <Accordion
      onChange={setOpenedSections}
      expandMultiple
      activeSections={openedSections}
      keyExtractor={(_item, index) => index}
      sections={Array.from(accountsByBlockchain.entries())}
      renderHeader={(content, _index, isOpened) => (
        <AccountSelectionAccordionHeader
          blockchain={content[0]}
          isOpened={isOpened}
          accountsCount={content[1].length}
          accountsSelectedCount={selectedAccountsByBlockchain.get(content[0])?.length || 0}
        />
      )}
      renderContent={content => (
        <AccountSelectionAccordionContent
          accounts={content[1]}
          onPress={onPressAccount}
          selectedAccounts={selectedAccountsByBlockchain.get(content[0]) || []}
        />
      )}
    />
  )
}
