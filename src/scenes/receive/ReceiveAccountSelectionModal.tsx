import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

export interface ReceiveAccountSelectionParams {
  wallet: Wallet
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveAccountSelectionModal'>
}

const ReceiveAccountSelectionModal = (props: Props) => {
  const {wallet} = props.route.params

  const controller = useSwiperController(true)

  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    accounts[0]
  )

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
    setSelectedAccount(accounts[0])
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={Facade.t('modals.receive.title')}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <LinearLayout px={5}>
        <TextView
          mb={4}
          color={'text.3'}
          fontSize={'md'}
          fontFamily={'bold'}
          textAlign={'center'}
        >
          {props.route.params.wallet.name?.toUpperCase()}
        </TextView>

        <TextView
          color={'text.0'}
          fontSize={'lg'}
          fontFamily={'medium'}
          textAlign={'center'}
        >
          {Facade.t('modals.send.accountSelection.subtitle')}
        </TextView>

        <LinearLayout minHeight={260} mx={-5}>
          <AccountPicker accounts={accounts} onSelect={setSelectedAccount} />
        </LinearLayout>

        <TextView mb={4} color={'text.3'} fontSize={'md'} textAlign={'center'}>
          {Facade.t('modals.send.accountSelection.label')}
        </TextView>

        {selectedAccount && (
          <LinearLayout width={'100%'} mb={6}>
            <BalanceList
              tokenAssets={selectedAccount.tokenAssets}
              fromAccountView={false}
            />
          </LinearLayout>
        )}

        <LinearLayout mb={6} minWidth={'80%'} maxWidth={'100%'}>
          <ThemedButton
            label={Facade.t('app.next')}
            onPress={() =>
              props.navigation.navigate(
                Facade.route.ReceiveToAccountModal.name,
                {
                  wallet: props.route.params.wallet,
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

export default ReceiveAccountSelectionModal
