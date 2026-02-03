import { Fragment } from 'react'

import { Text, View } from 'react-native'

import { TwDashedLine } from '@/components/TwDashedLine'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  steps: string[]
  className?: string
  textClassName?: string
  theme?: 'neon' | 'default'
  currentState?: 'success' | 'error'
  currentStep?: number
}

export const TwStepper = ({
  steps,
  className,
  textClassName,
  theme = 'default',
  currentState = 'success',
  currentStep = 1,
}: TProps) => (
  <View
    className={StyleHelper.mergeStyles('flex w-full flex-row items-center justify-center gap-x-1 px-6 pb-5', className)}
  >
    {steps.map((step, index) => {
      const fixedIndex = index + 1
      const isCurrentStep = fixedIndex === currentStep
      const isCurrentOrFutureStep = isCurrentStep || fixedIndex > currentStep
      const isPastStep = fixedIndex < currentStep
      const isFutureStep = fixedIndex > currentStep
      const isNeonTheme = theme === 'neon'
      const isDefaultTheme = theme === 'default'
      const isSuccessState = currentState === 'success'
      const isErrorState = currentState === 'error'

      return (
        <Fragment key={index}>
          <View className="relative">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-gray-800">
              <Text
                className={StyleHelper.mergeStyles(
                  'flex h-6 w-6 items-center justify-center rounded-full text-center font-sans-bold text-sm leading-6 transition-colors',
                  {
                    'bg-blue text-asphalt': isPastStep && isDefaultTheme,
                    'bg-gray-900 text-gray-300': isFutureStep && isDefaultTheme,
                    'bg-neon text-asphalt': isPastStep && isNeonTheme,
                    'bg-gray-300 text-asphalt': isFutureStep && isNeonTheme,
                    'bg-white text-asphalt': isCurrentStep && isSuccessState,
                    'bg-pink text-asphalt': isCurrentStep && isErrorState,
                  }
                )}
              >
                {fixedIndex}
              </Text>
            </View>

            <Text
              className={StyleHelper.mergeStyles(
                'absolute left-1/2 top-8 w-fit min-w-20 max-w-20 -translate-x-1/2 text-center font-sans-regular text-xs transition-colors',
                {
                  'text-blue': isPastStep && isDefaultTheme,
                  'text-neon': isPastStep && isNeonTheme,
                  'text-white': isCurrentStep && isSuccessState,
                  'text-pink': isCurrentStep && isErrorState,
                  'text-gray-300': isFutureStep,
                },
                textClassName
              )}
            >
              {step}
            </Text>
          </View>

          {fixedIndex < steps.length && (
            <TwDashedLine
              width={`${100 / steps.length}%`}
              className={StyleHelper.mergeStyles({
                'text-blue': isPastStep && isDefaultTheme,
                'text-gray-900': isCurrentOrFutureStep && isDefaultTheme,
                'text-neon': isPastStep && isNeonTheme,
                'text-gray-300': isCurrentOrFutureStep && isNeonTheme,
              })}
            />
          )}
        </Fragment>
      )
    })}
  </View>
)
