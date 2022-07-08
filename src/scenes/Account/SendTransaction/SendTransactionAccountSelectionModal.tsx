import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { TokenBalance } from '~/src/hooks/useBalance'
import { useBalances } from '~/src/hooks/useBalances'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import BalanceList from '~src/components/BalanceList'
import SwiperPanel, { BackButton, useSwiperController } from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionAccountSelectionModalParams {
  wallet: Wallet
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionAccountSelectionModal'>
}

const SendTransactionAccountSelectionModal = (props: Props) => {
  const { wallet } = props.route.params

  const currency = useSelector((state: RootState) => state.settings.currency)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const controller = useSwiperController(true)

  const validAccounts = useMemo(() => wallet.getAccounts(accounts), [accounts])

  const [selectedAccount, setSelectedAccount] = useState<Account>(validAccounts[0])

  const { data: balances } = useBalances(validAccounts)
  const { exchange } = useExchange({ filter: { currencies: currency } })

  const selectedAccountBalance = useMemo(
    () => BalanceHelper.getBalanceByAccount(selectedAccount, balances),
    [selectedAccount, balances]
  )

  const selectedAccountTotalTokenBalance = useMemo(
    () => BalanceHelper.calculateTotalBalances(selectedAccountBalance, exchange, currency),
    [selectedAccountBalance, currency, exchange]
  )

  const handleChangeAccount = (account: Account) => {
    setSelectedAccount(account)
  }

  const handlePressNext = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionModal.name,
      params: {
        wallet,
        account: selectedAccount,
      },
    })
  }

  const handleBalancePress = (tokenBalance: TokenBalance) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionModal.name,
      params: {
        wallet,
        account: selectedAccount,
        token: tokenBalance,
      },
    })
  }

  return (
    <>
      <SwiperPanel
        controller={controller}
        smallerSize
        padding={0}
        title={i18n.t('modals.sendTransactionAccountSelectionModal.title')}
        rightButton={<ThemedCloseButton />}
        leftButton={<BackButton text={i18n.t('app.back')} />}
        onLeftPress={controller.close}
        onRightPress={controller.close}
        onClose={props.navigation.goBack}
        solidColorBG
      >
        <LinearLayout mb="100px">
          <TextView mb={4} color="text.2" fontSize="14px" fontFamily="bold" textAlign="center">
            {props.route.params.wallet.name?.toUpperCase()}
          </TextView>

          <TextView color="text.0" fontSize="18px" fontFamily="medium" textAlign="center" mb="28px">
            {i18n.t('modals.sendTransactionAccountSelectionModal.subtitle')}
          </TextView>

          <LinearLayout minHeight="190px">
            <AccountPicker
              balances={balances}
              exchange={exchange}
              accounts={validAccounts}
              onSelect={handleChangeAccount}
              isCompacted={false}
            />
          </LinearLayout>

          {!!selectedAccountTotalTokenBalance && selectedAccountTotalTokenBalance > 0 && (
            <>
              <TextView mb={4} color="text.3" fontSize="md" textAlign="center">
                {i18n.t('modals.sendTransactionAccountSelectionModal.label')}
              </TextView>

              <LinearLayout pl={20} pr={20}>
                <BalanceList
                  hideEmptyMessage
                  balances={selectedAccountBalance}
                  exchange={exchange}
                  onPress={handleBalancePress}
                />
              </LinearLayout>
            </>
          )}
        </LinearLayout>
      </SwiperPanel>
      <LinearLayout position="absolute" bottom="0px" height="125px" width="100%">
        <LinearGradient
          style={{
            height: '100%',
            justifyContent: 'center',
          }}
          colors={['transparent', FilterHelper.toDarkerShade(theme.colors.background[17], 1, 0.85)]}
          start={[1, 0]}
          end={[1, 0.5]}
        >
          <LinearLayout minWidth="80%" alignSelf="center">
            <ThemedButton
              label={i18n.t('app.next')}
              onPress={handlePressNext}
              disabled={!selectedAccountTotalTokenBalance || selectedAccountTotalTokenBalance <= 0 || !isConnected}
            />
          </LinearLayout>
        </LinearGradient>
      </LinearLayout>
    </>
  )
}

export default SendTransactionAccountSelectionModal
