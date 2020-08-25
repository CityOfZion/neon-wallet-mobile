import {RouteProp, useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useCallback, useEffect} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {NeoNode} from '~src/models/NeoNode'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
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
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const pendingTransactions = useSelector(
    (state: RootState) => state.app.pendingTransactions
  )

  const [account, setAccount] = useState<Account>(props.route.params.account)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)

  const [transactions, setTransactions] = useState<TransactionDateGroup[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const {language} = useSelector((state: RootState) => state.settings)

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  useFocusEffect(
    useCallback(() => {
      setAccount(
        accountsPool.find((acc) => acc.address === account?.address) ??
          new Account()
      )
    }, [accountsPool])
  )

  useEffect(() => {
    if (!isAssetsTabSelected) {
      setTransactions([])
      setCurrentPage(1)
      Facade.await.run('populateTransaction', () => fetchTransaction(1))
    }
  }, [isAssetsTabSelected])

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

  const fetchTransaction = async (currentPage: number) => {
    if (!account.address) return

    const request = new AddressPaginatedRequest(account.address, currentPage)
    const response = await request.getAddressAbstracts()

    if (currentPage > (response.totalPages ?? 0)) return

    const pendingSenderTxs = pendingTransactions.filter(
      (it) => it.senderAddress === account.address
    )
    const senderTx = response.toSenderTransaction(tokensPool)

    const pendingHashs = pendingSenderTxs.map((it) => it.transactionHash ?? '')
    const hashs = senderTx.map((it) => it.transactionHash ?? '')

    // Clear pending transactions if it is concluded
    let needSync = false
    for (const pendingHash of pendingHashs) {
      if (hashs.includes(pendingHash)) {
        await dispatchAsync(
          RootStore.senderTransaction.actions.removeFromHistory(pendingHash)
        )
        needSync = true

        const index = pendingSenderTxs.findIndex(
          (it) => it.transactionHash === pendingHash
        )
        if (index >= 0) {
          pendingSenderTxs.splice(index, 1)
        }
      }
    }

    if (needSync) {
      await dispatchAsync(RootStore.app.actions.syncPendingTransactions())
    }

    const groupedTxs = SenderTransaction.toTransactionDateGroup([
      ...pendingSenderTxs,
      ...senderTx,
    ])

    setTransactions((val) => val.concat(groupedTxs))
    setCurrentPage(currentPage + 1)
  }

  return (
    <ScreenLayout
      onReachBottom={() => {
        if (Facade.await.inAction('loadMoreTransaction')) return
        Facade.await.run(
          'loadMoreTransaction',
          () => fetchTransaction(currentPage),
          500
        )
      }}
    >
      <LinearLayout mt={4}>
        <AccountCard account={account} isStackMode={false} />
      </LinearLayout>

      <LinearLayout mt="28px" mx="auto">
        <ThemedButton
          fontSize="16px"
          label={Facade.t('screens.getAccount.claimAsset', {
            assetAmount: '0.0000123 GAS',
          })}
          //TODO NW-158 Show gas when claim is finished
          onPress={() => showMessage({message: 'placeholder'})}
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
            tokenAssets={account.tokenAssets}
            account={account}
            fromAccountView={true}
          />
        ) : (
          <AwaitActivity
            name={'populateTransaction'}
            size={'large'}
            style={{minHeight: 100}}
          >
            <>
              {account.address && (
                <TransactionsList
                  address={account.address}
                  transactionGroups={transactions}
                />
              )}

              <AwaitActivity
                name={'loadMoreTransaction'}
                size={'large'}
                style={{minHeight: 100}}
              />
            </>
          </AwaitActivity>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetAccountView
