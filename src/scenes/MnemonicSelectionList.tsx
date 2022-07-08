import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, Image, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'

import { RootStackParamList } from '../navigation/AppNavigation'
import { WalletStackParamList } from '../navigation/WalletsStackNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import { BlockchainServiceKey, blockchainServices, getBlockchainLogo } from '~src/blockchain'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useBlockchainActionsHook, AccountToImport } from '~src/hooks/useBlockchainActionsHook'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
export type MnemonicSelectionInfo = Map<
  BlockchainServiceKey,
  { address: string; wif: string; derivationIndex: number }[]
>

interface Props {
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'MnemonicSelectionList'>
}

interface HeaderMnemonicSelectionProps {
  data: [
    BlockchainServiceKey,
    {
      address: string
      wif: string
    }[]
  ]
  qtyAddressesSelected: number
  totAddresses: number
  isActive: boolean
}
const HeaderMnemonicSelection = (props: HeaderMnemonicSelectionProps) => {
  const [blockchainName] = props.data
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#ffffff44',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Image
          source={getBlockchainLogo(blockchainName)}
          width={32}
          height={33}
          style={{ height: 28, width: 27, marginHorizontal: 10 }}
        />
        <View>
          <Text style={{ color: '#899fa8', fontSize: 12, fontFamily: 'medium' }}>
            {i18n.t(`blockchainServices.${blockchainName}.id`)}
          </Text>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'bold' }}>
            {i18n.t(`blockchainServices.${blockchainName}.label`)}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={{ color: '#899fa8', marginRight: 15, fontFamily: 'medium' }}>
          {i18n.t('mnemonicSelectionList.qtySelectedOfTotal', {
            qtySelected: props.qtyAddressesSelected,
            total: props.totAddresses,
          })}
        </Text>
        {props.isActive ? (
          <Text style={{ fontSize: 30, color: '#4cffb3' }}>-</Text>
        ) : (
          <Text style={{ fontSize: 30, color: '#4cffb3' }}>+</Text>
        )}
      </View>
    </View>
  )
}

interface ContentMnemonicItemProps {
  data: {
    address: string
    wif: string
    derivationIndex: number
  }
  blockchain: BlockchainServiceKey
  onAddressChange: (address: string, wif: string, isSelected: boolean, blockchain: BlockchainServiceKey) => void
}

