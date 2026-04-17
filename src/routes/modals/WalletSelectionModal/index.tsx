import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import type { TWalletCardRef } from '@/components/WalletCard'
import { WalletCarousel } from '@/components/WalletCarousel'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountsByWalletIdSelector, useAccountsSelector } from '@/hooks/useAccountSelector'
import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TWallet } from '@/types/store'

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

  const { t } = useTranslation('modals', { keyPrefix: 'walletSelection' })

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

  const [selectedWallet, setSelectedWallet] = useState<TWallet | undefined>(wallets[0])
  const { accountsByWalletId } = useAccountsByWalletIdSelector(selectedWallet?.id || '')

  const balances = useBalances(accountsByWalletId)

  const handlePress = (wallet: TWallet, ref: TWalletCardRef) => {
    ref.runOutAnimation(async () => {
      onSelect(wallet)

      await UtilsHelper.sleep(500) // wait navigation

      ref.resetAnimation()
    })
  }

  return (
    <ModalLayout.Root onRequestClose={onRequestClose}>
      <ModalLayout.Header>
        <ModalLayout.Title>{title || t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={onRequestClose || navigation.goBack} />
      </ModalLayout.Header>
      <ModalLayout.ViewContent className="px-0">
        <Text className="mb-5 px-5 text-center font-sans-medium text-lg text-white">
          {description || t('description')}
        </Text>

        <WalletCarousel
          wallets={filteredWallets}
          selectedWallet={selectedWallet}
          onSelect={setSelectedWallet}
          onPress={handlePress}
          blockchains={blockchains}
        />

        <Skeleton.Root loading={balances.isLoading} className="mt-6 items-center">
          <Skeleton.Group>
            <Skeleton.Item className="h-9 w-24" />
          </Skeleton.Group>

          <Skeleton.Content>
            <Text className="font-sans-medium text-4xl text-white">
              {CurrencyHelper.format(balances.exchangeTotal, { currency })}
            </Text>
          </Skeleton.Content>
        </Skeleton.Root>
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
