import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Alert, AlertButton } from '~/src/components/Alert'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { LabelButton, useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { Wallet } from '~src/models/redux/Wallet'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { SettingsStackParamList } from '~src/navigation/SettingsStackNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { LinearLayout } from '~src/styles/styled-components'

type ParamList = ModalStackParamList & TabStackParamList & SettingsStackParamList & WalletStackParamList

export interface EditWalletParams {
  wallet: Wallet
}

interface EditWalletModalProps {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'EditWalletModal'>
}

export const EditWalletModal = (props: EditWalletModalProps & EditWalletParams) => {
  const wallet = props.route.params?.wallet

  const [name, setName] = useState(wallet?.name ?? '')
  const [warningModalIsVisible, setWarningModalIsVisible] = useState(false)
  const controller = useSwiperController(true)

  const dispatch = useDispatch()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      setWarningModalIsVisible(true)
      return
    }
    wallet.name = name
    dispatch(walletReducerActions.saveWallet(wallet))

    props.navigation.navigate(wrapper.route.ListWalletsPage.name)
  }

  const save = () => {
    Await.run('saveWallet', submit, 300)
  }

  return (
    <SwiperPanel
      title={i18n.t('modals.editWallet.title')}
      rightButton={<LabelButton label={i18n.t('modals.editWallet.navigation.save')} onPress={save} />}
      leftButton={<LabelButton label={i18n.t('modals.editWallet.navigation.cancel')} onPress={controller.close} />}
      onClose={props.navigation.goBack}
      controller={controller}
    >
      <AwaitActivity name="saveWallet" loadingView={<ScreenLoader transparent />}>
        <LinearLayout>
          <InputLabel title={i18n.t('modals.editWallet.walletName')} marginBottom="8px" />

          <InputWithValidation
            placeholder={i18n.t('modals.editWallet.namePlaceholder')}
            onChangeText={val => setName(val)}
            color="background.4"
            value={name}
            validator={val => (val.length >= 2 && val.length <= 20) || val?.length === 0}
            separatorColor="background.3"
            invalidColor="background.3"
            invalidMessageColor="quinary"
            sideMargins={0}
            hideScan
            hidePaste
          />
        </LinearLayout>
      </AwaitActivity>

      <Alert
        subtitle={i18n.t('modals.editWallet.invalidName')}
        visible={warningModalIsVisible}
        onRequestClose={() => setWarningModalIsVisible(false)}
      >
        <AlertButton label={i18n.t('app.ok')} onPress={() => setWarningModalIsVisible(false)} />
      </Alert>
    </SwiperPanel>
  )
}

export default EditWalletModal
