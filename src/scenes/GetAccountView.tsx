import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useEffect} from 'react'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
import {mockWalletItems} from '~src/mocks/mockWalletItems'
import {NeoNode} from '~src/models/NeoNode'
import {TransactionModel} from '~src/models/TransactionModel'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface GetAccountParams {
  account: Account
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const GetAccountView = (props: GetAccountViewProps) => {
  const account = props.route.params.account
  const [nodes, setNodes] = useState<NeoNode[]>([])
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  const [wasDeleted, setAsDeleted] = useState<boolean>(false)

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [account])

  useEffect(() => {
    if (wasDeleted) {
      props.navigation.goBack()
    }
  }, [wasDeleted])

  const populate = async () => {
    console.log('here')
    setNodes(await NeoNode.getAllNodes())
  }

  const _renderTitle: React.FC = () => {
    return (
      <LinearLayout alignItems="center" justifyContent="center">
        <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
          {Facade.t('app.neoBlockHeight')}
        </TextView>

        <TextView color={'text.0'} textAlign={'center'}>
          {nodes[0] &&
            Facade.filter.currency(nodes[0].height, '', false, false)}
        </TextView>
      </LinearLayout>
    )
  }

  props.navigation.setOptions({
    headerTitle: _renderTitle,
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.EditAccountModal.name,
            account,
            onDelete: () => setAsDeleted(true),
          })
        },
      }),
  })

  const _renderTransactionViewElement = () => {
    return mockAccountAssetDetails.map(
      (transActionModel: TransactionModel, i: number) => {
        return (
          <TransactionsList
            key={i}
            isHistory={false}
            transactionModel={transActionModel}
            index={i}
          />
        )
      }
    )
  }

  return (
    <ScreenLayout>
      <AwaitActivity name={'populate'} loadingView={<ScreenLoader />}>
        <LinearLayout mt={4}>
          <AccountCard
            account={account}
            isCompacted={true}
            onPress={() =>
              props.navigation.navigate(Facade.route.AccountAssetDetail.name, {
                account,
              })
            }
          />
        </LinearLayout>

        <LinearLayout mt="28px" mx="auto">
          <ThemedButton
            fontSize="16px"
            label={Facade.t('screens.getAccount.claimAsset', {
              assetAmount: '0.0000123 GAS',
            })}
          />
        </LinearLayout>

        <TabSelector
          isFirstTabSelected={isAssetsTabSelected}
          setFirstTabAsSelected={setIsAssetsTabSelected}
          firstTabLabel={Facade.t('screens.getAccount.assets')}
          secondTabLabel={Facade.t('screens.getAccount.transactions')}
        />

        <LinearLayout>
          {isAssetsTabSelected ? (
            <BalanceList
              my="16px"
              tokenAssets={mockWalletItems[2].currentAssets.assets}
            />
          ) : (
            _renderTransactionViewElement()
          )}
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default GetAccountView
