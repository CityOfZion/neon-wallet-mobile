import {AccountJSON} from '@cityofzion/neon-core-next/lib/wallet/Account'
import {Account as NeoAccount} from '@cityofzion/neon-core/lib/wallet'
import {wallet as walletWC} from '@cityofzion/neon-js-next'
import {JsonRpcRequest} from '@json-rpc-tools/utils'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import {SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import {KeyValueStorage} from 'keyvaluestorage'
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
import InputWithValidation from '~/src/components/InputWithValidation'
import ModalWarningFee from '~/src/components/ModalWarningFee'
import TransactionsList from '~/src/components/TransactionsList'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {ThemedClaimButton} from '~/src/components/themed/ThemedClaimButton'
import {ThemedSendButton} from '~/src/components/themed/ThemedSendButton'
import {applicationConfig} from '~/src/config/ApplicationConfig'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {useAmountFee} from '~/src/hooks/AmountFeeHook'
import {Node} from '~/src/models/Node'
import {TokenAsset} from '~/src/models/TokenAsset'
import {isClaimable, canConnect} from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import {TabSelectorBar} from '~src/components/TabSelector'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import {ThemedReceiveButton} from '~src/components/themed/ThemedReceiveButton'
import {
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_NETWORKS,
  DEFAULT_RELAY_PROVIDER,
} from '~src/config/walletConnect/constants'
import {
  WalletConnectContextProvider,
  useWalletConnect,
} from '~src/contexts/WalletConnectContext'
import {Lang} from '~src/enums/Lang'
import {N3Helper} from '~src/helpers/N3Helper'
import {NeoNode} from '~src/models/NeoNode'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ButtonView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface GetAccountParams {
  key: string
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const wcOptions = {
  appMetadata: DEFAULT_APP_METADATA,
  chainIds: Object.keys(DEFAULT_NETWORKS),
  logger: DEFAULT_LOGGER,
  methods: DEFAULT_METHODS,
  relayServer: DEFAULT_RELAY_PROVIDER,
}

const disabledSendImage = require('~/src/assets/images/button-send-small-disabled.png')
const selectedSendImage = require('~/src/assets/images/button-send-small-selected.png')
const defaultSendImage = require('~/src/assets/images/button-send-small.png')

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

const BalanceListParam = () => {
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()
  const [account, setAccount] = useState(
    dispatchAccount(RootStore.account.actions.getFromSelection())
  )
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  useEffect(() => {
    const upAccount =
      accountsPool.find((acc) => acc.address === account.address) ??
      new Account()
    setAccount(upAccount)
  }, [accountsPool])
  return (
    <BalanceList
      my="16px"
      tokenAssets={account.getTokenAssets()}
      address={account.address ?? undefined}
      fromAccountView={true}
      fromListWalletView={false}
      fromSendAccountSelectionModal={false}
      zeroBalance={true}
    />
  )
}

const TransactionsTab = () => {
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()
  const [account, setAccount] = useState(
    dispatchAccount(RootStore.account.actions.getFromSelection())
  )

  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  useEffect(() => {
    const upAccount =
      accountsPool.find((acc) => acc.address === account.address) ??
      new Account()
    setAccount(upAccount)
  }, [accountsPool])

  return account.getTransactions().length ? (
    <AwaitActivity
      name={'fetchTransaction'}
      size={'large'}
      style={{minHeight: 100}}
      loadingView={<ScreenLoader invertedGradient={true} />}
    >
      <>
        {account.address && (
          <LinearLayout pt={20}>
            <TransactionsList
              title={i18n.t('screens.getAccount.pendingTransactions')}
              address={account.address}
              transactionGroups={account.getPendingTransactions()}
            />

            <TransactionsList
              title={i18n.t('screens.getAccount.completedTransactions')}
              address={account.address}
              transactionGroups={account.getTransactions()}
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
      {i18n.t('components.balanceList.empty')}
    </TextView>
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const {language} = useSelector((state: RootState) => state.settings)
  const {address, blockchain} = useSelector((state: RootState) => state.account)

  const posYFactor = useRef(new Animated.Value(0))
  const {isConnected} = useSelector((state: RootState) => state.network)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [currentPage, setCurrentPage] = useState(1)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  const [showTabBarLabels, setShowTabBarLabels] = useState(false)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<number>(0)
  const [isClaimAvailable, setIsClaimAvaliable] = useState<boolean>(false)

  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [nodesPoolBlockchain, setNodesPoolBlockchain] = useState<Node[]>([])
  const [loading, setLoading] = useState(false)

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
  const walletConnectCtx = useWalletConnect()
  const bs = applicationConfig.blockchain[account.blockchain]
  const [connectingWallet, setConnectingWallet] = useState(false)
  const [connectingApp, setConnectingApp] = useState(false)
  const [requestString, setRequestString] = useState<string>('')
  const [requestOpen, setRequestOpen] = useState<
    SessionTypes.RequestEvent | undefined
  >(undefined)

  // useEffect(() => {
  //   if (canConnect(bs)) {
  //     setConnectingApp(!walletConnectCtx.sessions.length)
  //   }
  // }, [walletConnectCtx.sessions])

  useEffect(() => {
    // if the request method is 'testInvoke' or 'multiTestInvoke' we auto-accept it
    if (canConnect(bs)) {
      walletConnectCtx.autoAcceptIntercept(
        (acc, chain, req: JsonRpcRequest) =>
          req.method === 'testInvoke' || req.method === 'multiTestInvoke'
      )

      walletConnectCtx.onRequestListener(
        async (acc, chain, req: JsonRpcRequest) =>
          await await bs.rpcCall(address ?? '', req)
      )
      if (address !== null) {
        setWCAccount(address)
      }
    }
  }, [account])

  const [totTokenFeeAccount, setTotTokenFeeAccount] = useState<number>(
    account.tokenAssets.find(
      (token) =>
        token.symbol ===
        applicationConfig.blockchain[account.blockchain].feeToken.token
    )?.amount ?? 0
  )

  const {amount: amountFee, calc: calcFee} = useAmountFee(account.blockchain)

  const handleCalcFee = useCallback(() => {
    const tokenFee = account.tokenAssets.find(
      (it) =>
        applicationConfig.blockchain[account.blockchain].feeToken.token ===
        it.symbol
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

    appBus.on('claimGasStart', refresh)
    appBus.on('claimGasEnd', refresh)
    appBus.on('transactionStart', refresh)
    appBus.on('transactionEnd', refresh)
    appBus.on('updateTransactions', handleUpdateTransactions)
    appBus.on('ClaimGasFinished', availableClaimGasButton)

    return () => {
      appBus.off('claimGasStart', refresh)
      appBus.off('claimGasEnd', refresh)
      appBus.off('transactionStart', refresh)
      appBus.off('transactionEnd', refresh)
      appBus.on('ClaimGasFinished', availableClaimGasButton)
    }
  }, [address])

  useEffect(() => {
    populateUnclaimed()
    changeSenderAddress()
    getNodesfromBlockchain()
  }, [account])

  useEffect(() => {
    handleCalcFee()
    Await.done(`ClaimGas@${account.address}`)
  }, [unclaimedGasAmount])

  useEffect(() => {
    if (amountFee >= 0) {
      handleIsClaimAvailable()
    }
  }, [amountFee])

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (!isAssetsTabSelected) {
        setCurrentPage(1)
        Await.run('fetchTransaction', () => fetchTransaction(1))
      }
    })

    return () => {
      interactionPromise.cancel()
    }
  }, [isAssetsTabSelected, account])

  const keepUpdatedInfo = async () => {
    await dispatchAsync(RootStore.app.actions.syncAccounts())
  }

  useEffect(() => {
    keepUpdatedInfo()
    if (walletConnectCtx.storage) {
      loadAccountToStorage(walletConnectCtx.storage)
    }
  }, [walletConnectCtx.initialized])

  const setWCAccount = (acc: string) => {
    walletConnectCtx.clearAccountAndChain()
    walletConnectCtx.addAccountAndChain(acc, DEFAULT_NETWORKS['neo3:mainnet'])
    setConnectingWallet(true)
    alert('Connected')
  }

  const disconnectWCAccount = (acc: string) => {
    walletConnectCtx.removeAccountAndChain(
      acc,
      DEFAULT_NETWORKS['neo3:mainnet']
    )
    setConnectingWallet(false)
    alert('Disconnected')
  }

  const loadAccountToStorage = useCallback(
    async (storage: KeyValueStorage) => {
      alert('passa aqui!')
      // const json = await storage.getItem<Partial<AccountJSON>>('account')
      if (account.address !== null) {
        //const account = new walletWC.Account(json)
        setWCAccount(account.address)
      }
    },
    [account]
  )

  useEffect(() => {
    if (walletConnectCtx.storage) {
      loadAccountToStorage(walletConnectCtx.storage)
    }
  }, [loadAccountToStorage, walletConnectCtx.storage, account])

  const handleIsClaimAvailable = useCallback(() => {
    if (unclaimedGasAmount > 0 && !isWatchAccount && isConnected) {
      setIsClaimAvaliable(true)
    } else {
      setIsClaimAvaliable(false)
    }
  }, [account, unclaimedGasAmount, isWatchAccount, isConnected])

  const refresh = () => {
    setCurrentPage(1)
    fetchTransaction(1)
    populateUnclaimed()
    getNodesfromBlockchain()
  }

  const availableClaimGasButton = () => {
    Await.done(`ClaimGas@${account.address}`)
  }

  const populateUnclaimed = async () => {
    if (!account.address) return

    const request = applicationConfig.blockchain[account.blockchain].provider
    const response = await request.getUnclaimed(account.address)

    setUnclaimedGasAmount(response.unclaimed ?? 0)
  }

  const getNodesfromBlockchain = async () => {
    const request = applicationConfig.blockchain[account.blockchain].provider
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

  const handleUpdateTransactions = () => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (!isAssetsTabSelected) {
        setCurrentPage(1)
        Await.run('fetchTransaction', () => fetchTransaction(1))
      }
    })

    return () => {
      interactionPromise.cancel()
    }
  }

  const handleClaimGas = useCallback(async () => {
    if (unclaimedGasAmount && unclaimedGasAmount > amountFee) {
      await claimGas()
    } else {
      setShowWarning(true)
    }
  }, [amountFee, totTokenFeeAccount, showWarning, unclaimedGasAmount])

  const ShowConnetion = () => {
    const firstProposal = walletConnectCtx.sessionProposals[0]
    return (
      <>
        <TextView> {'Connected'}</TextView>
        {/* {!!walletConnectCtx.sessionProposals.length &&
          (firstProposal.permissions.jsonrpc.methods.length ? (
            <>
              <ButtonView
                onPress={() => walletConnectCtx.approveSession(firstProposal)}
              >
                <TextView color="#fff" fontFamily={'medium'} fontSize={'14px'}>
                  {'Approve'}
                </TextView>
              </ButtonView>
              <ButtonView
                onPress={() => walletConnectCtx.rejectSession(firstProposal)}
              >
                <TextView color="#fff" fontFamily={'medium'} fontSize={'14px'}>
                  {'Reject'}
                </TextView>
              </ButtonView>
            </>
          ) : (
            <View />
          ))} */}
      </>
    )
  }

  const claimGas = async () => {
    if (!account.address || !unclaimedGasAmount || !isConnected) return

    try {
      const bs = applicationConfig.blockchain[account.blockchain]
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
    setTimeout(() => setShowTabBarSelector(true), 500)
    setTimeout(() => setShowTabBarLabels(true), 1000)
  }
  const [showTabBarSelector, setShowTabBarSelector] = useState(false)

  const handleChangeScene = (index: number) => {
    if (index === 0) {
      setIsAssetsTabSelected(true)
    } else {
      setIsAssetsTabSelected(false)
    }
  }

  const handleInput = async (value: string) => {
    setLoading(true)
    console.log('wcClient' + walletConnectCtx.wcClient)
    // try {
    //   await walletConnectCtx.onURI(value)
    // } catch (e) {
    //   alert(e)
    //   setLoading(false)
    // }
  }

  return (
    <ScreenLayout
      invertedGradient={true}
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
        <LinearLayout mt={6}>
          <AccountCard account={account} isStackMode={false} />
        </LinearLayout>
      </Animated.View>

      <View
        style={{
          flexDirection: 'column',
          //width: Dimensions.get('screen').width - 15,
          justifyContent: 'space-around',
          alignSelf: 'center',
          marginVertical: 20,
          elevation: 30,
        }}
      >
        {loading ? <TextView> {'Loading'}</TextView> : <View />}
        <ButtonView
          alignSelf="center"
          //width="2%"
          onPress={() => {
            if (account.address !== null) {
              setWCAccount(account.address)
            }
          }}
          mb={'20px'}
        >
          <TextView
            style={{
              flexDirection: 'row',
            }}
            color="#fff"
            fontFamily={'medium'}
            fontSize={'20px'}
          >
            {'Connect'}
          </TextView>
        </ButtonView>
        <ButtonView
          alignSelf="center"
          //width="2%"
          onPress={() => {
            if (account.address !== null) {
              disconnectWCAccount(account.address)
            }
          }}
          mb={'20px'}
        >
          <TextView
            style={{
              flexDirection: 'row',
            }}
            color="#fff"
            fontFamily={'medium'}
            fontSize={'20px'}
          >
            {'Disconnect'}
          </TextView>
        </ButtonView>
        {connectingWallet && (
          <>
            <ButtonView
              alignSelf="center"
              //width="2%"
              onPress={() => {
                handleInput(requestString)
              }}
              //mt={'-20px'}
              mb={'20px'}
            >
              <TextView
                style={{
                  flexDirection: 'row',
                }}
                color="#fff"
                fontFamily={'medium'}
                fontSize={'20px'}
              >
                {'Submit'}
              </TextView>
            </ButtonView>
            <InputWithValidation
              placeholder={i18n.t('modals.editWallet.namePlaceholder')}
              onChangeText={(val) => setRequestString(val)}
              color={'background.4'}
              value={requestString}
              validator={(val) => true}
              separatorColor={'background.3'}
              invalidColor={'background.3'}
              invalidMessageColor={'quinary'}
              sideMargins={0}
              hideScan={true}
              hidePaste={false}
            />
          </>
        )}
        {connectingApp && <ShowConnetion />}
        {/* <View
          style={{
            flexDirection: 'row',
            width: Dimensions.get('screen').width - 15,
            justifyContent: 'space-around',
            alignSelf: 'center',
            marginVertical: 20,
            elevation: 30,
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
        */}
      </View>
      {/* {showTabBarSelector && (
        <TabSelectorBar
          firstScene={{
            title: 'Assets',
            Element: BalanceListParam,
          }}
          secondScene={{
            title: 'Transactions',
            Element: TransactionsTab,
          }}
          handleIndex={handleChangeScene}
        />
      )}
      <ModalWarningFee
        onPress={claimGas}
        totTokenFeeAccount={totTokenFeeAccount}
        unclaimedGasAmount={unclaimedGasAmount ?? 0}
        amountFee={amountFee ?? 0}
        showWarning={showWarning}
        setShowWarning={(show) => setShowWarning(show)}
      /> */}
    </ScreenLayout>
  )
}

export default GetAccountView
