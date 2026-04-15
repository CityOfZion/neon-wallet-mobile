import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'

import TbCheck from '@/assets/images/tb-check.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TSecurity, TSecurityType } from '@/types/store'

type TProps = {
  currentSecurity: TSecurity
  securityType: TSecurityType
  disabled?: boolean
  label: string
  onPress?: () => void
  onRemove?: () => void
}

export const SecuritySelectionModalButton = ({
  securityType,
  disabled,
  label,
  onPress,
  onRemove,
  currentSecurity,
}: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'securitySelection' })
  const isSelected = currentSecurity.type === securityType

  return (
    <TwMenuButton
      disabled={disabled}
      onPress={isSelected ? undefined : onPress}
      label={label}
      subtitle={
        isSelected ? (
          <View className="flex-grow flex-row">
            <TwButton
              label={t('removeNfiButtonLabel')}
              colorSchema="pink"
              variant="text-slim"
              onPress={onRemove}
              disabled={disabled}
            />
          </View>
        ) : undefined
      }
      leftElement={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
      rightElement={isSelected ? <TbCheck aria-hidden className="h-6 w-6 text-neon" /> : undefined}
    />
  )
}
