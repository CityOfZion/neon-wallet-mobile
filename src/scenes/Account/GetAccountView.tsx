import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useEffect, useRef} from 'react'
import {
  Animated,
  Easing,
  InteractionManager,
  LayoutChangeEvent,
  Dimensions,
  Image,
  View,
  ScrollView,
} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {ThemedClaimButton} from '~/src/components/themed/ThemedClaimButton'
import {ThemedSendButton} from '~/src/components/themed/ThemedSendButton'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector, {TabSelectorBar} from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import {ThemedReceiveButton} from '~src/components/themed/ThemedReceiveButton'
import ErrorBound from '~src/config/ErrorBound'
import {Lang} from '~src/enums/Lang'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {NeoNode} from '~src/models/NeoNode'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {AddressRequest} from '~src/models/request/AddressRequest'
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
  key: string
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const disabledSendImage = require('~/src/assets/images/button-send-small-disabled.png')
const selectedSendImage = require('~/src/assets/images/button-send-small-selected.png')
const defaultSendImage = require('~/src/assets/images/button-send-small.png')

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
      margin={'0 0 0 1%'}
    >
      <ImageView
        source={backgroundImage}
        overflow={'visible'}
        //The image has margins
        width={71}
      />
    </ButtonView>
  )
}

const SendButton = (props: {onPress?: () => any}) => {
  const [isPressed, setPressed] = useState(false)
  let backgroundImage = isPressed ? selectedSendImage : defaultSendImage
  backgroundImage = props.onPress ? backgroundImage : disabledSendImage
  return (
    <ButtonView
      onPress={props.onPress}
      disabled={!props.onPress}
      activeOpacity={1}
      onHideUnderlay={() => {
        setPressed(false)
      }}
      onShowUnderlay={() => {
        setPressed(true)
      }}
      margin={'0 1% 0 0'}
    >
      <ImageView source={backgroundImage} overflow={'visible'} width={71} />
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
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const {language} = useSelector((state: RootState) => state.settings)
  const {address} = useSelector((state: RootState) => state.account)

  const posYFactor = useRef(new Animated.Value(0))

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [cardHeight, setCardHeight] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<number>()

  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()

  const [senderAddress, setSenderAddress] = useState<string>('')

  const changeSenderAddress = () => {
    if (senderAddress === '' && address !== null) {
      setSenderAddress(address)
    }
  }
  const [account, setAccount] = useState(
    dispatchAccount(RootStore.account.actions.getFromSelection())
  )
  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const isWatchAccount = account.accountType === 'watch'

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

  useEffect(() => {
    if (address) {
      const account = dispatchAccount(
        RootStore.account.actions.getFromSelection(
          senderAddress !== '' ? senderAddress : undefined
        )
      )
      setAccount(account)
    }

    Facade.bus.on('claimGasStart', refresh)
    Facade.bus.on('claimGasEnd', refresh)
    Facade.bus.on('transactionStart', refresh)
    Facade.bus.on('transactionEnd', refresh)
    Facade.bus.on('addPendingUnclaimedGasTransaction', manageClaimLoader)
    Facade.bus.on('removePendingTransactions', manageClaimLoader)

    return () => {
      Facade.bus.off('claimGasStart', refresh)
      Facade.bus.off('claimGasEnd', refresh)
      Facade.bus.off('transactionStart', refresh)
      Facade.bus.off('transactionEnd', refresh)
      Facade.bus.off('addPendingUnclaimedGasTransaction', manageClaimLoader)
      Facade.bus.off('removePendingTransactions', manageClaimLoader)
    }
  }, [address])

  useEffect(() => {
    populateUnclaimed()
    changeSenderAddress()
  }, [account])

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (!isAssetsTabSelected) {
        setCurrentPage(1)
        Facade.await.run('fetchTransaction', () => fetchTransaction(1))
      }
    })

    return () => {
      interactionPromise.cancel()
    }
  }, [isAssetsTabSelected, account])

  const isClaimAvailable = () => {
    return Boolean(unclaimedGasAmount && !isWatchAccount)
  }

  const refresh = () => {
    setCurrentPage(1)
    fetchTransaction(1)
    populateUnclaimed()
  }

  const manageClaimLoader = () => {
    const senderTxs = account.pendingTransactions.flatMap(
      (it) => it.transactions
    )

    const exist = senderTxs.some((it) => it.receiverAddress === account.address)
    if (exist) {
      Facade.await.init(`ClaimGas@${account.address}`)
    } else {
      Facade.await.done(`ClaimGas@${account.address}`)
    }
  }

  const populateUnclaimed = async () => {
    if (!account.address) return

    const request = new AddressRequest(account.address)
    const response = await request.getUnclaimed()

    setUnclaimedGasAmount(response.unclaimed ?? undefined)
  }

  const fetchTransaction = async (currentPage: number) => {
    const {pageNumber} = await account.populateTransactions(
      tokensPool,
      currentPage
    )

    setCurrentPage(pageNumber + 1)

    // Save the new cache
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
  }

  const claimGas = async () => {
    if (Facade.await.inAction(`ClaimGas@${account.address}`)) return
    if (!account.address || !unclaimedGasAmount) return

    Facade.await.init(`ClaimGas@${account.address}`)

    try {
      const txid = await NeonHelper.claimGas(account.address)

      if (txid) {
        await account.addPendingUnclaimedGasTransaction(
          unclaimedGasAmount,
          txid
        )
        await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
      }
    } catch (e) {
      Facade.await.done(`ClaimGas@${account.address}`)
      showMessage({
        message: e.message,
      })
    }
  }

  const cardLayoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setCardHeight(height)
    posYFactor.current.setValue(1)

    // Animated.timing(posYFactor.current, {
    //   toValue: 1,
    //   duration: 500,
    //   useNativeDriver: true,
    //   easing: Easing.out((val) => val ** 2),
    // }).start()
    setShowTabBarSelector(true)
  }
  const [showTabBarSelector, setShowTabBarSelector] = useState(false)
  const BalanceListParam = () => {
    return (
      <BalanceList
        my="16px"
        tokenAssets={account.tokenAssets}
        address={account.address ?? undefined}
        fromAccountView={true}
        fromListWalletView={false}
        fromSendAccountSelectionModal={false}
      />
    )
  }

  const TransactionsTab = () => {
    return account.tokenAssets.length ? (
      <AwaitActivity
        name={'fetchTransaction'}
        size={'large'}
        style={{minHeight: 100}}
      >
        <>
          {account.address && (
            <LinearLayout>
              <TransactionsList
                title={Facade.t('screens.getAccount.pendingTransactions')}
                address={account.address}
                transactionGroups={account.pendingTransactions}
              />

              <TransactionsList
                title={Facade.t('screens.getAccount.completedTransactions')}
                address={account.address}
                transactionGroups={account.transactions}
              />
            </LinearLayout>
          )}

          <AwaitActivity
            name={'loadMoreTransaction'}
            size={'large'}
            style={{minHeight: 100}}
          />
        </>
      </AwaitActivity>
    ) : (
      <TextView
        my="32px"
        color="text.0"
        fontFamily="medium"
        fontSize="18px"
        textAlign="center"
      >
        {Facade.t('components.balanceList.empty')}
      </TextView>
    )
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
      <Animated.View
        onLayout={cardLayoutEvent}
        style={{
          opacity: posYFactor.current,
          transform: [
            {
              translateY: 0,
            },
          ],
        }}
      >
        <LinearLayout mt={6}>
          <AccountCard account={account} isStackMode={false} />
        </LinearLayout>
      </Animated.View>

      <View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('screen').width,
          justifyContent: 'space-around',
          alignSelf: 'center',
          marginVertical: 20,
          elevation: 30,
        }}
      >
        <ThemedReceiveButton
          onPress={() =>
            props.navigation.navigate(Facade.route.Modal.name, {
              screen: Facade.route.ReceiveModalStack.name,
              params: {
                screen: Facade.route.ReceiveToAccountModal.name,
                params: {
                  wallet,
                  account,
                },
              },
            })
          }
        />
        <AwaitActivity name={'populateUnclaimed'}>
          <AwaitActivity
            name={`ClaimGas@${account.address}`}
            loadingView={<ClaimGasLoader />}
          >
            <ThemedClaimButton onPress={claimGas}>
              <TextView
                color={isClaimAvailable() ? 'primary' : 'text.2'}
                opacity={isClaimAvailable() ? 1 : 0.6}
                alignSelf={'center'}
                position={'absolute'}
                fontSize={'16px'}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
              >
                {isClaimAvailable()
                  ? Facade.t('screens.getAccount.claimAsset', {
                      amount: Facade.filter.decimal(
                        unclaimedGasAmount,
                        language,
                        7
                      ),
                    })
                  : Facade.t('screens.getAccount.gasUnavailable')}
              </TextView>
            </ThemedClaimButton>
          </AwaitActivity>
        </AwaitActivity>

        <ThemedSendButton
          account={account}
          onPress={
            isWatchAccount || !account.getBalanceAmount()
              ? undefined
              : () => {
                  props.navigation.navigate(Facade.route.Modal.name, {
                    screen: Facade.route.SendModalStack.name,
                    params: {
                      screen: Facade.route.SendTransactionInputModal.name,
                      params: {
                        walletTitle: wallet?.name ?? '',
                        account,
                      },
                    },
                  })
                }
          }
        />
      </View>
      {showTabBarSelector && (
        <TabSelectorBar
          firstScene={{
            title: 'Assets',
            Element: BalanceListParam,
          }}
          secondScene={{
            title: 'Transactions',
            Element: TransactionsTab,
          }}
          setFirstTabAsSelected={setIsAssetsTabSelected}
        />
      )}
    </ScreenLayout>
  )
}

export default GetAccountView