const ContentMnemonicItem = (props: ContentMnemonicItemProps) => {
  const [addressIsSelected, setAddressIsSelected] = useState<boolean>(true)

  const handleIsSelected = useCallback(() => {
    setAddressIsSelected(!addressIsSelected)
  }, [addressIsSelected])

  useEffect(() => {
    props.onAddressChange(props.data.address, props.data.wif, addressIsSelected, props.blockchain)
  }, [addressIsSelected])
  return (
    <TouchableWithoutFeedback onPress={handleIsSelected}>
      <View
        style={{
          backgroundColor: '#13191D',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <View style={{ backgroundColor: '#13191D' }}>
          <Text style={{ fontFamily: 'medium', color: '#899fa8', fontSize: 16 }}>
            {blockchainServices[props.blockchain].derivationPath.replace('?', String(props.data.derivationIndex))}
          </Text>
          <Text style={{ fontFamily: 'medium', color: '#fff', fontSize: 16 }}>{props.data.address}</Text>
        </View>
        {addressIsSelected && (
          <Image
            width={30}
            height={30}
            style={{ width: 18, height: 18, alignSelf: 'center' }}
            source={require('~src/assets/images/icon-check-green.png')}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

interface ContentMnemonicSelectionProps {
  data: { address: string; wif: string; derivationIndex: number }[]
  blockchain: BlockchainServiceKey
  onAddressChange: (address: string, wif: string, isSelected: boolean, blockchain: BlockchainServiceKey) => void
}

const ContentMnemonicSelection = (props: ContentMnemonicSelectionProps) => {
  return (
    <FlatList
      ItemSeparatorComponent={() => (
        <View
          style={{
            backgroundColor: '#ffffff11',
            height: 1,
            marginHorizontal: 20,
          }}
        />
      )}
      data={props.data}
      renderItem={({ item }) => (
        <ContentMnemonicItem
          data={item}
          blockchain={props.blockchain}
          onAddressChange={(address, wif, isSelected, blockchain) => {
            props.onAddressChange(address, wif, isSelected, blockchain)
          }}
        />
      )}
    />
  )
}

export interface MnemonicSelectionListParams {
  data: MnemonicSelectionInfo
  mnemonic: string
}

const MnemonicSelectionList = (props: Props) => {
  const { mnemonic } = props.route.params
  const [itensActives, setItemActives] = useState<number[]>([0])
  const handleActiveItens = (itens: number[]) => {
    setItemActives(itens)
  }
  const [addressesSelected, setAddressesSelected] = useState<
    { address: string; blockchain: BlockchainServiceKey; wif: string }[]
  >([])
  const blockchainActionsHook = useBlockchainActionsHook()
  const handleSelectAddress = useCallback(
    (address: string, wif: string, blockchain: BlockchainServiceKey) => {
      setAddressesSelected(prevState => {
        const data = prevState
        data.push({ address, wif, blockchain })
        return [...data]
      })
    },
    [addressesSelected]
  )

  const handleUnselectAddress = useCallback(
    (address: string) => {
      setAddressesSelected(prevState => {
        const data = prevState
        return [...data.filter(it => it.address !== address)]
      })
    },
    [addressesSelected]
  )

  const handleImportAccounts = useCallback(async () => {
    Await.init('importMnemonic')
    const walletId = await blockchainActionsHook.createWallet(
      i18n.t('defaultNameWallet.mnemonicWallet'),
      mnemonic,
      'standard'
    )

    const accountsToImport = addressesSelected.map(
      ({ address, blockchain, wif }): AccountToImport => ({
        walletId,
        address,
        blockchain,
        wif,
        type: 'account',
      })
    )

    await blockchainActionsHook.importAccounts(accountsToImport)
    Await.done('importMnemonic')
    props.navigation.reset({
      index: 0,
      routes: [{ name: wrapper.route.Tab.name }],
    })
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
    })
  }, [addressesSelected])

  return (
    <ScreenLayout>
      <AwaitActivity name="importMnemonic" loadingView={<ScreenLoader />}>
        <View style={{ height: '100%' }}>
          <ScrollView>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'regular',
                alignSelf: 'center',
                fontSize: 18,
                marginVertical: 30,
              }}
            >
              We found the following
            </Text>
            <Accordion
              expandMultiple
              activeSections={itensActives}
              sections={Array.from(props.route.params.data.entries())}
              renderHeader={(content, _, isActive) => {
                const [blockchain, data] = content
                const qtyAddressesSelected = addressesSelected.filter(it => it.blockchain === blockchain).length
                return (
                  <HeaderMnemonicSelection
                    data={content}
                    qtyAddressesSelected={qtyAddressesSelected}
                    totAddresses={data.length}
                    isActive={isActive}
                  />
                )
              }}
              onChange={indexes => handleActiveItens(indexes)}
              renderContent={content => {
                const [blockchain, data] = content

                return (
                  <ContentMnemonicSelection
                    blockchain={blockchain}
                    data={data}
                    onAddressChange={(address, wif, isSelected, blockchain) => {
                      if (isSelected) {
                        handleSelectAddress(address, wif, blockchain)
                      } else {
                        handleUnselectAddress(address)
                      }
                    }}
                  />
                )
              }}
            />
          </ScrollView>
          <ThemedButton
            disabled={addressesSelected.length < 1}
            label={i18n.t('routes.ImportKey')}
            onPress={handleImportAccounts}
          />
        </View>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default MnemonicSelectionList
