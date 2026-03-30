import { useMemo } from 'react'

import { Text } from 'react-native'

import { AccountCardStackList } from '@/components/AccountCardStackList'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

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
    <TwModalLayout
      title={title}
      rightElement={<TwModalLayoutCloseIconButton onPress={onRequestClose || navigation.goBack} />}
      withoutScroll
      contentContainerClassName="pb-0 px-0 items-center"
      onRequestClose={onRequestClose}
    >
      <Text className="mb-8 px-9 text-center font-sans-regular text-lg text-white">{description}</Text>

      <AccountCardStackList
        accounts={filteredAccounts}
        onPress={handlePress}
        contentContainerStyle={{ paddingBottom: 124 }}
      />
    </TwModalLayout>
  )
}
