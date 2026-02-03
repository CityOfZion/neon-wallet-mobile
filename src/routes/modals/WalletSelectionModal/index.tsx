import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'
import type { TWalletCardRef } from '@/components/WalletCard'
import { WalletCarousel } from '@/components/WalletCarousel'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountsByWalletIdSelector, useAccountsSelector } from '@/hooks/useAccountSelector'
import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { IWalletState } from '@/types/store'

export const WalletSelectionModal = ({ navigation, route }: TRootStackScreenProps<'WalletSelectionModal'>) => {
  const {
    onSelect,
    blockchains,
    title,
    description,
    onRequestClose,
    accountTypes = ['hardware', 'standard'],
    walletTypes = ['hardware', 'standard', 'non-standard'],
  } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'walletSelectionModal' })

  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const { currency } = useCurrencySelector()

  const filteredWallets = wallets.filter(wallet => {
    if (!walletTypes.includes(wallet.type)) return false

    const hasValidAccount = accounts.some(account => {
      if (account.idWallet !== wallet.id) return false

      if (!accountTypes.includes(account.type)) return false

      if (blockchains && !blockchains.includes(account.blockchain)) return false

      return true
    })

    if (!hasValidAccount) return false

    return true
  })

  const [selectedWallet, setSelectedWallet] = useState<IWalletState | undefined>(wallets[0])
  const { accountsByWalletId } = useAccountsByWalletIdSelector(selectedWallet?.id ?? '')

  const balances = useBalances(accountsByWalletId)

  const handlePress = (wallet: IWalletState, ref: TWalletCardRef) => {
    ref.runOutAnimation(async () => {
      onSelect(wallet)

      await UtilsHelper.sleep(500) // wait navigation

      ref.resetAnimation()
    })
  }

  return (
    <TwModalLayout
      title={title ?? t('title')}
      rightElement={<TwModalLayoutCloseIconButton onPress={onRequestClose ?? navigation.goBack} />}
      contentContainerClassName="px-0"
      onRequestClose={onRequestClose}
      withoutScroll
    >
      <Text className="mb-5 px-5 text-center font-sans-medium text-lg text-white">
        {description ?? t('description')}
      </Text>

      <WalletCarousel
        wallets={filteredWallets}
        selectedWallet={selectedWallet}
        onSelect={setSelectedWallet}
        onPress={handlePress}
        blockchains={blockchains}
      />

      <TwSkeleton isLoading={balances.isLoading} layout={{ width: 100, height: 36 }} className="mt-6 items-center">
        <Text className="mt-6 text-center font-sans-medium text-4xl text-white">
          {CurrencyHelper.format(balances.exchangeTotal, { currency })}
        </Text>
      </TwSkeleton>
    </TwModalLayout>
  )
}
