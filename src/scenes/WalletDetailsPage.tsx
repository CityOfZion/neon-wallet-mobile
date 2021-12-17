import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {useDispatch} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {RootStore} from '~src/store/RootStore'

export interface WalletDetailsParamList {
  wallet: Wallet
}

interface WalletDetailsProps {
  route: RouteProp<SettingsStackParamList, 'MyWalletOptions'>
  navigation: StackNavigationProp<SettingsStackParamList & ModalStackParamList>
}

const WalletDetailsPage = (props: WalletDetailsProps) => {
  const fromWalletDetailsPage = true
  const {wallet} = props.route.params

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  dispatchAsync(RootStore.app.actions.syncWallets())

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.EditWalletModal.name,
            params: {
              wallet,
              fromWalletDetailsPage,
            },
          })
        },
      }),
  })

  return (
    <ScreenLayout padding={20}>
      <InputLabel title={'Wallet Name'} capitalize={true} marginBottom="10px" />
      <InputWithValidation
        color="text.0"
        sideMargins={0}
        value={wallet.name ?? ''}
        validator={() => true}
        separatorColor="background.13"
        hidePaste={true}
        hideScan={true}
        showContacts={false}
        editable={false}
      />
    </ScreenLayout>
  )
}

export default WalletDetailsPage
