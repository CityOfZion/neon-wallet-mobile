import React, {useEffect, useState} from 'react'
import {ButtonView, ImageView, LinearLayout, StyledScrollView, TextView} from '~src/styles/styled-components'
import AccountCardView from '~src/components/AccountCardView'
import {RouteProp} from '@react-navigation/native'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {SCREEN_HEIGHT} from '~/constants'
import ThemedButton from '~src/components/ThemedButton'
import BalanceList from '~src/components/BalanceList'
import {mockWalletItems} from '~src/mockWalletItems'
import {StackNavigationProp} from '@react-navigation/stack'
import {NeoNode} from '~src/models/NeoNode'
import {SafeAreaView} from 'react-native'
import {FilterHelper} from '~src/helpers/FilterHelper'

const Header = (props: {goBack: () => void}) => {
  const [nodes, setNodes] = useState<NeoNode[]>([])

  useEffect(() => {
    populate()
  }, [])

  const populate = async () => {
    setNodes(await NeoNode.getAllNodes())
  }

  return (
    <LinearLayout
      orientation="horiz"
      width="100%"
      mb="12px"
      px="18px"
      alignItems="center"
      justifyContent="space-between"
    >
      <ButtonView
        onPress={props.goBack}
        orientation="horiz"
        alignItems="center"
      >
        <ImageView height="20px" width="12px" source={require('~src/assets/images/Chevron.png')} />
        <TextView color="text.0" ml="6px" fontSize="18px">Back</TextView>
      </ButtonView>
      <LinearLayout orientation="verti" alignItems="center" justifyContent="center" mr="20px">
        <TextView color="text.3" textAlign="center" fontSize="10px">
          NEO BLOCK HEIGHT
        </TextView>
        <TextView color="text.0" textAlign="center">
          {nodes[0] && FilterHelper.currency(nodes[0].height, '', false, false)}
        </TextView>
      </LinearLayout>
      <TextView fontSize="18px" color="text.0" fontFamily="semibold">Edit</TextView>
    </LinearLayout>
  )
}

interface TabSelectorProps {
  isAssetsTabSelected: boolean
  setIsAssetsTabSelected: React.Dispatch<React.SetStateAction<boolean>>
}

const TabSelector = (props: TabSelectorProps) => {
  return (
    <LinearLayout orientation="horiz" mt="36px">
      <ButtonView
        onPress={() => props.setIsAssetsTabSelected(true)}
        weight={1}
        alignItems="center"
        borderBottomWidth={props.isAssetsTabSelected ? "1px" : "3px"}
        borderColor="text.0"
      >
        <TextView
          fontSize="16px"
          mb="8px"
          fontFamily="semibold"
          color={props.isAssetsTabSelected ? "primary" : "text.0"}
        >
          ASSETS
        </TextView>
      </ButtonView>
      <ButtonView
        onPress={() => props.setIsAssetsTabSelected(false)}
        weight={1}
        alignItems="center"
        borderBottomWidth={!props.isAssetsTabSelected ? "1px" : "3px"}
        borderColor="text.0"
      >
        <TextView
          fontSize="16px"
          mb="8px"
          fontFamily="semibold"
          color={!props.isAssetsTabSelected ? "primary" : "text.0"}
        >
          TRANSACTIONS
        </TextView>
      </ButtonView>
    </LinearLayout>
  )
}

interface GetAccountViewProps {
  route: RouteProp<QuickToolsStackParamList, 'GetAccount'>
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetAccountView = ({route, navigation}: GetAccountViewProps) => {
  navigation.setOptions({headerShown: false})
  const {account} = route.params
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  return (
    <SafeAreaView>
      <LinearLayout
        orientation="verti"
        height="100%"
        width="100%"
        alignItems="center"
        bg="background.0"
        pt="32px"
      >
        <Header goBack={() => navigation.goBack()} />
        <StyledScrollView width="100%" px="18px">
          <AccountCardView
            cardHeight={SCREEN_HEIGHT / 3}
            account={account}
            marginTop={20}
            lastCard={true}
          />
          <LinearLayout mt="28px" mx="auto">
            <ThemedButton fontSize="16px" label={'Claim 0.0000123 GAS'} />
          </LinearLayout>
          <TabSelector
            isAssetsTabSelected={isAssetsTabSelected}
            setIsAssetsTabSelected={setIsAssetsTabSelected}
          />
          {isAssetsTabSelected &&
            <LinearLayout my="16px">
                <BalanceList tokenAssets={mockWalletItems[2].currentAssets.assets}/>
            </LinearLayout>
          }
        </StyledScrollView>
      </LinearLayout>
    </SafeAreaView>
  )
}

export default GetAccountView
