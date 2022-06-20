import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {
  TouchableWithoutFeedback,
  View,
  Image,
  FlatList,
  ScrollView,
} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {SyncDispatch} from '../types/reducers/root'

import {
  blockchainList,
  BlockchainServiceKey,
  getBlockchainLogo,
} from '~src/blockchain'
import {SearchBar} from '~src/components/input/SearchBar'
import {Wallet} from '~src/models/redux/Wallet'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface IBlockchainItem {
  item: BlockchainServiceKey
  selectBlockchain: (blockchain: BlockchainServiceKey) => void
  isSelected: boolean
  qtyAccounts: number
  hideQtyAccounts?: boolean
}

const BlockchainItem = (props: IBlockchainItem) => {
  const selectBlockchain = () => {
    props.selectBlockchain(props.item)
  }

  return (
    <TouchableWithoutFeedback onPress={selectBlockchain}>
      <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ marginRight: 10, height: 29, width: 28 }}
            source={getBlockchainLogo(props.item)}
            width={28}
            height={29}
          />
          <View>
            <TextView fontSize="9px" color="#899fa8">
              {i18n.t(`blockchainServices.${props.item}.id`)}
            </TextView>
            <TextView fontFamily="bold" fontSize="16px" color="text.0">
              {i18n.t(`blockchainServices.${props.item}.label`)}
            </TextView>
          </View>
        </View>
        {props.isSelected && !props.hideQtyAccounts && (
          <TextView color="#899fa8" fontSize="14px">
            {i18n.t('modals.blockchainList.xExisting', {
              amount: props.qtyAccounts,
            })}
          </TextView>
        )}
        {props.isSelected && <Image source={require('~src/assets/images/icon-check-green.png')} />}
      </View>
    </TouchableWithoutFeedback>
  )
}

interface IBlockchainList {
  onBlockchainSelected: (
    blockchainsSelectedList: {
      blockchain: BlockchainServiceKey
      isActive: boolean
    }[]
  ) => void
  isMulti?: boolean
  hideQtyAccounts?: boolean
}

interface IBlockchainListMap {
  blockchainKey: BlockchainServiceKey
  label: string
}

const BlockchainList = (props: IBlockchainList) => {
  const [blockchainSelected, setBlockchainSelected] = useState<
    { blockchain: BlockchainServiceKey; isActive: boolean }[]
  >(
    blockchainList.map<{ blockchain: BlockchainServiceKey; isActive: boolean }>(it => {
      return { blockchain: it, isActive: false }
    })
  )
  const [blockchainListFiltered, setBlockchainListFiltered] = useState<BlockchainServiceKey[]>(blockchainList)
  const [blockchainListMap, setBlockchainListMap] = useState<IBlockchainListMap[]>([])
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const selectedWallet = useMemo(() => dispatchWallet(RootStore.wallet.actions.getFromSelection()), [])

  const selectBlockchain = (blockchain: BlockchainServiceKey) => {
    if (!props.isMulti) {
      unselectAllBlockchains()
    }
    const foundBlockchain = blockchainSelected.find(it => it.blockchain === blockchain)
    if (foundBlockchain) {
      setBlockchainSelected(prevState => {
        const data = prevState
        data[blockchainSelected.indexOf(foundBlockchain)] = {
          blockchain,
          isActive: !foundBlockchain.isActive,
        }
        return [...data]
      })
    }
  }

  const blockchainIsActive = useCallback(
    (blockchain: BlockchainServiceKey) => {
      const isActive = blockchainSelected.find(it => it.blockchain === blockchain)?.isActive
      return isActive ? isActive : false
    },
    [blockchainSelected]
  )

  const selectAllBlockchains = useCallback(() => {
    const stateBlockchains = blockchainList.map<{
      blockchain: BlockchainServiceKey
      isActive: boolean
    }>(it => {
      return { blockchain: it, isActive: true }
    })
    setBlockchainSelected(stateBlockchains)
  }, [blockchainSelected])

  const unselectAllBlockchains = useCallback(() => {
    const stateBlockchains = blockchainList.map<{
      blockchain: BlockchainServiceKey
      isActive: boolean
    }>(it => {
      return { blockchain: it, isActive: false }
    })
    setBlockchainSelected(stateBlockchains)
  }, [blockchainSelected])

  useEffect(() => {
    if (props.isMulti) {
      selectAllBlockchains()
    } else {
      selectBlockchain('neo3')
    }
    const mapLabelsBlockchain: IBlockchainListMap[] = blockchainList.map<IBlockchainListMap>(it => {
      return {
        blockchainKey: it,
        label: i18n.t(`blockchainServices.${it}.label`).toLowerCase(),
      }
    })
    setBlockchainListMap(mapLabelsBlockchain)
  }, [])

  useEffect(() => {
    props.onBlockchainSelected(blockchainSelected)
  }, [blockchainSelected])
  return (
    <View>
      <SearchBar
        callbackFilter={text => {
          unselectAllBlockchains()
          const mapedBlockchain = blockchainListMap.filter(it => it.label.startsWith(text.toLowerCase()))
          setBlockchainListFiltered(mapedBlockchain.map(it => it.blockchainKey))
        }}
        prevData={blockchainList}
        dispatchData={setBlockchainListFiltered}
        lighterColor
      />

      <ScrollView>
        <FlatList
          data={blockchainListFiltered}
          ItemSeparatorComponent={() => <LinearLayout bg="background.10" height={1} />}
          renderItem={({ item }) => (
            <BlockchainItem
              isSelected={blockchainIsActive(item)}
              selectBlockchain={selectBlockchain}
              item={item}
              key={item}
              qtyAccounts={
                selectedWallet.getAccounts(accountsPool).filter(account => account.blockchain === item).length
              }
              hideQtyAccounts={props.hideQtyAccounts}
            />
          )}
        />
      </ScrollView>
    </View>
  )
}

export default BlockchainList
