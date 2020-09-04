import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
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
import {NeoURI} from '~src/helpers/UriHelper'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'
import AccountCardsComponent from '~src/components/AccountCardsComponent'

export interface SendAccountSelectionModalParams {
  wallet: Wallet
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'SendAccountSelectionModal'>
}

const SendAccountSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account>()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const {wallet} = props.route.params

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
    setSelectedAccount(Facade.lodash.cloneDeep(accounts[accounts.length - 1]))
  }

  const selectEvent = async () => {
    const size = accounts.length - 1
    const lastItem = accounts[size]
    setSelectedAccount(Facade.lodash.cloneDeep(accounts[0]))

    accounts.pop()
    accounts.unshift(lastItem)

    setAccounts(accounts)
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={8}
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

        <LinearLayout mt={4}>
          <AccountCardsComponent accounts={accounts} onPress={selectEvent} />
        </LinearLayout>

        <LinearLayout width={'100%'}>
          <BalanceList
            my="44px"
            tokenAssets={wallet.tokenAssets}
            fromAccountView={false}
          />
        </LinearLayout>

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
                  uri: props.route.params?.uri,
                }
              )
            }
            disabled={!wallet.hasFunds}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendAccountSelectionModal
