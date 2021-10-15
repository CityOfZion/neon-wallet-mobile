import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useCallback, useState, useEffect} from 'react'
import {View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {BlockchainServiceKey} from '../blockchain'
import BlockchainList from '../components/BlockchainList'
import ScreenLoader from '../components/loader/ScreenLoader'
import ThemedButton from '../components/themed/ThemedButton'
import {applicationConfig} from '../config/ApplicationConfig'
import {MoreStackParamList} from '../navigation/MoreStackNavigation'
import {RootStore} from '../store/RootStore'
import {LinearLayout, TextView} from '../styles/styled-components'
import {getRandomColor} from './CustomizeAccount'

import ScreenLayout from '~src/components/layout/ScreenLayout'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'BlockchainListPage'>
}

const BlockchainListPage = (props: Props) => {
  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()
  const [blockchainsSelected, setBlockchainsSelected] = useState<
    BlockchainServiceKey[]
  >([])
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const createWallet = useCallback(async () => {
    if (blockchainsSelected.length < 1) {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
        type: 'danger',
        duration: 3000,
      })
      throw new Error(
        i18n.t('blockchainServices.errorMessages.blockchainNotFound')
      )
    }
    const id = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )
    await dispatchAsync(RootStore.app.actions.syncWallets())
    for (const blockchain of blockchainsSelected) {
      dispatch(RootStore.account.actions.setIdWallet(id))
      dispatch(
        RootStore.account.actions.setName(
          `${i18n.t(
            `blockchainServices.${blockchain}.label`
          )} ${i18n.t('modals.blockchainList.countAccount', {count: 1})}`
        )
      )
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      dispatch(
        RootStore.account.actions.setSrcIcon(
          applicationConfig.blockchain[blockchain].icon
        )
      )
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      await dispatchAsyncString(RootStore.account.actions.createAndSave())
      await dispatchAsync(RootStore.app.actions.syncAccounts())

      await dispatchAsync(RootStore.app.actions.syncWallets())

      dispatch(RootStore.wallet.actions.selectWallet(id))
    }
  }, [blockchainsSelected])

  return (
    <ScreenLayout>
      <AwaitActivity
        name={'createWallet'}
        size={'large'}
        loadingView={<ScreenLoader />}
        onLoadingEnd={() => {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: wrapper.route.Step5CreateWallet.name,
              },
            ],
          })
        }}
      >
        <LinearLayout mt={'15px'} weight={1}>
          <View style={{alignContent: 'center'}}>
            <TextView
              textAlign="center"
              fontFamily="medium"
              fontSize={18}
              color="text.0"
            >
              {i18n.t('modals.blockchainList.walletPage.subtitle')}
            </TextView>
          </View>

          <BlockchainList
            hideQtyAccounts={true}
            isMulti={true}
            onBlockchainSelected={(blockchainList) => {
              const mapBlockchainList = blockchainList
                .filter((it) => it.isActive === true)
                .map((it) => it.blockchain)
              setBlockchainsSelected(mapBlockchainList)
            }}
          />
        </LinearLayout>

        <LinearLayout mt={5} mb={7} px={5} width={'100%'}>
          <ThemedButton
            disabled={blockchainsSelected.length < 1}
            onPress={() => {
              Await.run('createWallet', createWallet, 1000)
            }}
            label={i18n.t('app.createNow')}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default BlockchainListPage
