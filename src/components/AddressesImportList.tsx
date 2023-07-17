import i18n from 'i18n-js'
import React, { useState } from 'react'
import { View, ScrollView, FlatList, Image, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainHelper } from '../helpers/BlockchainHelper'
import { RootState } from '../store/RootStore'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey } from '~src/blockchain'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export type AddressInfo = { address: string; blockchain: BlockchainServiceKey }

export type AddressesImportListProps<T extends AddressInfo> = {
  blockSelection?: boolean
  items: T[]
  selectedItems: T[]
  onSelect: (items: T[], item: T) => void
  onDeselect: (items: T[], item: T) => void
}

export type AddressImportItemProps<T extends AddressInfo> = {
  item: T
  blockSelection?: boolean
  isSelected: boolean
  onSelect: (data: T) => void
  onDeselect: (data: T) => void
}

const AddressImportItem = <T extends AddressInfo = AddressInfo>(props: AddressImportItemProps<T>) => {
  const handleClick = () => {
    if (!props.blockSelection) return

    const newSelected = !props.isSelected

    if (newSelected) {
      props.onSelect(props.item)
    } else {
      props.onDeselect(props.item)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          marginVertical: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flexGrow: 1, flexShrink: 1 }}>
          <Image
            style={{ width: 25, height: 26 }}
            source={BlockchainHelper.getIcon(props.item.blockchain)}
            width={25}
            height={26}
          />
          <View style={{ flexGrow: 1, flexShrink: 1, marginHorizontal: 10 }}>
            <TextView fontSize="10px" color="text.3">
              {i18n.t(`blockchainServices.${props.item.blockchain}.label`)}
            </TextView>
            <TextView color="text.0" fontFamily="medium" fontSize="14px" numberOfLines={1} ellipsizeMode="middle">
              {props.item.address}
            </TextView>
          </View>
        </View>
        {(props.isSelected ?? !props.blockSelection) && (
          <Image source={require('~src/assets/images/icon-check-green.png')} />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const AddressesImportList = <T extends AddressInfo = AddressInfo>({
  items,
  onDeselect,
  onSelect,
  selectedItems,
  blockSelection = true,
}: AddressesImportListProps<T>) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const handleSelect = (item: T) => {
    onSelect([...selectedItems, item], item)
  }

  const handleDeselect = (item: T) => {
    onDeselect(
      selectedItems.filter(i => i.address !== item.address),
      item
    )
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background[12],
        borderRadius: 5,
        paddingHorizontal: 8,
      }}
    >
      <ScrollView>
        <FlatList
          data={items}
          renderItem={({ item, index }) => (
            <AddressImportItem
              item={item}
              blockSelection={blockSelection}
              onDeselect={handleDeselect}
              isSelected={selectedItems.some(i => i.address === item.address)}
              onSelect={handleSelect}
            />
          )}
          ItemSeparatorComponent={() => <LinearLayout bg="text.1" height={1} />}
        />
      </ScrollView>
    </View>
  )
}

export default AddressesImportList
