import i18n from 'i18n-js'
import React, { useState, useEffect, useMemo } from 'react'
import { TouchableWithoutFeedback, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { selectAccounts } from '../store/account/SelectorAccount'
import { Wallet } from '../store/wallet/Wallet'
import { TBlockchainServiceKey } from '../types/blockchain'
import { BlockchainIcon } from './BlockchainIcon'

import { SearchBar } from '~src/components/SearchBar'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface IBlockchainList {
  onSelect: (items: TBlockchainServiceKey[]) => void
  isMulti?: boolean
  hideQtyAccounts?: boolean
  wallet?: Wallet
}

interface IBlockchainItem {
  item: TBlockchainServiceKey
  onPress: (item: TBlockchainServiceKey) => void
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
          <BlockchainIcon blockchain={item} marginRight="8px" height={28} width={28} />

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
          <ImageView
            height={21}
            width={21}
            resizeMode="contain"
            source={require('~src/assets/images/icon-check-green.png')}
          />
        )}
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

const BlockchainList = ({ isMulti, hideQtyAccounts, onSelect, wallet }: IBlockchainList) => {
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const blockchainKeys = useMemo(
    () => Object.keys(bsAggregator.blockchainServicesByName) as TBlockchainServiceKey[],
    []
  )

  const [blockchainSelected, setBlockchainSelected] = useState<TBlockchainServiceKey[]>(
    isMulti ? blockchainKeys : ['neo3']
  )
  const [blockchainFiltered, setBlockchainFiltered] = useState<TBlockchainServiceKey[]>(blockchainKeys)

  const handlePress = (blockchain: TBlockchainServiceKey) => {
    const foundBlockchain = blockchainSelected.some(it => it === blockchain)

    if (foundBlockchain) {
      setBlockchainSelected(prevState => prevState.filter(it => it !== blockchain))
      return
    }

    setBlockchainSelected(prevState => (isMulti ? [...prevState, blockchain] : [blockchain]))
  }

  const handleFilter = (filter: string) => {
    if (!filter) {
      setBlockchainFiltered(blockchainKeys)
      return
    }

    const filtered = blockchainKeys.filter(blockchain => {
      const label = i18n.t(`blockchainServices.${blockchain}.label`).toLowerCase()

      return label.includes(filter.toLowerCase())
    })

    setBlockchainFiltered(filtered)
    setBlockchainSelected([])
  }

  useEffect(() => {
    onSelect(blockchainSelected)
  }, [blockchainSelected])

  return (
    <LinearLayout>
      <SearchBar onFilter={handleFilter} lighterColor />

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
