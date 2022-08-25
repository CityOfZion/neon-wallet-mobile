import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Animated, ImageLoadEventData, RefreshControl } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { appBus } from '~/src/app/AppBus'
import { wrapper } from '~/src/app/ApplicationWrapper'
import ModalWarningFee from '~/src/components/ModalWarningFee'
import { ThemedClaimButton } from '~/src/components/themed/ThemedClaimButton'
import { ThemedSendButton } from '~/src/components/themed/ThemedSendButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { Wallet } from '~/src/models/redux/Wallet'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { blockchainServices, hasWCIntegration, isClaimable } from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ThemedReceiveButton } from '~src/components/themed/ThemedReceiveButton'
import { useWalletConnect } from '~src/contexts/WalletConnectContext'
import { NeoNode } from '~src/models/NeoNode'
import { Account } from '~src/models/redux/Account'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface GetAccountViewParams {
  account: Account
  wallet: Wallet
}
interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

interface ButtonProps {
  onPress: () => void
  label: string
  srcIcon: ImageLoadEventData
  iconSize: [number, number]
  disabled?: boolean
}

interface TitleProps {
  account: Account
}

const Title = ({ account }: TitleProps) => {
  const language = useSelector((state: RootState) => state.settings.language)
  const [highestNode, setHighestNode] = useState<string>()

  const handleGetHighestNode = async () => {
    const nodes = await blockchainServices[account.blockchain].provider.getAllNodes()

    const highest = NeoNode.getHighestNodeHeightFromPool(nodes)

    setHighestNode(FilterHelper.decimal(highest, language))
  }

  useEffect(() => {
    handleGetHighestNode()
  }, [language])

  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color="text.3" textAlign="center" fontSize={10}>
        {i18n.t('app.neoBlockHeight')}
      </TextView>

      <TextView color="text.0" textAlign="center">
        {highestNode}
      </TextView>
    </LinearLayout>
  )
}

