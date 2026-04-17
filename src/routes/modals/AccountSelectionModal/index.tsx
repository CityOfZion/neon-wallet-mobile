import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Radio } from '@/components/Radio'
import { SelectAccordion } from '@/components/SelectAccordion'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { selectAccountsByWalletId } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { createAppSelector, useAppSelector } from '@/hooks/useRedux'
import { useOwnWalletsSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbX from '@/assets/images/tb-x.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount, TWallet } from '@/types/store'

type TActionData = {
  selectedAccount?: TAccount
  selectedWallet?: TWallet
  walletAccordionIsOpen: boolean
  accountAccordionIsOpen: boolean
}

const selectOwnAccountsByWalletId = (walletId?: string, blockchains?: TBlockchainServiceKey[]) =>
  createAppSelector([selectAccountsByWalletId(walletId)], accounts =>
    accounts.filter(account => {
      if (account.type === 'watch') return false
      if (blockchains && !blockchains.includes(account.blockchain)) return false

      return true
    })
  )

export const AccountSelectionModal = ({ navigation, route }: TRootStackScreenProps<'AccountSelectionModal'>) => {
  const { onSelect, blockchains, title } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'accountSelection' })
  const { t: commonT } = useTranslation('common')
  const { wallets } = useOwnWalletsSelector()

  const {
    actionData: { selectedWallet, selectedAccount, accountAccordionIsOpen, walletAccordionIsOpen },
    setData,
    setDataWrapper,
    reset,
  } = useActions<TActionData>({
    selectedAccount: undefined,
    selectedWallet: undefined,
    accountAccordionIsOpen: false,
    walletAccordionIsOpen: true,
  })

  const { value: accounts } = useAppSelector(selectOwnAccountsByWalletId(selectedWallet?.id, blockchains))

  const isDisabled = !selectedAccount || !selectedWallet

  const handleWalletChange = (wallet: TWallet) => {
    setData({
      selectedWallet: wallet,
      selectedAccount: selectedWallet?.id === wallet.id ? selectedAccount : undefined,
      walletAccordionIsOpen: false,
      accountAccordionIsOpen: true,
    })
  }

  const handleAccountChange = (account: TAccount) => {
    setData({ selectedAccount: account, accountAccordionIsOpen: false })
  }

  const handleToggleWalletAccordion = (isOpen: boolean) => {
    setData({ walletAccordionIsOpen: isOpen, accountAccordionIsOpen: false })
  }

  const handleSave = () => {
    if (isDisabled) return

    onSelect(selectedAccount, selectedWallet)
    navigation.goBack()
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{title || t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <SelectAccordion.Root
          className="mt-4"
          value={selectedWallet?.name}
          open={walletAccordionIsOpen}
          onOpenChange={handleToggleWalletAccordion}
        >
          <SelectAccordion.Trigger label={t('walletsAccordionLabel')} />

          <SelectAccordion.Content>
            <Radio.Root value={selectedWallet} onValueChange={handleWalletChange} className="bg-transparent">
              {wallets.map((wallet, index) => (
                <Fragment key={wallet.id}>
                  <Radio.Item value={wallet} id={wallet.id} label={wallet.name} />

                  {index !== wallets.length - 1 && <TwSeparator />}
                </Fragment>
              ))}
            </Radio.Root>
          </SelectAccordion.Content>
        </SelectAccordion.Root>

        <SelectAccordion.Root
          className="mt-4"
          value={selectedAccount?.address}
          disabled={!selectedWallet}
          open={accountAccordionIsOpen}
          onOpenChange={setDataWrapper('accountAccordionIsOpen')}
        >
          <SelectAccordion.Trigger label={t('accountsAccordionLabel')} />

          <SelectAccordion.Content>
            <Radio.Root
              value={selectedAccount}
              onValueChange={handleAccountChange}
              className="rounded-none bg-transparent"
            >
              {accounts.map((account, index) => (
                <Fragment key={account.id}>
                  <Radio.Item
                    value={account}
                    id={account.id}
                    className="gap-4"
                    label={
                      <View className="flex-1">
                        <Text className="font-sans-regular text-lg text-white">{account.name}</Text>
                        <Text
                          className="w-24 font-sans-regular text-sm text-gray-100"
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {account.address}
                        </Text>
                      </View>
                    }
                    leftElement={
                      <View className="h-full pt-1.5">
                        <TwBlockchainIcon blockchain={account.blockchain} className="size-4 text-gray-300" />
                      </View>
                    }
                  />

                  {index !== accounts.length - 1 && <TwSeparator />}
                </Fragment>
              ))}
            </Radio.Root>
          </SelectAccordion.Content>
        </SelectAccordion.Root>

        <View className="mt-auto flex-row gap-3 pt-8">
          <TwButton
            variant="outline"
            colorSchema="pink"
            label={commonT('general.clear')}
            leftElement={<TbX aria-hidden />}
            onPress={reset}
          />

          <TwButton
            variant="contained-light"
            className="flex-1"
            label={commonT('general.save')}
            onPress={handleSave}
            disabled={isDisabled}
          />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
