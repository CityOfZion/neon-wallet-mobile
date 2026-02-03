import { cloneElement, useState } from 'react'

import type { JSX, ReactNode } from 'react'
import type { NativeSyntheticEvent } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbCaretDown from '@/assets/images/tb-caret-down.svg'

type TProps = {
  title: string
  className?: string
  arrowClassName?: string
  leftElement?: ReactNode
  children: JSX.Element
}

export const Tooltip = ({ title, className, arrowClassName, leftElement, children }: TProps) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <View className="relative h-fit w-fit">
      {isOpened && (
        <View
          className={StyleHelper.mergeStyles(
            'absolute z-10 flex flex-row items-center gap-x-3 rounded bg-gray-900/90 p-3',
            className
          )}
        >
          {leftElement}
          <Text className="flex-shrink text-center font-sans-medium text-xs text-white">{title}</Text>
          <TbCaretDown
            aria-hidden
            className={StyleHelper.mergeStyles('absolute -bottom-4 mb-[1px] h-5 w-5 fill-gray-900/90', arrowClassName)}
          />
        </View>
      )}

      {cloneElement(children, {
        ...children.props,
        onFocus: (event: NativeSyntheticEvent<any>) => {
          setIsOpened(true)

          children.props.onFocus?.(event)
        },
        onBlur: (event: NativeSyntheticEvent<any>) => {
          setIsOpened(false)

          children.props.onBlur?.(event)
        },
      })}
    </View>
  )
}
