import React, { useState } from 'react'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextInputProps, ViewProps } from 'react-native'
import { Platform, Text, TextInput, View } from 'react-native'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { QrCodeScanModalHelper } from '@/helpers/QrCodeScanModalHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdCancel from '@/assets/images/md-cancel.svg'
import MdVisibility from '@/assets/images/md-visibility.svg'
import MdVisibilityOff from '@/assets/images/md-visibility-off.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
import TbQrcode from '@/assets/images/tb-qrcode.svg'

import { Loader } from './Loader'
import { TwIconButton } from './TwIconButton'
import { TwInputLabel } from './TwInputLabel'

export type TTwInputProps = {
  label?: string
  labelDescription?: string
  disabled?: boolean
  containerProps?: ViewProps
  inputContainerProps?: ViewProps
  actionsContainerProps?: ViewProps
  clearable?: boolean
  pastable?: boolean
  scannable?: boolean
  loading?: boolean
  onScan?: (data: string) => void
  error?: string
  success?: string
  leftElement?: ReactNode
  rightElement?: ReactNode
} & TextInputProps

export const TwInput = ({
  value,
  disabled = false,
  containerProps,
  inputContainerProps,
  actionsContainerProps,
  clearable = false,
  pastable = false,
  scannable = false,
  loading = false,
  className,
  label,
  labelDescription,
  error,
  success,
  secureTextEntry,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  onScan,
  leftElement,
  rightElement,
  ...props
}: TTwInputProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'twInput' })

  const [secureTextEntryInternal, setSecureTextEntryInternal] = useState<boolean | undefined>(secureTextEntry)

  const handleClear = () => {
    props.onChangeText?.('')
  }

  const handlePaste = async () => {
    const valueFromClipboard = await ClipboardHelper.get()
    props.onChangeText?.(valueFromClipboard)
  }

  const handleScan = async () => {
    QrCodeScanModalHelper.show({
      onScan: (data: string) => {
        if (!data) return

        if (onScan) {
          onScan(data)
          return
        }

        props.onChangeText?.(data)
      },
    })
  }

  return (
    <View {...containerProps}>
      {label && <TwInputLabel label={label} description={labelDescription} />}

      <View
        {...inputContainerProps}
        className={StyleHelper.mergeStyles(
          'w-full flex-row items-center gap-2 rounded-lg border border-transparent bg-asphalt pl-5 pr-3',
          {
            'opacity-50': disabled,
            'border-pink': !!error,
            'border-neon': !!success,
            'py-2': props.multiline,
          },
          inputContainerProps?.className
        )}
      >
        {leftElement}

        <TextInput
          className={StyleHelper.mergeStyles(
            'h-[52px] flex-1 font-sans-regular text-[1.125rem] text-white placeholder:text-gray-300',
            {
              'pt-3.5': Platform.OS === 'ios' && props.multiline,
              'max-h-[52px]': !props.multiline,
            },
            className
          )}
          value={value}
          editable={!disabled}
          secureTextEntry={secureTextEntryInternal}
          autoComplete={secureTextEntry ? 'off' : autoComplete}
          autoCorrect={secureTextEntry ? false : autoCorrect}
          autoCapitalize={secureTextEntry ? 'none' : autoCapitalize}
          returnKeyType="done"
          clearTextOnFocus={false}
          {...props}
        />

        {(clearable || pastable || scannable || secureTextEntry || loading) && (
          <View
            {...actionsContainerProps}
            className={StyleHelper.mergeStyles('h-full flex-row items-center', actionsContainerProps?.className)}
          >
            {secureTextEntry && (
              <TwIconButton
                onPress={() => setSecureTextEntryInternal(prev => !prev)}
                aria-label={secureTextEntryInternal ? t('labels.showButton') : t('labels.hideButton')}
                icon={
                  secureTextEntryInternal ? (
                    <MdVisibility className="text-gray-100/50" aria-hidden />
                  ) : (
                    <MdVisibilityOff className="text-gray-100/50" aria-hidden />
                  )
                }
                size="sm"
              />
            )}

            {loading && <Loader className="mx-3" />}

            {clearable && (
              <TwIconButton
                onPress={handleClear}
                className="mx-0 w-fit px-0"
                icon={<MdCancel className="text-gray-100/50" aria-hidden />}
                size="sm"
                aria-label={t('labels.clearButton')}
              />
            )}

            {pastable && (
              <TwIconButton
                onPress={handlePaste}
                size="sm"
                icon={<TbCopy className="text-neon" />}
                aria-label={t('labels.clearButton')}
              />
            )}

            {scannable && (
              <TwIconButton
                onPress={handleScan}
                size="sm"
                icon={<TbQrcode className="text-neon" />}
                aria-label={t('labels.clearButton')}
              />
            )}
          </View>
        )}

        {rightElement}
      </View>

      {error && <Text className="-ml-1 mt-1 w-full text-right text-sm text-pink">{error}</Text>}
      {success && <Text className="-ml-1 mt-1 w-full text-right text-sm text-neon">{success}</Text>}
    </View>
  )
}
