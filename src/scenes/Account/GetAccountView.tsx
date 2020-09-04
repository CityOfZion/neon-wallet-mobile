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
import {Lang} from '~src/enums/Lang'
import {NeoNode} from '~src/models/NeoNode'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface GetAccountParams {
  account: Account
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const ReceiveButton = (props: {onPress: () => any}) => {
  const selectedReceiveImage = require('~/src/assets/images/button-receive-small-selected.png')
  const defaultReceiveImage = require('~/src/assets/images/button-receive-small.png')
  
  const [isPressed, setPressed] = useState(false)
  const backgroundImage = isPressed ? selectedReceiveImage : defaultReceiveImage
  return (
    <ButtonView
      onPress={props.onPress}
      activeOpacity={1}
      onHideUnderlay={() => {
        setPressed(false)
      }}
      onShowUnderlay={() => {
        setPressed(true)
      }}
    >
      <ImageView
        source={backgroundImage}
        overflow={'visible'}
        //The image has margins
        ml={'-45'}
      />
    </ButtonView>
  )
}

const disabledSendImage = require('~/src/assets/images/button-send-small-disabled.png')
const selectedSendImage = require('~/src/assets/images/button-send-small-selected.png')
const defaultSendImage = require('~/src/assets/images/button-send-small.png')

function SendButton(props: {onPress?: () => any}) {
  const [isPressed, setPressed] = useState(false)
  let backgroundImage = isPressed ? selectedSendImage : defaultSendImage
  backgroundImage = props.onPress ? backgroundImage : disabledSendImage
  return (
    <ButtonView
      onPress={props.onPress}
      disabled={Boolean(props.onPress)}
      activeOpacity={1}
      onHideUnderlay={() => {
        setPressed(false)
      }}
      onShowUnderlay={() => {
        setPressed(true)
      }}
    >
      <ImageView
        source={backgroundImage}
        overflow={'visible'}
        //The image has margins
        mr={'-45'}
      />
    </ButtonView>
  )
}

const TitleComponent = (props: {nodesPool: NeoNode[]; language: Lang}) => {
  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
        {Facade.t('app.neoBlockHeight')}
      </TextView>

      <TextView color={'text.0'} textAlign={'center'}>
        {Facade.filter.decimal(
          NeoNode.getHighestNodeHeightFromPool(props.nodesPool),
          props.language
        )}
      </TextView>
    </LinearLayout>
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const appWallets = useSelector((state: RootState) => state.app.wallets)
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const pendingTransactions = useSelector(
    (state: RootState) => state.app.pendingTransactions
  )

  const [account, setAccount] = useState<Account>(props.route.params.account)
  const isWatchAccount = Boolean(
    props.route.params.account.accountType === 'watch'
  )
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

  props.navigation.setOptions({
    headerTitle: () => TitleComponent({nodesPool, language}),
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

      <LinearLayout orientation={'horiz'} flex={1} flexWrap={'wrap'}>
        <ReceiveButton
          onPress={() =>
            props.navigation.navigate(Facade.route.Modal.name, {
              screen: Facade.route.ReceiveToAccountModal.name,
              params: {
                wallet: props.route.params.account.getWallet(appWallets),
                account: props.route.params.account,
              },
            })
          }
        />

        <ButtonView
          onPress={() => console.log('pressed')}
          weight={2}
          justifyContent={'center'}
          overflow={'visible'}
        >
          <ImageView
            source={require('~src/assets/images/button-claim-background.png')}
            alignSelf={'center'}
            position={'absolute'}
            maxWidth={'100%'}
          />
          <TextView
            color={'primary'}
            alignSelf={'center'}
            fontSize={'16px'}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {Facade.t('screens.getAccount.claimAsset', {
              assetAmount: '0.1 GAS',
            })}
          </TextView>
        </ButtonView>

        <SendButton
          onPress={
            isWatchAccount
              ? undefined
              : () =>
                  props.navigation.navigate(Facade.route.Modal.name, {
                    screen: Facade.route.SendTransactionInputModal.name,
                    params: {
                      walletTitle:
                        props.route.params.account.getWallet(appWallets)
                          ?.name ?? '',
                      account: props.route.params.account,
                    },
                  })
          }
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
