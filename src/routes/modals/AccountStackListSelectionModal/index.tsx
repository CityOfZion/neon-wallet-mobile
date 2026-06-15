import { useMemo } from 'react'

import { Text } from 'react-native'

import { AccountCardStackList } from '@/components/AccountCardStackList'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

export const AccountStackListSelectionModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'AccountStackListSelectionModal'>) => {
  const {
    description,
    title,
    onSelect,
    wallet,
    blockchains,
    onRequestClose,
    accountTypes = ['hardware', 'standard'],
  } = route.params

  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

  const filteredAccounts = useMemo(() => {
    const filtered: TAccount[] = []

    accountsByWalletId.forEach(account => {
      if (!accountTypes.includes(account.type)) return
      if (blockchains && !blockchains.includes(account.blockchain)) return

      filtered.push(account)
    })

    return filtered
  }, [accountTypes, accountsByWalletId, blockchains])

  const handlePress = (account: TAccount) => {
    onSelect(account)
  }

  return (
    <ModalLayout.Root onRequestClose={onRequestClose}>
      <ModalLayout.Header>
        <ModalLayout.Title>{title}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={onRequestClose || navigation.goBack} />
      </ModalLayout.Header>
      <ModalLayout.ViewContent className="items-center px-0 pb-0">
        <Text className="mb-8 px-9 text-center font-sans-regular text-lg text-white">{description}</Text>

        <AccountCardStackList
          accounts={filteredAccounts}
          onPress={handlePress}
          contentContainerStyle={{ paddingBottom: 124 }}
        />
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
