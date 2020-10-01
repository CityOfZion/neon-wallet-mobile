import PropTypes from 'prop-types'
import React from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  TouchableWithoutFeedback,
} from 'react-native'

import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface SelectorItem<T> {
  title?: string
  data: T
  onClick: (item: T) => void
  isSelected: (item: T) => boolean
}

export interface SelectorItemProps<T> {
  item: SelectorItem<T>
}

export interface SelectorListProps<T> {
  items: SelectorItem<T>[]
  separatorStyle:
    | 'all'
    | 'in-between'
    | 'no-header'
    | 'no-footer'
    | 'header-only'
    | 'footer-only'
}

const SelectorItemComponent = <T extends unknown>(
  info: ListRenderItemInfo<SelectorItem<T>>
) => {
  let title: string = ''

  if (typeof info.item.data === 'string') {
    title = info.item.data
  }

  if (info.item.title) {
    title = info.item.title
  }

  return (
    <TouchableWithoutFeedback onPress={() => info.item.onClick(info.item.data)}>
      <LinearLayout
        width="100%"
        orientation="horiz"
        alignItems="center"
        my="24px"
      >
        <TextView weight={1} color="text.0" fontSize="18px">
          {title}
        </TextView>
        {info.item.isSelected(info.item.data) ? (
          <ImageView
            w="30px"
            h="30px"
            resizeMode="contain"
            source={require('~src/assets/images/icon-check-green.png')}
          />
        ) : undefined}
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

const SelectorItemSeparator = () => (
  <LinearLayout width="100%" height="1px" bg="background.10" />
)

const SelectorList = <T extends unknown>(props: SelectorListProps<T>) => {
  const useMiddleSeparator = [
    'all',
    'in-between',
    'no-header',
    'no-footer',
  ].includes(props.separatorStyle)
  const useHeaderSeparator = ['all', 'no-footer', 'header-only'].includes(
    props.separatorStyle
  )
  const useFooterSeparator = ['all', 'no-header', 'footer-only'].includes(
    props.separatorStyle
  )

  return (
    <FlatList
      data={props.items}
      renderItem={SelectorItemComponent}
      ItemSeparatorComponent={
        useMiddleSeparator ? SelectorItemSeparator : undefined
      }
      ListHeaderComponent={
        useHeaderSeparator ? SelectorItemSeparator : undefined
      }
      ListFooterComponent={
        useFooterSeparator ? SelectorItemSeparator : undefined
      }
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

SelectorList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  separatorStyle: PropTypes.string,
}

SelectorList.defaultProps = {
  separatorStyle: 'in-between',
}

export default SelectorList
