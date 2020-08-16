import {RouteProp, useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
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
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)

  const [account, setAccount] = useState<Account>(props.route.params.account)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)

  const {language} = useSelector((state: RootState) => state.settings)

  useFocusEffect(
    useCallback(() => {
      setAccount(
        accountsPool.find((acc) => acc.address === account?.address) ??
          new Account()
      )
    }, [accountsPool])
  )

  const _renderTitle: React.FC = () => {
    return (
      <LinearLayout alignItems="center" justifyContent="center">
        <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
          {Facade.t('app.neoBlockHeight')}
        </TextView>

        <TextView color={'text.0'} textAlign={'center'}>
          {Facade.filter.decimal(
            NeoNode.getHighestNodeHeightFromPool(nodesPool),
            language
          )}
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
            params: {
              account,
            },
          })
        },
      }),
  })

  const _renderTransactionViewElement = () => {
    const lastIndex = mockAccountAssetDetails.length - 1
    return mockAccountAssetDetails.map(
      (transActionModel: TransactionModel, i: number) => {
        return (
          <TransactionsList
            key={i}
            isHistory={false}
            transactionModel={transActionModel}
            index={i}
            lastIndex={lastIndex}
          />
        )
      }
    )
  }

  return (
    <ScreenLayout>
      <LinearLayout mt={4}>
        <AccountCard account={account} isStackMode={false} />
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

      <AwaitActivity name={'populate'} size={'large'} style={{minHeight: 100}}>
        <LinearLayout>
          {isAssetsTabSelected ? (
            <BalanceList
              my="16px"
              tokenAssets={account.tokenAssets}
              account={account}
              fromAccountView={true}
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
