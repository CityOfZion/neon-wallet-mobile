import React from 'react'
import {FlatList} from 'react-native'

import HeaderBar from '~src/components/HeaderBar'
import i18n from '~src/i18n'
import {TokenValue} from '~src/models/TokenValue'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export type SelectableItem = {
  title: string
  isSelected: boolean
  onItemSelected: () => void
}

const ListItem = (props: {item: SelectableItem}) => {
  return <TextView>{props.item.title}</TextView>
}

export const SettingsList = (props: {
  items: SelectableItem[]
  title: string
  iconName: any
  iconMarginRight: number
  iconMarginTop: number
  iconWidth: number
}) => {
  return (
    <LinearLayout p={5} height="100%">
      <HeaderBar
        title={props.title}
        image={props.iconName}
        showIcon={true}
        iconMarginRight={props.iconMarginRight}
        iconMarginTop={props.iconMarginTop}
        iconWidth={props.iconWidth}
      />
      <LinearLayout height={40} />
      <FlatList
        data={props.items}
        keyExtractor={(item) => item.title}
        ItemSeparatorComponent={() => <LinearLayout bg="text.2" height={1} />}
        renderItem={({item}) => <ListItem item={item} />}
      />
    </LinearLayout>
  )
}
