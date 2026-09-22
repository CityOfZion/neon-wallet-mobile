import type { BSBigNumber, TBSToken } from '@cityofzion/blockchain-service'
import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import * as CheckboxPrimitive from '@rn-primitives/checkbox'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbCheck from '@/assets/images/tb-check.svg'

type TProps = {
  amountBn: BSBigNumber
  fiatPriceBn: BSBigNumber
  minBn: BSBigNumber
  customAmountBn?: BSBigNumber
  isChecked: boolean
  isDisabled: boolean
  isLoading: boolean
  error?: string
  className?: string
  token?: TBSToken
  onCheckChange: (isChecked: boolean) => void
  onCustomAmountChange: (customAmount?: BSBigNumber) => void
}

export const SendTipCheckbox = ({
  className,
  amountBn,
  fiatPriceBn,
  minBn,
  customAmountBn,
  token,
  isDisabled,
  isChecked,
  isLoading,
  error,
  onCheckChange,
  onCustomAmountChange,
}: TProps) => {
  const navigation = useNavigation()
  const { t } = useTranslation('screens', { keyPrefix: 'send.tipCheckbox' })
  const { currency } = useCurrencySelector()

  const isInternalDisabled = isDisabled || isLoading
  const isToggleDisabled = isInternalDisabled && !isChecked

  const handleOnPress = () => {
    if (isChecked) {
      navigation.navigate('SendTipUncheckedConfirmationModal', {
        onConfirmation: onCheckChange,
      })

      return
    }
    onCheckChange(!isChecked)
  }

  const handleEditPress = () => {
    if (!token) return

    navigation.navigate('SendTipCustomAmountModal', {
      token,
      minBn,
      customAmountBn,
      onSave: onCustomAmountChange,
    })
  }

  return (
    <View className={StyleHelper.mergeStyles('flex flex-col', className)}>
      <View className="flex flex-col rounded bg-green-700/50 p-4">
        <Pressable onPress={handleOnPress} disabled={isToggleDisabled} className="flex flex-row gap-x-4">
          <CheckboxPrimitive.Root
            checked={isChecked}
            onCheckedChange={handleOnPress}
            className={StyleHelper.mergeStyles('size-6 items-center justify-center rounded', {
              'border-2 border-neon': !isChecked,
              'bg-neon': isChecked,
            })}
            disabled={isToggleDisabled}
          >
            <CheckboxPrimitive.Indicator>
              <TbCheck aria-hidden className="size-5 text-gray-850" strokeWidth={3} />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          <View className="-mt-1 flex flex-1 gap-x-2">
            <Text className="font-sans-regular text-lg text-neon">
              {t(customAmountBn ? 'tipCustomAmountCheckboxLabel' : 'tipCheckboxLabel', {
                percentage: ConstantsHelper.tipPercentageBn.multipliedBy(100).toFixed(),
                amount: new BSBigHumanAmount(amountBn, token?.decimals).toFormatted(),
                tokenSymbol: token?.symbol,
                fiatAmount: CurrencyHelper.format(fiatPriceBn.toFixed(), { currency, maximumFractionDigits: 2 }),
              })}
            </Text>

            <Text className="font-sans-medium text-lg italic text-gray-400">{t('tipCheckboxOptionalLabel')}</Text>
          </View>
        </Pressable>

        <TwButton
          label={t('editButtonLabel')}
          variant="text-slim"
          colorSchema="neon"
          className="ml-auto h-6 flex-shrink-0"
          contentProps={{ className: 'w-fit flex-grow-0' }}
          labelProps={{ className: 'text-base' }}
          disabled={!isChecked}
          onPress={handleEditPress}
        />
      </View>

      {!!error && <TwAlertErrorBanner className="mt-4" message={error} />}
    </View>
  )
}
