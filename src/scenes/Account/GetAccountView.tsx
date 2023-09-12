import { isCalculableFee, isClaimable } from '@cityofzion/blockchain-service'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Animated, Dimensions, ImageLoadEventData, RefreshControl } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { appBus } from '~/src/app/AppBus'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import ModalWarningFee from '~/src/components/ModalWarningFee'
import { ThemedClaimButton } from '~/src/components/themed/ThemedClaimButton'
import ThemedMoreButton from '~/src/components/themed/ThemedMoreButton'
import { ThemedSendButton } from '~/src/components/themed/ThemedSendButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useLocalTokens } from '~/src/hooks/useTokens'
import { Account } from '~/src/store/account/Account'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { Wallet } from '~/src/store/wallet/Wallet'
import AccountCard from '~src/components/AccountCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ThemedReceiveButton } from '~src/components/themed/ThemedReceiveButton'
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
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )

  const [height, setHeight] = useState<number>()

  useEffect(() => {
    blockchainService.blockchainDataService.getBlockHeight().then(setHeight)
  }, [language])

  return (
    <LinearLayout width={Normalize.scale(Dimensions.get('screen').width)} alignItems="center" justifyContent="center">
      <TextView color="text.3" textAlign="center" fontSize={10}>
        {i18n.t('app.neoBlockHeight')}
      </TextView>

      <TextView color="text.0" textAlign="center">
        {height}
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

  const wallets = useSelector(selectWallets)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const selectedNetwork = useSelector(
    (state: RootState) => state.settings.selectedBlockchainNetworks[account.blockchain]
  )
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )

  const dispatch = useDispatch()
  const { sessions } = useWalletConnectWallet()

  const opacityValue = useRef(new Animated.Value(0))

  const balanceExchange = useBalancesAndExchange(account)

  const { tokens } = useLocalTokens({ blockchain: account.blockchain })

  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<string>()
  const [fee, setFee] = useState<string>()

  const isClaimAvailable = useMemo(() => {
    if (fee && unclaimedGasAmount && account.accountType !== 'watch' && isConnected) {
      return true
    }

    return false
  }, [fee, unclaimedGasAmount, account, isConnected])

  const hasWalletConnectSessions = useMemo(() => {
    if (!WalletConnectHelper.blockchainsByBlockchainServiceKey[account.blockchain]) return false

    return sessions.some(session => {
      const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

      return address === account.address
    })
  }, [sessions])

  const totTokenFeeAccount = useMemo(() => {
    const { balance } = balanceExchange

    if (!balance.data) return 0

    const tokenBalance = balance.data.tokensBalances.find(
      tokenBalance => tokenBalance.token.symbol === blockchainService.feeToken.symbol
    )

    if (!tokenBalance) return 0

    return tokenBalance.amountNumber
  }, [balanceExchange, account])

  const handleClaimGas = () => {
    if (!unclaimedGasAmount || !fee || Number(unclaimedGasAmount) < Number(fee)) {
      setShowWarning(true)
      return
    }

    claimGas()
  }

  const claimGas = async () => {
    try {
      if (!isConnected || !unclaimedGasAmount || !totTokenFeeAccount || !fee || !isClaimable(blockchainService)) return

      Await.init(`claimGas`)
      if (totTokenFeeAccount < Number(fee)) throw new Error()

      const key = await account.getKey()
      if (!key) throw new Error()

      const transactionHash = await blockchainService.claim({ address: account.address, key, type: 'wif' })

      account.addPendingTransaction({
        block: 0,
        hash: transactionHash,
        notifications: [],
        transfers: [
          {
            type: 'token',
            amount: '0',
            token: blockchainService.burnToken,
            from: 'claim',
            to: account.address,
            contractHash: blockchainService.burnToken.hash,
          },
          {
            type: 'token',
            amount: unclaimedGasAmount,
            token: blockchainService.claimToken,
            from: 'claim',
            to: account.address,
            contractHash: blockchainService.claimToken.hash,
          },
        ],
        fee,
      })
      dispatch(accountReducerActions.watchPendingTransaction({ account, transactionHash, isClaim: true }))
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
    if (!isClaimable(blockchainService) || !unclaimedGasAmount) return

    if (!isCalculableFee(blockchainService)) {
      setFee('0')
      return
    }

    const key = await account.getKey()
    if (!key) return

    const calculatedFee = await blockchainService.calculateTransferFee({
      senderAccount: { address: account.address, key, type: 'wif' },
      intent: {
        amount: '0',
        receiverAddress: account.address,
        tokenHash: blockchainService.burnToken.hash,
        tokenDecimals: blockchainService.burnToken.decimals,
      },
    })

    setFee(calculatedFee)
  }, [account, unclaimedGasAmount, tokens])

  const populateUnclaimed = async () => {
    if (!isClaimable(blockchainService)) {
      return
    }

    const unclaimed = await blockchainService.blockchainDataService.getUnclaimed(account.address)
    setUnclaimedGasAmount(unclaimed)
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

  const handleMorePress = () => {
    props.navigation.navigate(wrapper.route.AccountSettingsView.name, {
      account,
      wallet,
    })
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
          refreshing={balanceExchange.isLoading ?? balanceExchange.isRefetchingByUser}
          onRefresh={balanceExchange.refetch}
        />
      }
      title={<Title account={account} />}
      rightButton={<ThemedMoreButton onPress={handleMorePress} />}
    >
      <AccountCard onLayout={handleLayout} hideBalance={false} balanceExchange={balanceExchange} account={account} />

      <Animated.View
        style={{
          opacity: opacityValue.current,
        }}
      >
        <LinearLayout orientation="horiz" width="100%" justifyContent="space-between" marginY="20px">
          <ThemedReceiveButton onPress={handlePressReceiveButton} isDark />

          <AwaitActivity name={`ClaimGas@${account.address}`} loadingView={<ClaimGasLoader />}>
            <ThemedClaimButton
              onPress={handleClaimGas}
              isClaimAvailable={isClaimAvailable}
              unclaimedGasAmount={Number(unclaimedGasAmount ?? 0)}
              fee={fee ? Number(fee) : null}
              isDark
            />
          </AwaitActivity>

          <ThemedSendButton
            onPress={handlePressSendButton}
            isDark
            isInactive={
              !balanceExchange.balance.data ||
              !BalanceHelper.hasSomeBalance(balanceExchange.balance.data) ||
              account.accountType === 'watch' ||
              !isConnected
            }
          />
        </LinearLayout>

        <LinearLayout>
          <Button
            label={i18n.t('screens.getAccount.assets').toUpperCase()}
            srcIcon={require('~/src/assets/images/Equalizer_-_simple-line-icons.png')}
            iconSize={[28, 24]}
            onPress={handlePressAssetsButton}
          />
          <Button
            label={i18n.t('screens.getAccount.transactions').toUpperCase()}
            srcIcon={require('~/src/assets/images/icon-reselect-green.png')}
            iconSize={[28, 30]}
            onPress={handlePressTransactionsButton}
            disabled={selectedNetwork.type === 'custom'}
          />

          <Button
            label={i18n.t('screens.getAccount.nfts').toUpperCase()}
            srcIcon={require('~/src/assets/images/diamond-green.png')}
            iconSize={[28, 30]}
            onPress={handlePressNFTsButton}
            disabled={selectedNetwork.type === 'custom'}
          />

          <Button
            disabled={!hasWalletConnectSessions}
            label={i18n.t('screens.getAccount.connections').toUpperCase()}
            srcIcon={require('~/src/assets/images/connections.png')}
            iconSize={[28, 30]}
            onPress={handlePressConnectionsButton}
          />
        </LinearLayout>

        <ModalWarningFee
          onPress={claimGas}
          totTokenFeeAccount={totTokenFeeAccount}
          unclaimedGasAmount={Number(unclaimedGasAmount ?? 0)}
          amountFee={Number(fee ?? 0)}
          showWarning={showWarning}
          setShowWarning={show => setShowWarning(show)}
        />
      </Animated.View>
    </ScreenLayout>
  )
}

export default GetAccountView
