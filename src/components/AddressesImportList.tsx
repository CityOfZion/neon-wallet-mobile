import i18n from 'i18n-js'
import React, { useState, useCallback, useEffect } from 'react'
import { View, ScrollView, FlatList, Image, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey, getBlockchainLogo } from '~src/blockchain'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface AddressImportItemProps {
  blockSelection?: boolean
  address: string
  blockchain: BlockchainServiceKey
  onSelectAddress: (address: string, blockchain: BlockchainServiceKey, isSelected: boolean) => void
}

const AddressImportItem = (props: AddressImportItemProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(true)

  const handleClickActive = useCallback(() => {
    !props.blockSelection && setIsSelected(!isSelected)
  }, [isSelected, props.blockSelection])

  useEffect(() => {
    props.onSelectAddress(props.address, props.blockchain, isSelected)
  }, [isSelected])
  return (
    <TouchableWithoutFeedback onPress={handleClickActive}>
      <View
        style={{
          marginVertical: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ marginRight: 10, width: 25, height: 26 }}
            source={getBlockchainLogo(props.blockchain)}
            width={25}
            height={26}
          />
          <View>
            <TextView fontSize="10px" color="text.3">
              {i18n.t(`blockchainServices.${props.blockchain}.label`)}
            </TextView>
            <TextView color="#fff" fontFamily="medium" fontSize="14px">
              {props.address}
            </TextView>
          </View>
        </View>
        {(isSelected ?? !props.blockSelection) && <Image source={require('~src/assets/images/icon-check-green.png')} />}
      </View>
    </TouchableWithoutFeedback>
  )
}

export interface AddressesImportListProps {
  blockSelection?: boolean
  addressesInfo: { address: string; blockchain: BlockchainServiceKey }[]
  onSelectAddress: (addressInfoSelected: { address: string; blockchain: BlockchainServiceKey }[]) => void
}

const AddressesImportList = (props: AddressesImportListProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const [addressesSelected, setAddressesSelected] = useState<{ address: string; blockchain: BlockchainServiceKey }[]>(
    []
  )
  const handleChangeAddressesSelected = useCallback(
    (address: string, blockchain: BlockchainServiceKey, isSelected: boolean) => {
      if (isSelected) {
        const foundAddressesSelected = addressesSelected.find(
          it => it.address === address && it.blockchain === blockchain
        )
        if (foundAddressesSelected) {
          setAddressesSelected(prevState => {
            const data = prevState
            data[addressesSelected.indexOf(foundAddressesSelected)] = {
              address,
              blockchain,
            }
            return [...data]
          })
        } else {
          setAddressesSelected(prevState => {
            const data = prevState
            data.push({ address, blockchain })
            return [...data]
          })
        }
      } else {
        setAddressesSelected(prevState => {
          const data = prevState
          return [...data.filter(it => it.address !== address && it.blockchain !== blockchain)]
        })
      }
    },
    [addressesSelected]
  )

  useEffect(() => {
    props.onSelectAddress(addressesSelected)
  }, [addressesSelected])
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
          data={props.addressesInfo}
          renderItem={({ item, index }) => (
            <AddressImportItem
              blockSelection={props.blockSelection}
              onSelectAddress={handleChangeAddressesSelected}
              blockchain={item.blockchain}
              key={index}
              address={item.address}
            />
          )}
          ItemSeparatorComponent={() => <LinearLayout bg="text.1" height={1} />}
        />
      </ScrollView>
    </View>
  )
}

export default AddressesImportList
