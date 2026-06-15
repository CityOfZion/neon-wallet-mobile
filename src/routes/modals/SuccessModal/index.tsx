import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useModalErase } from '@/hooks/useModalErase'

import { ModalLayout } from '@/layouts/ModalLayout'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SuccessModal = ({ route }: TRootStackScreenProps<'SuccessModal'>) => {
  const { buttonLabel, content, title, className, titleClassName, onClose } = route.params
  const { handleErase } = useModalErase()

  const handleClose = () => {
    if (onClose) onClose()
    else handleErase()
  }

  return (
    <ModalLayout.Root onRequestClose={handleClose}>
      <ModalLayout.Header>
        <ModalLayout.Title className={titleClassName}>{title}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={handleClose} />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="items-center">
        <PiSealCheck className="mt-3.5 size-32 text-blue" aria-hidden />

        <View className={StyleHelper.mergeStyles('my-7 w-full flex-shrink flex-grow items-center', className)}>
          {ElementHelper.isTextContentValid(content) ? (
            <Text className="text-center font-sans-medium text-2xl text-white">{content}</Text>
          ) : (
            content
          )}
        </View>

        {buttonLabel && (
          <View className="w-full gap-7">
            <TwSeparator />

            <TwButton label={buttonLabel} className="w-full" variant="contained-light" onPress={handleClose} />
          </View>
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
