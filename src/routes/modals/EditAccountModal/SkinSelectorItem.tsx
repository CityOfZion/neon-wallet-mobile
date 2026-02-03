import { Dimensions, type PressableProps, View, type ViewStyle } from 'react-native'

import { PressableScale } from '@/components/PressableScale'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdCheckCircle from '@/assets/images/md-check-circle.svg'

type TItemProps = {
  isSelected: boolean
  children?: React.ReactNode
  style?: ViewStyle
} & PressableProps

export const SKIN_CONTAINER_GAP = 8
export const SKIN_CONTAINER_WINDOW_SIZE = Dimensions.get('window').width - 40

const MIN_ITEM_SIZE = 72
export const MAX_ITEM_ROW = Math.floor(SKIN_CONTAINER_WINDOW_SIZE / (MIN_ITEM_SIZE + SKIN_CONTAINER_GAP))
export const SKIN_ITEM_SIZE = (SKIN_CONTAINER_WINDOW_SIZE - SKIN_CONTAINER_GAP * (MAX_ITEM_ROW - 1)) / MAX_ITEM_ROW

export const SkinSelectorItem = ({ isSelected, className, children, style, ...props }: TItemProps) => {
  return (
    <PressableScale
      className={StyleHelper.mergeStyles(
        'overflow-hidden rounded-lg border border-transparent bg-gray-800',
        { 'border-white': isSelected },
        className
      )}
      style={[{ height: SKIN_ITEM_SIZE, width: SKIN_ITEM_SIZE }, style]}
      {...props}
    >
      <View
        className="size-full"
        style={{ boxShadow: '1.5px 1.5px 0px 0px #FFFFFF80 inset, -1.5px -1.5px 0px 0px #1A202659 inset' }}
      >
        {children}

        {isSelected && (
          <MdCheckCircle
            className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-white"
            aria-hidden
          />
        )}
      </View>
    </PressableScale>
  )
}
