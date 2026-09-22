import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useActions } from '@/hooks/useActions'
import { useDebounceFunction } from '@/hooks/useDebounceFunction'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  amount: string
  isAmountLoading: boolean
}

export const SendTipCustomAmountModal = ({ navigation, route }: TRootStackScreenProps<'SendTipCustomAmountModal'>) => {
  const { token, minBn, customAmountBn, onSave: onConfirm } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'sendTipCustomAmount' })
  const { t: tCommon } = useTranslation('common')

  const debounce = useDebounceFunction()

  const { actionData, actionState, setData, setError } = useActions<TActionsData>({
    amount: customAmountBn?.toFixed() || '',
    isAmountLoading: false,
  })

  const isDisabled = !actionData.amount || actionData.isAmountLoading || !actionState.isValid

  const tipPercentage = ConstantsHelper.tipPercentageBn.multipliedBy(100).toFixed()

  const handleChangeAmount = (amount: string) => {
    const isAmountLoading = !!amount

    setData({ amount, isAmountLoading })

    debounce(() => {
      if (!isAmountLoading) return

      const amountBn = new BSBigHumanAmount(amount, token.decimals)

      setData({ amount: amountBn.toFormatted(), isAmountLoading: false })

      if (amountBn.isLessThan(minBn)) {
        setError(
          'amount',
          t('minAmountError', {
            amount: new BSBigHumanAmount(minBn, token.decimals).toFormatted(),
            tokenSymbol: token.symbol,
          })
        )
      }
    })
  }

  const handleSave = () => {
    onConfirm(new BSBigHumanAmount(actionData.amount, token.decimals))
    navigation.goBack()
  }

  const handleReset = () => {
    onConfirm(undefined)
    navigation.goBack()
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      <ModalLayout.KeyboardAvoidingContent>
        <Text className="mb-7 font-sans-regular text-base text-gray-100">
          {t('description', { percentage: tipPercentage })}
        </Text>

        <TwInput
          label={t('amountInputLabel')}
          placeholder={t('amountInputPlaceholder')}
          keyboardType="decimal-pad"
          value={actionData.amount}
          onChangeText={handleChangeAmount}
          error={actionState.errors.amount}
          loading={actionData.isAmountLoading}
          rightElement={<Text className="font-sans-regular text-lg uppercase text-white">{token.symbol}</Text>}
          clearable
        />

        <ModalLayout.KeyboardAvoidingArea className="gap-4 pt-7">
          <TwButton
            variant="text"
            label={t('resetButtonLabel', {
              percentage: tipPercentage,
            })}
            onPress={handleReset}
          />

          <TwButton
            variant="contained-light"
            label={tCommon('general.save')}
            onPress={handleSave}
            disabled={isDisabled}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}
