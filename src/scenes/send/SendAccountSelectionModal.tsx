import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {cloneDeep} from 'lodash'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {Balance} from '~src/models/Balance'
import {TokenBalance} from '~src/models/TokenBalance'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'SendAccountSelectionModal'>
}

const SendAccountSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account>()
  const [balanceList, setBalanceList] = useState<Balance[]>([])
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const [tokenBalance, setTokenBalance] = useState<Balance>()

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const filteredAccounts = props.route.params.wallet.getAccounts(accountsPool)
    setAccounts(filteredAccounts)
    setSelectedAccount(cloneDeep(filteredAccounts[filteredAccounts.length - 1]))
  }

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i !== 0 ? Facade.scale(-240) : undefined
      const marginX = i !== 0 ? Facade.scale(-1) : undefined

      return (
        <LinearLayout key={i} marginTop={marginTop} mx={marginX}>
          <AccountCard
            account={account}
            isCompacted={true}
            isStackMode={i !== accounts.length - 1}
            onPress={() => selectEvent()}
          />
        </LinearLayout>
      )
    })
  }

  const selectEvent = async () => {
    const size = accounts.length - 1
    const lastItem = accounts[size]
    setSelectedAccount(cloneDeep(accounts[0]))

    accounts.pop()
    accounts.unshift(lastItem)

    setAccounts(accounts)
    // TODO: NW-228 Integrate Account Card with its Balance, getting it from the WS
    setTokenBalance(new Balance())
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={Facade.t('modals.send.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <LinearLayout
        height="100%"
        width="100%"
        px="15px"
        orientation="verti"
        alignItems="center"
      >
        <TextView color="text.3" fontSize="md" fontFamily="bold" mb="20px">
          {props.route.params.wallet.name?.toUpperCase()}
        </TextView>

        <TextView color="text.0" fontSize="18px" fontFamily="medium" mb="22px">
          {Facade.t('modals.send.accountSelection.subtitle')}
        </TextView>

        <LinearLayout mt={4}>{_renderAccountCards()}</LinearLayout>

        <BalanceList my="44px" tokenAssets={new TokenBalance()} />

        <LinearLayout
          position="absolute"
          bottom={0}
          px="24px"
          alignSelf="center"
          width="100%"
        >
          <ThemedButton
            label={Facade.t('app.next')}
            onPress={() =>
              props.navigation.navigate(
                Facade.route.SendTransactionInputModal.name,
                {
                  walletTitle: props.route.params.wallet.name ?? '',
                  account: selectedAccount ?? new Account(),
                }
              )
            }
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendAccountSelectionModal
