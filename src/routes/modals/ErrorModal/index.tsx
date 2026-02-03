import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useModalErase } from '@/hooks/useModalErase'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOutlineCancel from '@/assets/images/md-outline-cancel.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ErrorModal = ({ route }: TRootStackScreenProps<'ErrorModal'>) => {
  const { buttonProps, content, title, onClose } = route.params
  const { handleErase } = useModalErase()

  const handleClose = () => {
    if (onClose) onClose()
    else handleErase()
  }

  return (
    <TwModalLayout
      title={title}
      onRequestClose={handleClose}
      rightElement={<TwModalLayoutCloseIconButton onPress={handleClose} />}
      contentContainerClassName="items-center"
    >
      <MdOutlineCancel className="mt-3.5 size-32 text-pink" aria-hidden />

      <View className="my-7 w-full flex-shrink flex-grow items-center">
        {typeof content === 'string' ? (
          <Text className="text-center font-sans-medium text-2xl text-white">{content}</Text>
        ) : (
          content
        )}
      </View>

      {buttonProps && (
        <View className="w-full gap-7">
          <TwSeparator />

          <TwButton
            onPress={handleClose}
            {...buttonProps}
            className={StyleHelper.mergeStyles('w-full', buttonProps?.className)}
            variant="contained-light"
          />
        </View>
      )}
    </TwModalLayout>
  )
}
