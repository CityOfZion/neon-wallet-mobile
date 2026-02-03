import React, { Fragment } from 'react'

import { Text, View } from 'react-native'

import { TwAccordion } from '@/components/TwAccordion'
import { TwSeparator } from '@/components/TwSeparator'
import { TwSkeleton } from '@/components/TwSkeleton'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import WalletBlueIcon from '@/assets/images/wallet-blue-icon.svg'

import { AccountAccordionItem } from './AccountAccordionItem'

import type { IAccountState, IWalletState } from '@/types/store'

type TProps = {
  defaultOpened: boolean
  wallet: IWalletState
  accounts: IAccountState[]
}

export const WalletAccordionItem = ({ wallet, accounts, defaultOpened }: TProps) => {
  const { isLoading, exchangeTotal } = useBalances(accounts)
  const { currency } = useCurrencySelector()

  return (
    <TwAccordion.Root defaultValue={defaultOpened}>
      <TwAccordion.Trigger
        leftElement={<WalletBlueIcon aria-hidden className="h-7 w-7" />}
        label={
          <Fragment>
            <Text className="flex-shrink flex-grow font-sans-medium text-lg text-white" numberOfLines={1}>
              {wallet.name}
            </Text>

            <TwSkeleton isLoading={isLoading} layout={{ width: 64, height: 24 }}>
              <Text className="font-sans-regular text-gray-100" numberOfLines={1}>
                {CurrencyHelper.format(exchangeTotal, { currency })}
              </Text>
            </TwSkeleton>
          </Fragment>
        }
      />
      <TwAccordion.Content>
        <View className="mx-3 mb-2 mt-1 flex flex-col">
          {accounts.map((account, index) => (
            <Fragment key={account.id}>
              <AccountAccordionItem account={account} />

              {index !== accounts.length - 1 && <TwSeparator />}
            </Fragment>
          ))}
        </View>
      </TwAccordion.Content>
    </TwAccordion.Root>
  )
}
