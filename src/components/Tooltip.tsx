import { cloneElement, createContext, useContext, useEffect, useId, useRef, useState } from 'react'

import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react'
import type { GestureResponderEvent, LayoutChangeEvent, ViewProps, ViewStyle } from 'react-native'
import { Modal, Pressable, StatusBar, Text, useWindowDimensions, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

type TRootContextValue = {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  triggerRef: React.RefObject<View | null>
  nativeId: string
} & Omit<TRootProps, 'children'>

type TRootProps = {
  children: ReactNode
  type: 'press' | 'focus'
}

type TTriggerProps = {
  children: JSX.Element
}

type TContentProps = ViewProps

const TooltipContext = createContext<TRootContextValue | null>(null)
export const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip compound components cannot be rendered outside the Tooltip.Root component')
  }

  return context
}

const Root = ({ children, type }: TRootProps) => {
  const nativeId = useId()

  const [visible, setVisible] = useState(false)

  const triggerRef = useRef<View>(null)

  useEffect(() => {
    return () => {
      setVisible(false)
    }
  }, [])

  return (
    <View className="relative">
      <TooltipContext.Provider value={{ visible, setVisible, triggerRef, type, nativeId }}>
        {children}
      </TooltipContext.Provider>
    </View>
  )
}

const Trigger = ({ children }: TTriggerProps) => {
  const { setVisible, triggerRef, visible, nativeId, type } = useTooltipContext()

  let Component: JSX.Element

  if (type === 'press') {
    Component = cloneElement(children, {
      ...children.props,
      role: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': visible,
      'aria-describedby': nativeId,
      ref: triggerRef,
      onPress: (event: any) => {
        setVisible(prev => !prev)
        children.props.onFocus?.(event)
      },
    })
  } else {
    Component = cloneElement(children, {
      ...children.props,
      ref: triggerRef,
      role: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': visible,
      'aria-describedby': nativeId,
      onFocus: (event: GestureResponderEvent) => {
        setVisible(true)
        children.props.onFocus?.(event)
      },
      onBlur: (event: GestureResponderEvent) => {
        setVisible(false)
        children.props.onBlur?.(event)
      },
    })
  }

  return Component
}

const ContentPress = ({ children, className, ...props }: TContentProps) => {
  const { visible, setVisible, triggerRef, nativeId } = useTooltipContext()
  const windowDimensions = useWindowDimensions()
  const [style, setStyle] = useState<ViewStyle>()
  const [arrowStyle, setArrowStyle] = useState<ViewStyle>()

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!triggerRef.current) return

    const contentWidth = event.nativeEvent.layout.width
    const contentHeight = event.nativeEvent.layout.height

    triggerRef.current.measureInWindow((x, y, width) => {
      const triggerCenterX = x + width / 2
      const spaceOnLeft = triggerCenterX
      const spaceOnRight = windowDimensions.width - triggerCenterX

      let left: number

      const halfContentWidth = contentWidth / 2

      if (spaceOnLeft >= halfContentWidth && spaceOnRight >= halfContentWidth) {
        left = triggerCenterX - halfContentWidth
      } else if (spaceOnRight >= contentWidth) {
        left = x
      } else if (spaceOnLeft >= contentWidth) {
        left = x + width - contentWidth
      } else {
        left = spaceOnRight > spaceOnLeft ? 8 : windowDimensions.width - contentWidth - 8
      }

      const arrowLeft = triggerCenterX - left

      setStyle({
        top: y + StatusBar.currentHeight! - contentHeight - 4,
        left,
        maxWidth: windowDimensions.width - 16,
      })
      setArrowStyle({ marginLeft: arrowLeft - 8 })
    })
  }

  return (
    <Modal visible={visible} onRequestClose={() => setVisible(false)} transparent animationType="fade">
      {visible && (
        <Pressable className="relative h-full w-full bg-black/80" onPress={() => setVisible(false)}>
          <View
            onLayout={handleLayout}
            className="absolute"
            style={style}
            role="tooltip"
            nativeID={nativeId}
            aria-modal={false}
          >
            <View
              className={StyleHelper.mergeStyles('flex-row rounded-lg bg-gray-800 px-2 py-1', className)}
              {...props}
            >
              {typeof children === 'object' ? (
                children
              ) : (
                <Text className="font-sans-regular text-sm text-white">{children}</Text>
              )}
            </View>

            <Svg viewBox="0 0 26 14" className="ml-2 h-2 w-4 fill-gray-800 stroke-gray-800" style={arrowStyle}>
              <Path strokeWidth={2} d="m1 1 12 12L25 1H1Z" />
            </Svg>
          </View>
        </Pressable>
      )}
    </Modal>
  )
}

const ContentFocus = ({ children, className, ...props }: TContentProps) => {
  const { visible, triggerRef, nativeId } = useTooltipContext()
  const [style, setStyle] = useState<ViewStyle>()
  const [arrowStyle, setArrowStyle] = useState<ViewStyle>()
  const windowDimensions = useWindowDimensions()

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!triggerRef.current) return

    const contentWidth = event.nativeEvent.layout.width
    const contentHeight = event.nativeEvent.layout.height

    triggerRef.current.measure((_fx, _fy, width, _height, px, _py) => {
      const triggerCenterX = width / 2
      const spaceOnLeft = px + triggerCenterX
      const spaceOnRight = windowDimensions.width - (px + triggerCenterX)

      let leftOffset: number

      const halfContentWidth = contentWidth / 2

      if (spaceOnLeft >= halfContentWidth && spaceOnRight >= halfContentWidth) {
        // Center relative to trigger
        leftOffset = triggerCenterX - halfContentWidth
      } else if (spaceOnRight >= contentWidth) {
        // Align to left edge of trigger
        leftOffset = 0
      } else if (spaceOnLeft >= contentWidth) {
        // Align to right edge of trigger
        leftOffset = width - contentWidth
      } else {
        // Align based on available space, relative to trigger
        leftOffset = spaceOnRight > spaceOnLeft ? 0 : width - contentWidth
      }

      const arrowLeft = triggerCenterX - leftOffset

      setStyle({
        top: -contentHeight - 4,
        left: leftOffset,
        maxWidth: windowDimensions.width - 16,
      })
      setArrowStyle({ marginLeft: arrowLeft - 8 })
    })
  }

  if (!visible) return null

  return (
    <View
      onLayout={handleLayout}
      className="absolute z-[100]"
      style={style}
      role="tooltip"
      nativeID={nativeId}
      aria-modal={false}
    >
      <View
        className={StyleHelper.mergeStyles(
          'w-full flex-shrink flex-row rounded-lg bg-gray-900/90 px-2 py-1',
          className
        )}
        {...props}
      >
        {typeof children === 'object' ? (
          children
        ) : (
          <Text className="font-sans-regular text-sm text-white">{children}</Text>
        )}
      </View>

      <Svg viewBox="0 0 26 14" className="ml-2 h-2 w-4 fill-gray-900/90 stroke-gray-900/90" style={arrowStyle}>
        <Path strokeWidth={2} d="m1 1 12 12L25 1H1Z" />
      </Svg>
    </View>
  )
}

const Content = (props: TContentProps) => {
  const { type } = useTooltipContext()

  if (type === 'press') {
    return <ContentPress {...props} />
  }

  return <ContentFocus {...props} />
}

export const Tooltip = { Root, Trigger, Content }
