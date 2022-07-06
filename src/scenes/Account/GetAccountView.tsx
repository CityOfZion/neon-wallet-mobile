import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Animated, Easing, LayoutChangeEvent, Dimensions, View, RefreshControl } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { appBus } from '~/src/app/AppBus'
import { wrapper } from '~/src/app/ApplicationWrapper'
import ModalWarningFee from '~/src/components/ModalWarningFee'
import { ThemedClaimButton } from '~/src/components/themed/ThemedClaimButton'
import { ThemedSendButton } from '~/src/components/themed/ThemedSendButton'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useExchange } from '~/src/hooks/useExchange'
import { Node } from '~/src/models/Node'
import { AsyncDispatch, SyncDispatch } from '~/src/types/reducers/root'
import { blockchainServices, hasWCIntegration, isClaimable } from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ThemedReceiveButton } from '~src/components/themed/ThemedReceiveButton'
import { useWalletConnect } from '~src/contexts/WalletConnectContext'
import { Lang } from '~src/enums/Lang'
import { NeoNode } from '~src/models/NeoNode'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const TitleComponent = (props: { nodesPool: NeoNode[]; language: Lang }) => {
  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color="text.3" textAlign="center" fontSize={10}>
        {i18n.t('app.neoBlockHeight')}
      </TextView>

      <TextView color="text.0" textAlign="center">
        {FilterHelper.decimal(NeoNode.getHighestNodeHeightFromPool(props.nodesPool), props.language)}
      </TextView>
    </LinearLayout>
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const { sessions } = useWalletConnect()
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const { language, currency } = useSelector((state: RootState) => state.settings)
  const { address } = useSelector((state: RootState) => state.account)
  const posYFactor = useRef(new Animated.Value(0))
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const { exchange, isRefetching, refetch } = useExchange({ filter: { currencies: currency } })
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
  const [account, setAccount] = useState(() => dispatchAccount(RootStore.account.actions.getFromSelection()))

  const [totTokenFeeAccount] = useState<number>(
    account.tokenAssets.find(token => token.symbol === blockchainServices[account.blockchain].feeToken.token)?.amount ??
      0
  )

  const [fee, setFee] = useState<number>()

  const handleCalcFee = useCallback(async () => {
    const tokenFee = account.tokenAssets.find(it => blockchainServices[account.blockchain].feeToken.token === it.symbol)
    if (tokenFee && account.address && unclaimedGasAmount > 0) {
      const calculatedFee = await blockchainServices[account.blockchain].calculateTransferFee({
        receiverAddress: account.address,
        senderAddress: account.address,
        amount: unclaimedGasAmount,
        tokenHash: tokenFee.hash,
      })

      setFee(calculatedFee)
    }
  }, [account, unclaimedGasAmount])

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const isWatchAccount = account.accountType === 'watch'

  props.navigation.setOptions({
    headerTitle: () => TitleComponent({ nodesPool: nodesPoolBlockchain, language }),
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'more',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.AccountSettingsView.name, {
            account,
          })
        },
      }),
  })

  useFocusEffect(() => {
    const account = dispatchAccount(RootStore.account.actions.getFromSelection())

    setAccount(account)
  })

  useEffect(() => {
    changeSenderAddress()
    getNodesfromBlockchain()
  }, [account])

  useEffect(() => {
    appBus.on('claimGasEnd', async () => {
      await populateUnclaimed()
      Await.done(`ClaimGas@${account.address}`)
    })
    populateUnclaimed()

    return () => {
      appBus.off('claimGasEnd', () => {
        Await.done(`ClaimGas@${account.address}`)
      })
    }
  }, [account.tokenAssets])

  useEffect(() => {
    handleCalcFee()
  }, [unclaimedGasAmount])

  useEffect(() => {
    if (fee && fee >= 0) {
      handleIsClaimAvailable()
    }
  }, [fee])

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

  const populateUnclaimed = async () => {
    if (!account.address) {
      return
    }

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
    const { pageNumber } = await account.populateTransactions(tokensPool, currentPage)

    setCurrentPage(pageNumber + 1)

    // Save the new cache
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    await dispatchAsync(RootStore.app.actions.syncAccounts())
  }

  const handleClaimGas = useCallback(async () => {
    if (unclaimedGasAmount && fee && unclaimedGasAmount > fee) {
      await claimGas()
    } else {
      setShowWarning(true)
    }
  }, [fee, totTokenFeeAccount, showWarning, unclaimedGasAmount])

  const claimGas = async () => {
    if (!account.address || !unclaimedGasAmount || !isConnected) {
      return
    }

    try {
      const bs = blockchainServices[account.blockchain]

      if (isClaimable(bs)) {
        Await.init(`ClaimGas@${account.address}`)

        const responseClaim = await bs.claimGas(account.address)

        if (!responseClaim || !responseClaim.txid || !responseClaim.fee) {
          return
        }

        const tokenAsset = tokensPool.find(token => token.hash === responseClaim.hash)

        if (!tokenAsset) {
          return
        }

        await account.addPendingTransaction(
          responseClaim.txid,
          'claim',
          account.address,
          tokenAsset,
          unclaimedGasAmount,
          responseClaim.fee
        )

        await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
        dispatchAsync(RootStore.app.actions.syncAccounts())
        dispatchAsync(RootStore.app.actions.watchPendingTransaction(account, responseClaim.txid, true))
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
      easing: Easing.out(val => val ** 2),
    }).start()
  }

  const hasWalletconnect = () => {
    const bs = blockchainServices[account.blockchain]

    return hasWCIntegration(bs)
  }

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
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={refetch} />}
      darkerSolidColorBG
      onReachBottom={() => {
        if (Await.inAction('loadMoreTransaction')) {
          return
        }
        Await.run('loadMoreTransaction', () => fetchTransaction(currentPage), 500)
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
          <AccountCard exchange={exchange} account={account} hasShadow={false} isStackMode={false} />
        </LinearLayout>
      </Animated.View>
      <View
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
          isDark
        />
        <AwaitActivity name="populateUnclaimed">
          <AwaitActivity name={`ClaimGas@${account.address}`} loadingView={<ClaimGasLoader />}>
            <ThemedClaimButton
              onPress={handleClaimGas}
              isClaimAvailable={isClaimAvailable}
              unclaimedGasAmount={unclaimedGasAmount ?? 0}
              fee={fee ?? 0}
              isDark
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
                    screen: wrapper.route.SendTransactionModal.name,
                    params: {
                      wallet,
                      account,
                    },
                  })
                }
          }
          isDark
        />
      </View>
      <LinearLayout>
        <ThemedButton
          px={30}
          my={5}
          height={88}
          textAlignX="flex-start"
          textColor="text.0"
          fontSize="17px"
          fontFamily="medium"
          label={i18n.t('screens.screenLayout.assets').toUpperCase()}
          srcIcon={require('~/src/assets/images/Equalizer_-_simple-line-icons.png')}
          iconSize={[28, 24]}
          onPress={() => {
            props.navigation.navigate(wrapper.route.AccountAssetScreen.name)
          }}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode="contain"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
          isDark
        />
        <ThemedButton
          px={30}
          my={5}
          height={88}
          textAlignX="flex-start"
          textColor="text.0"
          fontSize="17px"
          fontFamily="medium"
          label={i18n.t('screens.screenLayout.transactions').toUpperCase()}
          srcIcon={require('~/src/assets/images/icon-reselect-green.png')}
          iconSize={[28, 30]}
          onPress={() => {
            props.navigation.navigate(wrapper.route.AccountTransactionsScreen.name, {
              account,
            })
          }}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode="contain"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
          isDark
        />

        <ThemedButton
          px={30}
          my={5}
          height={88}
          textAlignX="flex-start"
          textColor="text.0"
          fontSize="17px"
          fontFamily="medium"
          label={i18n.t('screens.screenLayout.nfts').toUpperCase()}
          srcIcon={require('~/src/assets/images/diamond-green.png')}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode="contain"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
          iconSize={[28, 30]}
          onPress={() => {
            props.navigation.navigate(wrapper.route.AccountNFTSScreen.name, {
              account,
            })
          }}
          isDark
        />

        <ThemedButton
          px={30}
          my={5}
          height={88}
          disabled={!hasWalletconnect() || !hasSession}
          textAlignX="flex-start"
          textColor="text.0"
          fontSize="17px"
          fontFamily="medium"
          label={i18n.t('screens.screenLayout.connections').toUpperCase()}
          srcIcon={require('~/src/assets/images/connections.png')}
          suffix={
            <ImageView
              width={20}
              height={20}
              resizeMode="contain"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          }
          iconSize={[28, 30]}
          onPress={() => {
            props.navigation.navigate(wrapper.route.AccountConnectionsScreen.name, {
              account,
            })
          }}
          isDark
        />
      </LinearLayout>
      <ModalWarningFee
        onPress={claimGas}
        totTokenFeeAccount={totTokenFeeAccount}
        unclaimedGasAmount={unclaimedGasAmount ?? 0}
        amountFee={fee ?? 0}
        showWarning={showWarning}
        setShowWarning={show => setShowWarning(show)}
      />
    </ScreenLayout>
  )
}

export default GetAccountView
