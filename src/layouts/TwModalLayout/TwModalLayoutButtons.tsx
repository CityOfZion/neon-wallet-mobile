import { useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent } from 'react-native'

import type { TTwButtonProps } from '@/components/TwButton'
import { TwButton } from '@/components/TwButton'
import type { TTwIconButtonProps } from '@/components/TwIconButton'
import { TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdClose from '@/assets/images/md-close.svg'

export const TwModalLayoutCloseIconButton = ({ onPress, ...props }: Omit<TTwIconButtonProps, 'icon'>) => {
  const { t } = useTranslation('components', { keyPrefix: 'twModalLayoutCloseIconButton' })
  const navigation = useNavigation()

  const disableButton = useRef(false)

  const handlePress = (event: GestureResponderEvent) => {
    if (!navigation.canGoBack() || disableButton.current) return

    disableButton.current = true

    if (onPress) {
      onPress(event)
      return
    }

    navigation.goBack()
  }

  return (
    <TwIconButton
      {...props}
      icon={<MdClose className="text-white" aria-hidden />}
      onPress={handlePress}
      aria-label={t('labels.closeButton')}
    />
  )
}

export const TwModalLayoutButton = ({ labelProps, contentProps, ...props }: TTwButtonProps) => {
  return (
    <TwButton
      contentProps={{ ...contentProps, className: StyleHelper.mergeStyles('px-5', contentProps?.className) }}
      labelProps={{ ...labelProps, className: StyleHelper.mergeStyles('text-base', labelProps?.className) }}
      variant="text"
      {...props}
    />
  )
}
