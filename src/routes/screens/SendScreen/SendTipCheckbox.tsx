import { BSBigNumberHelper, type TBSToken } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import * as CheckboxPrimitive from '@rn-primitives/checkbox'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbCheck from '@/assets/images/tb-check.svg'

type TProps = {
  amountBn: BigNumber
  fiatPriceBn: BigNumber
  isChecked: boolean
  isDisabled: boolean
  isLoading: boolean
  className?: string
  tokenSymbol?: TBSToken
  onCheckChange: (isChecked: boolean) => void
}

export const SendTipCheckbox = ({
  className,
  amountBn,
  fiatPriceBn,
  tokenSymbol,
  isDisabled,
  isChecked,
  isLoading,
  onCheckChange,
}: TProps) => {
  const navigation = useNavigation()
  const { t } = useTranslation('screens', { keyPrefix: 'sendScreen.tipCheckbox' })
  const { currency } = useCurrencySelector()

  const isInternalDisabled = isDisabled || isLoading

  const handleOnPress = () => {
    if (isChecked) {
      navigation.navigate('SendTipUncheckedConfirmationModal', {
        onConfirmation: onCheckChange,
      })

      return
    }
    onCheckChange(!isChecked)
  }

  return (
    <Pressable
      onPress={handleOnPress}
      disabled={isInternalDisabled}
      className={StyleHelper.mergeStyles('flex flex-row gap-x-4 bg-green-700 p-4', className)}
    >
      <CheckboxPrimitive.Root
        checked={isChecked}
        onCheckedChange={handleOnPress}
        className={StyleHelper.mergeStyles('size-6 items-center justify-center rounded', {
          'border-2 border-neon': !isChecked,
          'bg-neon': isChecked,
        })}
        disabled={isInternalDisabled}
      >
        <CheckboxPrimitive.Indicator>
          <TbCheck aria-hidden className="size-5 text-gray-850" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <View className="flex flex-1 gap-x-2">
        <Text className="text-lg text-neon">
          {t('tipCheckboxLabel', {
            amount: BSBigNumberHelper.format(amountBn, { decimals: tokenSymbol?.decimals }),
            tokenSymbol: tokenSymbol?.symbol,
            fiatAmount: CurrencyHelper.format(fiatPriceBn.toFixed(), { currency, maximumFractionDigits: 2 }),
          })}
        </Text>
        <Text className="text-lg italic text-gray-400">{t('tipCheckboxOptionalLabel')}</Text>
      </View>
    </Pressable>
  )
}
