import React, { forwardRef } from 'react'

import { useTranslation } from 'react-i18next'
import type { TextInputProps } from 'react-native'
import { TextInput, View } from 'react-native'

import type { TTwButtonProps } from '@/components/TwButton'
import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = TextInputProps & {
  disabled?: boolean
  error?: boolean
  containerClassName?: string
  maxButtonProps?: TTwButtonProps
}

export const ActionInput = forwardRef<TextInput, TProps>(
  ({ disabled, className, error, containerClassName, maxButtonProps, ...props }, ref) => {
    const { t } = useTranslation('components', { keyPrefix: 'actionInput' })

    return (
      <View className={StyleHelper.mergeStyles('h-11 flex-row', containerClassName)}>
        <TextInput
          className={StyleHelper.mergeStyles(
            'h-full w-32 rounded-l bg-gray-700 px-2 text-right font-sans-regular text-lg text-neon placeholder:text-gray-300',
            {
              'opacity-50': disabled,
              'text-pink': error,
            },
            className
          )}
          editable={false}
          ref={ref}
          {...props}
        />

        {maxButtonProps && (
          <TwButton
            {...maxButtonProps}
            label={t('maxButtonLabel')}
            variant="contained-darker"
            className={StyleHelper.mergeStyles(
              'h-full w-fit rounded rounded-bl-none rounded-tl-none',
              maxButtonProps.className
            )}
            contentProps={{
              ...maxButtonProps.contentProps,
              className: StyleHelper.mergeStyles('px-2', maxButtonProps.contentProps?.className),
            }}
          />
        )}
      </View>
    )
  }
)
