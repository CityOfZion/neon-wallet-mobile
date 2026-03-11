import { useEffect } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionCard } from '@/components/ActionCard'
import { ActionInput } from '@/components/ActionInput'
import { ActionStep } from '@/components/ActionStep'
import { ActionTokenButton } from '@/components/ActionTokenButton'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useDebounceFunction } from '@/hooks/useDebounceFunction'
import { useNameService } from '@/hooks/useNameService'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbStepInto from '@/assets/images/tb-step-into.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TTokenBalance, TUseBalanceResult } from '@/types/query'
import type { IAccountState } from '@/types/store'

export type TSendRecipient = {
  id: string
  token?: TTokenBalance
  amount?: string
  isAmountLoading?: boolean
  address?: string
  addressInput?: string
}

type TProps = {
  order: number
  selectedAccount?: IAccountState
  recipient: TSendRecipient
  onUpdateRecipient: (recipient: Partial<TSendRecipient>) => void
  onRemoveRecipient: () => void
  removable?: boolean
  balance?: TUseBalanceResult
  isLoadingMaxAmount: boolean
  isDisabledMaxAmount: boolean
  onMaxAmount: (recipient: TSendRecipient) => void
}

export const SendRecipient = ({
  order,
  selectedAccount,
  recipient,
  onUpdateRecipient,
  onRemoveRecipient,
  removable = false,
  balance,
  isLoadingMaxAmount,
  isDisabledMaxAmount,
  onMaxAmount,
}: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'sendScreen.form.recipient' })
  const debounce = useDebounceFunction()
  const { currency } = useCurrencySelector()
  const navigation = useNavigation()

  const isDisabled = !selectedAccount || isDisabledMaxAmount
  const isAmountDisabled = isDisabled || !recipient.token || !recipient.address

  const { validateAddressOrNS, validatedAddress, isValidatingAddressOrDomainAddress } = useNameService()

  const handleChangeAmount = (value: string) => {
    onUpdateRecipient({
      amount: value,
      isAmountLoading: true,
    })

    debounce(() => {
      onUpdateRecipient({
        amount: BSBigNumberHelper.format(value, { decimals: recipient.token?.token?.decimals }),
        isAmountLoading: false,
      })
    })
  }

  const handleSelectToken = (token: TBSToken) => {
    const blockchain = balance?.data?.blockchain

    if (!blockchain) return

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    const tokenBalance = balance.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(token, tokenBalance.token)
    )

    onUpdateRecipient({ token: tokenBalance, amount: undefined })
  }

  const handleSelectReceivingAddress = (address: string) => {
    onUpdateRecipient({ addressInput: address, address: undefined })
  }

  useEffect(() => {
    if (recipient.addressInput === undefined || !selectedAccount) return
    validateAddressOrNS(recipient.addressInput, selectedAccount.blockchain)
  }, [recipient.addressInput, selectedAccount, validateAddressOrNS])

  useEffect(() => {
    onUpdateRecipient({ address: validatedAddress })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedAddress])

  return (
    <ActionCard>
      <ActionStep
        className="mb-2"
        title={t('recipientLabel', { order })}
        leftElement={<TbStepInto aria-hidden className="text-blue" />}
      >
        {removable && (
          <TwButton
            label={t('removeRecipientButtonLabel')}
            variant="text-slim"
            colorSchema="pink"
            className="w-20"
            disabled={isDisabled}
            onPress={() => onRemoveRecipient()}
          />
        )}
      </ActionStep>

      <TwSeparator />

      <ActionStep
        title={t('tokenToSendLabel')}
        className="my-2"
        leftElement={<VscCircleFilled aria-hidden className="size-2" />}
      >
        <ActionTokenButton
          label={t('selectButtonLabel')}
          isLoading={balance?.isLoading}
          contentProps={{ className: 'px-3' }}
          token={recipient.token?.token}
          disabled={isDisabled}
          onPress={() =>
            navigation.navigate('TokenSelectionModal', {
              account: selectedAccount,
              onSelect: handleSelectToken,
              selectedToken: recipient.token?.token,
              title: t('tokenToReceiveModalTitle'),
              tokens: balance?.data?.tokensBalances.map(tokenBalance => tokenBalance.token) ?? [],
            })
          }
        />
      </ActionStep>

      <TwSeparator />

      <ActionStep
        title={t('receivingAddressLabel')}
        className="my-2"
        titleClassName="max-w-36"
        leftElement={<VscCircleFilled aria-hidden className="size-2" />}
      >
        <ActionAddressButton
          label={t('selectButtonLabel')}
          address={recipient.address}
          disabled={isDisabled}
          contentProps={{ className: 'px-3' }}
          isLoading={isValidatingAddressOrDomainAddress}
          onPress={() =>
            navigation.navigate('AddressSelectionModal', {
              title: t('accountToReceiveModalTitle'),
              blockchain: recipient.token?.token.blockchain,
              onSelect: handleSelectReceivingAddress,
            })
          }
        />
      </ActionStep>

      <TwSeparator />

      <ActionStep
        title={t('amountLabel')}
        descriptionClassName="mt-1 flex-row text-gray-100 w-full justify-between"
        className="w-full flex-row justify-between"
        leftElement={<VscCircleFilled aria-hidden className="size-2" />}
      >
        <ActionInput
          placeholder="0"
          value={recipient.amount ?? ''}
          keyboardType="decimal-pad"
          onChangeText={handleChangeAmount}
          editable={!isAmountDisabled}
          containerClassName="justify-end"
          className="text-md w-24"
          maxButtonProps={{
            isLoading: isLoadingMaxAmount,
            disabled: isAmountDisabled,
            contentProps: { className: 'w-16' },
            onPress: () => onMaxAmount(recipient),
          }}
        />
      </ActionStep>

      <View className="mb-2 flex-col gap-y-2 pl-9 pr-4">
        <Text className="font-sans-regular text-sm text-gray-100">
          {t('maximumLabel', {
            amount: recipient.token?.amountNumber || t('amountPlaceholder'),
          })}
        </Text>
        <View className="flex flex-row justify-between gap-x-2">
          <Text className="font-sans-regular text-sm text-gray-100">
            {t('fiatLabel', { currency: currency.label })}
          </Text>
          <Text className="font-sans-regular text-sm text-gray-100">
            {CurrencyHelper.format(
              recipient.amount && recipient.token
                ? BSBigNumberHelper.fromNumber(recipient.amount)
                    .multipliedBy(recipient.token.exchangeConvertedPrice)
                    .toFixed()
                : 0,
              { currency, maximumFractionDigits: 6 }
            )}
          </Text>
        </View>
      </View>
    </ActionCard>
  )
}
