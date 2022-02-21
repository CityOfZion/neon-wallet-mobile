import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useEffect, useRef, useCallback} from 'react'
import {
  Animated,
  Easing,
  InteractionManager,
  LayoutChangeEvent,
  Dimensions,
  View,
} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {appBus} from '~/src/app/AppBus'
import {wrapper} from '~/src/app/ApplicationWrapper'
import ModalWarningFee from '~/src/components/ModalWarningFee'
import TransactionsList from '~/src/components/TransactionsList'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {ThemedClaimButton} from '~/src/components/themed/ThemedClaimButton'
import {ThemedSendButton} from '~/src/components/themed/ThemedSendButton'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {useAmountFee} from '~/src/hooks/AmountFeeHook'
import {Node} from '~/src/models/Node'
import {TokenAsset} from '~/src/models/TokenAsset'
import {
  blockchainServices,
  hasWCIntegration,
  isClaimable,
} from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ThemedReceiveButton} from '~src/components/themed/ThemedReceiveButton'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {Lang} from '~src/enums/Lang'
import {NeoNode} from '~src/models/NeoNode'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface GetAccountParams {
  key: string
  navigateToTransactions?: boolean
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const TitleComponent = (props: {nodesPool: NeoNode[]; language: Lang}) => {
  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
        {i18n.t('app.neoBlockHeight')}
      </TextView>

      <TextView color={'text.0'} textAlign={'center'}>
        {FilterHelper.decimal(
          NeoNode.getHighestNodeHeightFromPool(props.nodesPool),
          props.language
        )}
      </TextView>
    </LinearLayout>
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const {sessions} = useWalletConnect()
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const {language} = useSelector((state: RootState) => state.settings)
  const {address} = useSelector((state: RootState) => state.account)

  const posYFactor = useRef(new Animated.Value(0))
  const {isConnected} = useSelector((state: RootState) => state.network)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [currentPage, setCurrentPage] = useState(1)
  const [hasSession, setHasSession] = useState(false)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<number>(0)
  const [isClaimAvailable, setIsClaimAvaliable] = useState<boolean>(false)

  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [nodesPoolBlockchain, setNodesPoolBlockchain] = useState<Node[]>([])

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

  const [totTokenFeeAccount, setTotTokenFeeAccount] = useState<number>(
    account.tokenAssets.find(
      (token) =>
        token.symbol === blockchainServices[account.blockchain].feeToken.token
    )?.amount ?? 0
  )

  const {amount: amountFee, calc: calcFee} = useAmountFee(account.blockchain)

  const handleCalcFee = useCallback(() => {
    const tokenFee = account.tokenAssets.find(
      (it) =>
        blockchainServices[account.blockchain].feeToken.token === it.symbol
    )
    if (tokenFee && account.address && unclaimedGasAmount > 0) {
      const token = new TokenAsset(
        tokenFee.name,
        tokenFee.symbol,
        tokenFee.hash,
        tokenFee.blockchain
      )
      token.amount = unclaimedGasAmount
      calcFee(token, account, account.address)
    }
  }, [account, unclaimedGasAmount, amountFee])

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const isWatchAccount = account.accountType === 'watch'

  props.navigation.setOptions({
    headerTitle: () =>
      TitleComponent({nodesPool: nodesPoolBlockchain, language}),
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.EditAccountModal.name,
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
        RootStore.account.actions.getFromSelection()
      )
      setAccount(account)
    }
    appBus.on('claimGasEnd', refresh)
    appBus.on('transactionEnd', refresh)

    return () => {
      appBus.off('claimGasEnd', refresh)
      appBus.off('transactionEnd', refresh)
    }
  }, [address])

  useEffect(() => {
    populateUnclaimed()
    changeSenderAddress()
    getNodesfromBlockchain()
  }, [account])

  useEffect(() => {
    handleCalcFee()
  }, [unclaimedGasAmount])

  useEffect(() => {
    if (amountFee >= 0) {
      handleIsClaimAvailable()
    }
  }, [amountFee])

  const keepUpdatedInfo = async () => {
    await dispatchAsync(RootStore.app.actions.syncAccounts())
  }

  useEffect(() => {
    keepUpdatedInfo()
  }, [])

  const handleIsClaimAvailable = useCallback(() => {
    if (unclaimedGasAmount > 0 && !isWatchAccount && isConnected) {
      setIsClaimAvaliable(true)
    } else {
      setIsClaimAvaliable(false)
    }
  }, [account, unclaimedGasAmount, isWatchAccount, isConnected])

  const refresh = () => {
    Await.done(`ClaimGas@${account.address}`)
    setCurrentPage(1)
    fetchTransaction(1)
    populateUnclaimed()
    getNodesfromBlockchain()
  }

  const populateUnclaimed = async () => {
    if (!account.address) return

    const request = blockchainServices[account.blockchain].provider
    const response = await request.getUnclaimed(account.address)

    setUnclaimedGasAmount(response.unclaimed ?? 0)
  }

  const getNodesfromBlockchain = async () => {
    const request = blockchainServices[account.blockchain].provider
    const response = await request.getAllNodes()

    setNodesPoolBlockchain(response ?? [])
  }

  const fetchTransaction = async (currentPage: number) => {
    const {pageNumber} = await account.populateTransactions(
      tokensPool,
      currentPage
    )

    setCurrentPage(pageNumber + 1)

    // Save the new cache
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    await dispatchAsync(RootStore.app.actions.syncAccounts())
  }

  const handleClaimGas = useCallback(async () => {
    if (unclaimedGasAmount && unclaimedGasAmount > amountFee) {
      await claimGas()
    } else {
      setShowWarning(true)
    }
  }, [amountFee, totTokenFeeAccount, showWarning, unclaimedGasAmount])

  const claimGas = async () => {
    if (!account.address || !unclaimedGasAmount || !isConnected) return

    try {
      const bs = blockchainServices[account.blockchain]
      if (isClaimable(bs)) {
        Await.init(`ClaimGas@${account.address}`)
        const responseClaim = await bs.claimGas(account.address)
        if (responseClaim?.txid) {
          await account.addPendingUnclaimedGasTransaction(
            unclaimedGasAmount,
            responseClaim.txid,
            responseClaim.token,
            responseClaim.hash
          )
          await dispatchAsync(
            RootStore.app.actions.updateAndSaveAccount(account)
          )
        }
      }
    } catch (e) {
      console.log('error claim gas => ', e)
      Await.done(`ClaimGas@${account.address}`)
      showMessage({
        message: 'Gas has been failed', //TODO: config a message error
        type: 'danger',
        duration: 3000,
      })
    }
  }

  const cardLayoutEvent = (event: LayoutChangeEvent) => {
    posYFactor.current.setValue(1)

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out((val) => val ** 2),
    }).start()
  }

  const hasWalletconnect = () => {
    const bs = blockchainServices[account.blockchain]

    return hasWCIntegration(bs)
  }

  useEffect(() => {
    if (props.route.params.navigateToTransactions) {
      props.navigation.navigate(wrapper.route.AccountTransactionsScreen.name, {
        account,
      })
    }
  }, [props.route.params.navigateToTransactions])

  useEffect(() => {
    if (sessions.length > 0) {
      for (const it of sessions) {
        const [firstAccount] = it.state.accounts
        const [, , address] = firstAccount.split(':')
        const found = account.address === address

        if (found) {
          setHasSession(found)
          break
        }
      }
    }
  }, [sessions])

  return (
    <ScreenLayout
      darkerSolidColorBG={true}
      onReachBottom={() => {
        if (Await.inAction('loadMoreTransaction')) return
        Await.run(
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
        <LinearLayout mt={4}>
          <AccountCard
            account={account}
            hasShadow={false}
            isStackMode={false}
          />
        </LinearLayout>
      </Animated.View>
      <View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('screen').width - 15,
          justifyContent: 'space-around',
          alignSelf: 'center',
          marginVertical: 5,
          elevation: 15,
        }}
      >
        <ThemedReceiveButton
          onPress={() =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ReceiveModalStack.name,
              params: {
                screen: wrapper.route.ReceiveToAccountModal.name,
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
            <ThemedClaimButton
              onPress={handleClaimGas}
              isClaimAvailable={isClaimAvailable}
              unclaimedGasAmount={unclaimedGasAmount ?? 0}
              fee={amountFee}
            />
          </AwaitActivity>
        </AwaitActivity>

        <ThemedSendButton
          account={account}
          onPress={
            isWatchAccount || !account.getBalanceAmount() || !isConnected
              ? undefined
              : () => {
                  props.navigation.navigate(wrapper.route.Modal.name, {
                    screen: wrapper.route.SendModalStack.name,
                    params: {
                      screen: wrapper.route.SendTransactionInputModal.name,
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
      <LinearLayout>
        <ThemedButton
          px={30}
          height={88}
          textAlignX={'flex-start'}
          textColor={'primary'}
          fontSize={17}
          fontFamily={'medium'}
          label={i18n.t('screens.screenLayout.assets')}
          srcIcon={require('~/src/assets/images/Equalizer_-_simple-line-icons.png')}
          iconSize={[28, 24]}
          onPress={() => {
            props.navigation.navigate(wrapper.route.AccountAssetScreen.name)
          }}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
        />
        <ThemedButton
          px={30}
          height={88}
          textAlignX={'flex-start'}
          textColor={'primary'}
          fontSize={17}
          fontFamily={'medium'}
          label={i18n.t('screens.screenLayout.transactions')}
          srcIcon={require('~/src/assets/images/icon-reselect-green.png')}
          iconSize={[28, 30]}
          onPress={() => {
            props.navigation.navigate(
              wrapper.route.AccountTransactionsScreen.name,
              {
                account,
              }
            )
          }}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
        />
        <ThemedButton
          px={30}
          height={88}
          disabled={!hasWalletconnect() || !hasSession}
          textAlignX={'flex-start'}
          textColor={'primary'}
          fontSize={17}
          fontFamily={'medium'}
          label={i18n.t('screens.screenLayout.connections')}
          srcIcon={require('~/src/assets/images/connections.png')}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
          iconSize={[28, 30]}
          onPress={() => {
            props.navigation.navigate(
              wrapper.route.WCAccountConnectionsScreen.name,
              {
                account,
              }
            )
          }}
        />
      </LinearLayout>
      <ModalWarningFee
        onPress={claimGas}
        totTokenFeeAccount={totTokenFeeAccount}
        unclaimedGasAmount={unclaimedGasAmount ?? 0}
        amountFee={amountFee ?? 0}
        showWarning={showWarning}
        setShowWarning={(show) => setShowWarning(show)}
      />
    </ScreenLayout>
  )
}

export default GetAccountView
