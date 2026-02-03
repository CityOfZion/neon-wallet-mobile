import { Fragment, useEffect, useState } from 'react'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import type { JSX, ReactElement, ReactNode } from 'react'
import type { RefreshControlProps, ScrollViewProps, ViewProps } from 'react-native'
import { ScrollView, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { TwScreenLayoutBars } from './TwScreenLayoutBars'
import { TwScreenLayoutHeader } from './TwScreenLayoutHeader'

type TProps = {
  title?: ReactNode
  rightElement?: JSX.Element
  leftElement?: JSX.Element
  withoutHeader?: boolean
  withoutBackButton?: boolean
  withoutScroll?: boolean
  withoutBars?: boolean
  refreshControl?: ReactElement<RefreshControlProps>
  containerProps?: ViewProps
  headerClassName?: string
  onBack?(): void
} & ScrollViewProps

export const TwScreenLayout = ({
  children,
  withoutHeader = false,
  withoutBackButton = false,
  rightElement,
  leftElement,
  headerClassName,
  refreshControl,
  title,
  className,
  contentContainerClassName,
  containerProps,
  withoutScroll,
  withoutBars,
  onBack,
  ...props
}: TProps) => {
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setShouldShow(true)
      return
    }

    let rootNavigation = navigation

    while (true) {
      const parent = rootNavigation.getParent()
      if (!parent) break
      rootNavigation = parent
    }

    const state = rootNavigation.getState()
    if (!state) {
      setShouldShow(true)
      return
    }

    const route = state.routes[state.index]

    if (route.key.toLowerCase().includes('modal')) {
      setShouldShow(true)
    } else {
      setShouldShow(false)
    }
  }, [isFocused, navigation])

  return (
    <View {...containerProps} className={StyleHelper.mergeStyles('flex-grow bg-asphalt', containerProps?.className)}>
      {shouldShow && (
        <Fragment>
          {!withoutBars && <TwScreenLayoutBars />}

          {!withoutHeader && (
            <TwScreenLayoutHeader
              rightElement={rightElement}
              leftElement={leftElement}
              withoutBackButton={withoutBackButton}
              title={title}
              className={headerClassName}
              onBack={onBack}
            />
          )}

          {withoutScroll ? (
            <View
              className={StyleHelper.mergeStyles(
                'w-full flex-1 items-center px-3.5 pb-4.5 pt-3.5',
                contentContainerClassName
              )}
              {...props}
            >
              {children}
            </View>
          ) : (
            <ScrollView
              refreshControl={refreshControl}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              className={StyleHelper.mergeStyles('flex-1', className)}
              contentContainerClassName={StyleHelper.mergeStyles(
                'pt-3.5 pb-4.5 px-3.5 flex-grow',
                contentContainerClassName
              )}
              {...props}
            >
              {children}
            </ScrollView>
          )}
        </Fragment>
      )}
    </View>
  )
}