const Button = ({ label, onPress, srcIcon, iconSize, disabled }: ButtonProps) => {
  return (
    <ThemedButton
      px={30}
      my={5}
      height={88}
      disabled={disabled}
      textAlignX="flex-start"
      textColor="text.0"
      fontSize="17px"
      fontFamily="medium"
      label={label}
      srcIcon={srcIcon}
      suffix={
        <ImageView
          width={20}
          height={20}
          resizeMode="contain"
          source={require('~src/assets/images/icon-arrow-right-green.png')}
        />
      }
      iconSize={iconSize}
      onPress={onPress}
      isDark
    />
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const { account, wallet } = props.route.params

  props.navigation.setOptions({
    headerTitle: () => <Title account={account} />,
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'more',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.AccountSettingsView.name, {
            account,
            wallet,
          })
        },
      }),
  })

  const wallets = useSelector(selectWallets)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const dispatch = useDispatch()
  const { sessions } = useWalletConnect()

  const opacityValue = useRef(new Animated.Value(0))

  const balanceExchange = useBalancesAndExchange(account)

  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<number>()
  const [fee, setFee] = useState<number>()

  const isClaimAvailable = useMemo(() => {
    if (fee && unclaimedGasAmount && account.accountType !== 'watch' && isConnected) {
      return true
    }

    return false
  }, [fee, unclaimedGasAmount, account, isConnected])

  const hasWalletConnectSessions = useMemo(
    () =>
      sessions.some(session => {
        const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

        return address === account.address
      }),
    [sessions]
  )

  const totTokenFeeAccount = useMemo(() => {
    const { balance } = balanceExchange

    if (!balance.data) return 0

    const tokenBalance = balance.data.tokensBalances.find(
      tokenBalance => tokenBalance.symbol === blockchainServices[account.blockchain].feeToken.token
    )

    if (!tokenBalance) return 0

    return tokenBalance.amount
  }, [balanceExchange, account])

  const totalBalance = useMemo(
    () => BalanceHelper.calculateTotalBalances(balanceExchange.balance.data, balanceExchange.exchange.data),
    [balanceExchange]
  )

  const handleClaimGas = () => {
    if (!unclaimedGasAmount || !fee || unclaimedGasAmount < fee) {
      setShowWarning(true)
      return
    }

    claimGas()
  }

  const claimGas = async () => {
    if (!account.address || !isConnected || !unclaimedGasAmount) return

    try {
      const bs = blockchainServices[account.blockchain]

      if (isClaimable(bs)) {
        Await.init(`claimGas`)

        const responseClaim = await bs.claimGas(account.address)

        if (!responseClaim || !responseClaim.txid || !responseClaim.fee) return

        await account.addPendingTransaction(
          responseClaim.txid,
          'claim',
          account.address,
          { hash: responseClaim.hash, symbol: responseClaim.token, name: '', blockchain: account.blockchain },
          unclaimedGasAmount,
          responseClaim.fee
        )
        dispatch(
          accountReducerActions.watchPendingTransaction({ account, transactionHash: responseClaim.txid, isClaim: true })
        )
      }
    } catch {
      showMessage({
        message: i18n.t('screens.getAccount.claimError'),
        type: 'danger',
        duration: 3000,
      })
    } finally {
      Await.done(`claimGas`)
    }
  }

  const populateFee = useCallback(async () => {
    if (!account.address || !unclaimedGasAmount) return

    const calculatedFee = await blockchainServices[account.blockchain].calculateTransferFee({
      receiverAddress: account.address,
      senderAddress: account.address,
      amount: unclaimedGasAmount,
      tokenHash: blockchainServices[account.blockchain].feeToken.hash,
    })

    setFee(calculatedFee)
  }, [account, unclaimedGasAmount])

  const populateUnclaimed = async () => {
    if (!account.address) {
      return
    }

    const request = blockchainServices[account.blockchain].provider
    const response = await request.getUnclaimed(account.address)
    setUnclaimedGasAmount(response.unclaimed ?? undefined)
  }

  const hasWalletconnect = () => {
    const bs = blockchainServices[account.blockchain]

    return hasWCIntegration(bs)
  }

  const handlePressReceiveButton = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReceiveTransactionModal.name,
      params: {
        account,
        wallet,
      },
    })
  }

  const handlePressSendButton = () => {
    const wallet = account.getWallet(wallets)

    if (!wallet) return

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionModal.name,
      params: {
        account,
        wallet,
      },
    })
  }

  const handlePressAssetsButton = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.AccountAssetScreen.name,
        params: {
          account,
        },
      },
    })
  }

  const handlePressTransactionsButton = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.AccountTransactionsScreen.name,
        params: {
          account,
        },
      },
    })
  }

  const handlePressNFTsButton = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.AccountNFTSScreen.name,
        params: {
          account,
        },
      },
    })
  }

  const handlePressConnectionsButton = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.AccountConnectionsScreen.name,
        params: {
          account,
        },
      },
    })
  }

  const handleLayout = () => {
    Animated.timing(opacityValue.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

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
  }, [account])

  useEffect(() => {
    populateFee()
  }, [unclaimedGasAmount])

  return (
    <ScreenLayout
      refreshControl={
        <RefreshControl
          tintColor="#fff"
          refreshing={balanceExchange.isRefetchingByUser}
          onRefresh={balanceExchange.refetch}
        />
      }
      darkerSolidColorBG
    >
      <LinearLayout mt={4}>
        <AccountCard onLayout={handleLayout} hideBalance={false} balanceExchange={balanceExchange} account={account} />
      </LinearLayout>

      <Animated.View
        style={{
          opacity: opacityValue.current,
        }}
      >
        <LinearLayout
          orientation="horiz"
          width="100%"
          marginX="15px"
          justifyContent="space-around"
          alignSelf="center"
          marginY="20px"
          style={{
            elevation: 30,
          }}
        >
          <ThemedReceiveButton onPress={handlePressReceiveButton} isDark />
          <AwaitActivity name={`ClaimGas@${account.address}`} loadingView={<ClaimGasLoader />}>
            <ThemedClaimButton
              onPress={handleClaimGas}
              isClaimAvailable={isClaimAvailable}
              unclaimedGasAmount={unclaimedGasAmount ?? 0}
              fee={fee ?? null}
              isDark
            />
          </AwaitActivity>

          <ThemedSendButton
            onPress={handlePressSendButton}
            isDark
            isInactive={!totalBalance || totalBalance <= 0 || account.accountType === 'watch' || !isConnected}
          />
        </LinearLayout>
        <LinearLayout>
          <Button
            label={i18n.t('screens.screenLayout.assets').toUpperCase()}
            srcIcon={require('~/src/assets/images/Equalizer_-_simple-line-icons.png')}
            iconSize={[28, 24]}
            onPress={handlePressAssetsButton}
          />
          <Button
            label={i18n.t('screens.screenLayout.transactions').toUpperCase()}
            srcIcon={require('~/src/assets/images/icon-reselect-green.png')}
            iconSize={[28, 30]}
            onPress={handlePressTransactionsButton}
          />

          <Button
            label={i18n.t('screens.screenLayout.nfts').toUpperCase()}
            srcIcon={require('~/src/assets/images/diamond-green.png')}
            iconSize={[28, 30]}
            onPress={handlePressNFTsButton}
          />

          <Button
            disabled={!hasWalletconnect() || !hasWalletConnectSessions}
            label={i18n.t('screens.screenLayout.connections').toUpperCase()}
            srcIcon={require('~/src/assets/images/connections.png')}
            iconSize={[28, 30]}
            onPress={handlePressConnectionsButton}
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
      </Animated.View>
    </ScreenLayout>
  )
}

export default GetAccountView
