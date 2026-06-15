import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ElementHelper } from '@/helpers/ElementHelper'

import { useModalErase } from '@/hooks/useModalErase'

import { ModalLayout } from '@/layouts/ModalLayout'

import MdOutlineCancel from '@/assets/images/md-outline-cancel.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ErrorModal = ({ route }: TRootStackScreenProps<'ErrorModal'>) => {
  const { buttonLabel, content, title, onClose } = route.params
  const { handleErase } = useModalErase()

  const handleClose = () => {
    if (onClose) onClose()
    else handleErase()
  }

  return (
    <ModalLayout.Root onRequestClose={handleClose}>
      <ModalLayout.Header>
        <ModalLayout.Title>{title}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={handleClose} />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="items-center">
        <MdOutlineCancel className="mt-3.5 size-32 text-pink" aria-hidden />

        <View className="my-7 w-full flex-shrink flex-grow items-center">
          {ElementHelper.isTextContentValid(content) ? (
            <Text className="text-center font-sans-medium text-2xl text-white">{content}</Text>
          ) : (
            content
          )}
        </View>

        {buttonLabel && (
          <View className="w-full gap-7">
            <TwSeparator />

            <TwButton label={buttonLabel} onPress={handleClose} className="w-full" variant="contained-light" />
          </View>
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
