import { useEffect, useRef, useState } from 'react'

import type { IBSWithMemo } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useDebounceFunction } from '@/hooks/useDebounceFunction'

import TbMessage from '@/assets/images/tb-message.svg'

import { ActionStep } from './ActionStep'
import { TwInput } from './TwInput'

export type TTransactionMemo = {
  isReady: boolean
  value?: string
}

type TProps = {
  service: IBSWithMemo
  className?: string
  memo?: TTransactionMemo
  disabled?: boolean
  errorMessage?: string
  onChange(memo: TTransactionMemo): void
}

export const TransactionMemoActionStep = ({ className, service, memo, disabled, errorMessage, onChange }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionMemoActionStep' })
  const debounce = useDebounceFunction()

  const [value, setValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const latestValueRef = useRef<string | null>('')

  const handleChange = (newValue: string) => {
    const value = newValue.trim() || undefined
    const isValid = !value || service.validateMemo(value)

    latestValueRef.current = newValue
    setValue(newValue)
    setIsInvalid(!isValid)
    onChange({ value: memo?.value, isReady: false })

    if (!isValid) return

    debounce(() => {
      if (latestValueRef.current !== newValue) return

      onChange({ value, isReady: true })
    })
  }

  useEffect(() => {
    if (memo) return

    latestValueRef.current = ''
    setValue('')
    setIsInvalid(false)
  }, [memo])

  useEffect(() => {
    return () => {
      latestValueRef.current = null
    }
  }, [])

  return (
    <View className={StyleHelper.mergeStyles('mt-3 rounded bg-gray-700/60 px-1 py-2', className)}>
      <ActionStep leftElement={<TbMessage aria-hidden className="text-blue" />} title={t('title')} className="gap-x-2">
        <Text className="font-sans-regular text-sm italic text-gray-300">{t('optionalLabel')}</Text>
      </ActionStep>

      <View className="px-2 pb-2">
        <TwInput
          value={value}
          placeholder={t('placeholder')}
          pastable
          disabled={disabled}
          error={isInvalid ? t('invalidMemo') : errorMessage}
          onChangeText={handleChange}
        />
      </View>
    </View>
  )
}
