import PropTypes from 'prop-types'
import React from 'react'
import { FlatList, ImageSourcePropType, ListRenderItemInfo } from 'react-native'

import { ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SelectorItem<T> {
  title?: string
  data: T
  onClick: (item: T) => void
  isSelected: (item: T) => boolean
  description?: string
  actionButtonImage?: ImageSourcePropType
  onActionPress?: (item: T) => void
}

export interface SelectorItemProps<T> {
  item: SelectorItem<T>
}

export interface SelectorListProps<T> {
  items: SelectorItem<T>[]
  separatorStyle: 'all' | 'in-between' | 'no-header' | 'no-footer' | 'header-only' | 'footer-only'
}

const SelectorItemComponent = <T extends unknown>(info: ListRenderItemInfo<SelectorItem<T>>) => {
  let title: string = ''

  if (typeof info.item.data === 'string') {
    title = info.item.data
  }

  if (info.item.title) {
    title = info.item.title
  }

  return (
    <ButtonWithoutFeedbackView onPress={() => info.item.onClick(info.item.data)}>
      <LinearLayout width="100%" orientation="horiz" alignItems="center" style={{ height: 60 }}>
        <LinearLayout orientation="horiz" weight={1}>
          <TextView color="text.0" fontSize="18px">
            {title}
          </TextView>
          {info.item.description && (
            <TextView color="text.14" fontSize="18px" marginLeft="4px">
              {info.item.description}
            </TextView>
          )}

          {info.item.actionButtonImage && (
            <ButtonWithoutFeedbackView onPress={() => info.item.onActionPress?.(info.item.data)}>
              <ImageView
                width={18}
                height={18}
                resizeMode="contain"
                source={info.item.actionButtonImage}
                marginLeft="8px"
              />
            </ButtonWithoutFeedbackView>
          )}
        </LinearLayout>
        {info.item.isSelected(info.item.data) ? (
          <ImageView
            width={20}
            height={20}
            resizeMode="contain"
            source={require('~src/assets/images/icon-check-green.png')}
          />
        ) : undefined}
      </LinearLayout>
    </ButtonWithoutFeedbackView>
  )
}

const SelectorItemSeparator = () => <LinearLayout width="100%" height="1px" bg="background.10" />

const SelectorList = <T extends unknown>(props: SelectorListProps<T>) => {
  const useMiddleSeparator = ['all', 'in-between', 'no-header', 'no-footer'].includes(props.separatorStyle)
  const useHeaderSeparator = ['all', 'no-footer', 'header-only'].includes(props.separatorStyle)
  const useFooterSeparator = ['all', 'no-header', 'footer-only'].includes(props.separatorStyle)

  return (
    <FlatList
      data={props.items}
      renderItem={SelectorItemComponent}
      ItemSeparatorComponent={useMiddleSeparator ? SelectorItemSeparator : undefined}
      ListHeaderComponent={useHeaderSeparator ? SelectorItemSeparator : undefined}
      ListFooterComponent={useFooterSeparator ? SelectorItemSeparator : undefined}
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
