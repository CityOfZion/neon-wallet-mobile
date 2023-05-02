import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { TFilterSelectionType, TOnFinishSelectionParams, TStyleSelectionType } from '../Wallet/WalletSelectionModal'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { AccountCards } from '~/src/components/AccountCards'
import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { TokenBalance } from '~/src/types/query'
import BalanceList from '~src/components/BalanceList'
import SwiperPanel, {
  BackButton,
  CloseButton,
  useSwiperController,
  DEFAULT_PADDING,
  DEFAULT_PADDING_BOTTOM,
  PANEL_BOUNCE_OFFSET,
} from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface AccountSelectionModalParams {
  wallet: Wallet
  textSchema: string
  onFinish(params: TOnFinishSelectionParams): void
  filter?: TFilterSelectionType
  disconnectDisable?: boolean
  noBalanceDisable?: boolean
  style?: TStyleSelectionType
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'AccountSelectionModal'>
}

const AccountSelectionModal = (props: Props) => {
  const {
    wallet,
    textSchema,
    onFinish,
    disconnectDisable = true,
    filter,
    noBalanceDisable = true,
    style = 'normal',
  } = props.route.params

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const controller = useSwiperController(true)
  const { getBlockchainService } = useBlockchainServiceUtils()

  const validAccounts = useMemo(
    () =>
      wallet.getAccounts(accounts).filter(account => {
        if (filter === 'walletConnect') {
          const service = getBlockchainService(account.blockchain)
          return service.hasWalletConnectIntegration()
        }

        return true
      }),
    [accounts, getBlockchainService]
  )

  const [selectedAccount, setSelectedAccount] = useState<Account>(validAccounts[0])

  const balancesExchange = useBalancesAndExchange(validAccounts)

  const selectedAccountBalanceExchange = useMemo(() => {
    if (!selectedAccount.address) return

    return balancesExchange.findByBalanceKey(selectedAccount.address)
  }, [selectedAccount, balancesExchange])

  const handleChangeAccount = (account: Account) => {
    setSelectedAccount(account)
  }

  const disableButton = useMemo(() => {
    return (
      (disconnectDisable && !isConnected) ||
      (noBalanceDisable && !BalanceHelper.hasSomeBalance(selectedAccountBalanceExchange?.balance.data))
    )
  }, [disconnectDisable, isConnected, noBalanceDisable, selectedAccountBalanceExchange])

  const handleNext = (token?: TokenBalance) => {
    if (!disableButton) {
      onFinish({ wallet, account: selectedAccount, token })
    }
  }

  return (
    <>
      <SwiperPanel
        controller={controller}
        title={i18n.t(`${textSchema}.account.title`)}
        rightButton={<CloseButton onPress={controller.close} />}
        leftButton={<BackButton onPress={controller.close} />}
        onClose={props.navigation.goBack}
        withoutScrollView
        contentStyle={{
          paddingBottom: style === 'normal' ? 0 : undefined,
          paddingHorizontal: style === 'normal' ? 0 : undefined,
        }}
      >
        {style === 'normal' ? (
          <LinearLayout flexGrow={1} flexShrink={1} justifyContent="space-between" position="relative">
            <LinearLayout
              flexGrow={1}
              flexShrink={1}
              paddingBottom={`${DEFAULT_PADDING_BOTTOM + DEFAULT_PADDING + PANEL_BOUNCE_OFFSET + 10}px`}
            >
              <TextView mb={4} color="text.2" fontSize="14px" fontFamily="bold" textAlign="center">
                {props.route.params.wallet.name?.toUpperCase()}
              </TextView>

              <TextView color="text.0" fontSize="18px" fontFamily="medium" textAlign="center" mb="28px">
                {i18n.t(`${textSchema}.account.subtitle`)}
              </TextView>

              <AccountPicker
                balancesExchange={balancesExchange}
                accounts={validAccounts}
                onSelect={handleChangeAccount}
              />

              {!disableButton && !!selectedAccountBalanceExchange ? (
                <>
                  <TextView my={4} color="text.3" fontSize="md" textAlign="center">
                    {i18n.t(`${textSchema}.account.label`)}
                  </TextView>

                  <BalanceList
                    flexGrow={1}
                    flexShrink={1}
                    contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: DEFAULT_PADDING }}
                    onPress={handleNext}
                    hideEmptyMessage
                    hideTitle
                    balanceExchange={selectedAccountBalanceExchange}
                  />
                </>
              ) : (
                <LinearLayout px="5%" pt="15%">
                  <FlatListEmpty alignY="center" label={i18n.t('modals.sendTransactionModal.insufficientFunds')} />
                </LinearLayout>
              )}
            </LinearLayout>

            <LinearGradient
              style={{
                width: '100%',
                justifyContent: 'center',
                position: 'absolute',
                bottom: -PANEL_BOUNCE_OFFSET,
                padding: DEFAULT_PADDING,
                paddingBottom: DEFAULT_PADDING_BOTTOM + PANEL_BOUNCE_OFFSET,
              }}
              colors={['transparent', FilterHelper.toDarkerShade(theme.colors.background[17], 1, 0.75)]}
              start={[1, 0]}
              end={[1, 0.5]}
            >
              <ThemedButton label={i18n.t('app.next')} disabled={disableButton} onPress={() => handleNext()} />
            </LinearGradient>
          </LinearLayout>
        ) : (
          <LinearLayout>
            <TextView color="text.0" fontSize="18px" textAlign="center" mb="30px">
              {i18n.t(`${textSchema}.account.subtitle`)}
            </TextView>

            <AccountCards
              balanceExchange={balancesExchange}
              accounts={validAccounts}
              onPress={account => onFinish({ wallet, account })}
            />
          </LinearLayout>
        )}
      </SwiperPanel>
    </>
  )
}

export default AccountSelectionModal
