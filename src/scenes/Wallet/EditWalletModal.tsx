import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'

import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
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
  const controller = useSwiperController(true)

  const dispatch = useDispatch()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(i18n.t('modals.editWallet.invalidName'))
      return
    }
    wallet.name = name
    dispatch(walletReducerActions.saveWallet(wallet))

    props.navigation.navigate(wrapper.route.ListWalletsPage.name)
  }

  const save = () => {
    Await.run('swiperRight', submit, 300)
  }

  const handleOnClose = () => {
    props.navigation.goBack()
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize
      title={i18n.t('modals.editWallet.title')}
      rightButton={i18n.t('modals.editWallet.navigation.save')}
      leftButton={i18n.t('modals.editWallet.navigation.cancel')}
      imageSize={[22, 22]}
      onClose={handleOnClose}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
      solidColorBG
    >
      <AwaitActivity name="swiperRight" loadingView={<ScreenLoader solidColorBG />}>
        <LinearLayout height="100%" orientation="verti" justifyContent="space-between">
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
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default EditWalletModal
