import i18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { TouchableWithoutFeedback, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { selectAccounts } from '../store/account/SelectorAccount'

import { blockchainList, BlockchainServiceKey, getBlockchainLogo } from '~src/blockchain'
import { SearchBar } from '~src/components/SearchBar'
import { Wallet } from '~src/models/redux/Wallet'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface IBlockchainList {
  onSelect: (items: BlockchainServiceKey[]) => void
  isMulti?: boolean
  hideQtyAccounts?: boolean
  wallet?: Wallet
}

interface IBlockchainItem {
  item: BlockchainServiceKey
  onPress: (item: BlockchainServiceKey) => void
  isSelected: boolean
  wallet?: Wallet
  hideQtyAccounts?: boolean
}

const BlockchainItem = ({ onPress, item, isSelected, hideQtyAccounts, wallet }: IBlockchainItem) => {
  const accounts = useSelector(selectAccounts)

  const handlePress = () => {
    onPress(item)
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <LinearLayout marginY="10px" orientation="horiz" alignItems="center" justifyContent="space-between">
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView style={{ marginRight: 10, height: 29, width: 28 }} source={getBlockchainLogo(item)} />
          <LinearLayout>
            <TextView fontSize="9px" color="text.6">
              {i18n.t(`blockchainServices.${item}.id`)}
            </TextView>
            <TextView fontFamily="bold" fontSize="16px" color="text.0">
              {i18n.t(`blockchainServices.${item}.label`)}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        {isSelected && !hideQtyAccounts && wallet && (
          <TextView color="text.6" fontSize="14px">
            {i18n.t('modals.blockchainList.xExisting', {
              amount: wallet.getAccounts(accounts).filter(account => account.blockchain === item).length,
            })}
          </TextView>
        )}

        {isSelected && (
          <ImageView style={{ width: 21, height: 21 }} source={require('~src/assets/images/icon-check-green.png')} />
        )}
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

const BlockchainList = ({ isMulti, hideQtyAccounts, onSelect, wallet }: IBlockchainList) => {
  const [blockchainSelected, setBlockchainSelected] = useState<BlockchainServiceKey[]>(
    isMulti ? blockchainList : ['neo3']
  )
  const [filter, setFilter] = useState<string>('')
  const [blockchainFiltered, setBlockchainFiltered] = useState<BlockchainServiceKey[]>(blockchainList)

  const handlePress = (blockchain: BlockchainServiceKey) => {
    const foundBlockchain = blockchainSelected.some(it => it === blockchain)

    if (foundBlockchain) {
      setBlockchainSelected(prevState => prevState.filter(it => it !== blockchain))
      return
    }

    setBlockchainSelected(prevState => (isMulti ? [...prevState, blockchain] : [blockchain]))
  }

  useEffect(() => {
    if (!filter) {
      setBlockchainFiltered(blockchainList)
      return
    }

    const filtered = blockchainList.filter(blockchain => {
      const label = i18n.t(`blockchainServices.${blockchain}.label`).toLowerCase()

      return label.includes(filter.toLowerCase())
    })

    setBlockchainFiltered(filtered)
    setBlockchainSelected([])
  }, [filter])

  useEffect(() => {
    onSelect(blockchainSelected)
  }, [blockchainSelected])

  return (
    <LinearLayout>
      <SearchBar onFilter={setFilter} lighterColor />

      <FlatList
        data={blockchainFiltered}
        ItemSeparatorComponent={() => <LinearLayout bg="background.10" height={1} />}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <BlockchainItem
            isSelected={blockchainSelected.includes(item)}
            onPress={handlePress}
            item={item}
            wallet={wallet}
            hideQtyAccounts={hideQtyAccounts}
          />
        )}
      />
    </LinearLayout>
  )
}

export default BlockchainList
