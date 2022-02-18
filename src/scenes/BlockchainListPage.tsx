import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useCallback, useState, useEffect} from 'react'
import {View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {getRandomColor} from './CustomizeAccount'

import {wrapper} from '~src/app/ApplicationWrapper'
import {BlockchainServiceKey, blockchainServices} from '~src/blockchain'
import BlockchainList from '~src/components/BlockchainList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

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
    let id: string | undefined

    try {
      id = await dispatchAsyncString(RootStore.wallet.actions.createAndSave())

      await dispatchAsync(RootStore.app.actions.syncWallets())

      await Promise.all(
        blockchainsSelected.map(async (blockchain) => {
          if (!id) {
            throw new Error()
          }

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
              blockchainServices[blockchain].icon
            )
          )
          dispatch(
            RootStore.account.actions.setBackgroundColor(
              theme.colors.card[getRandomColor(6)]
            )
          )

          await dispatchAsyncString(RootStore.account.actions.createAndSave())

          dispatch(RootStore.wallet.actions.selectWallet(id))
        })
      )

      await dispatchAsync(RootStore.app.actions.syncAccounts())

      await dispatchAsync(RootStore.app.actions.syncWallets())

      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: wrapper.route.Step5CreateWallet.name,
          },
        ],
      })
    } catch (error) {
      if (id) {
        await dispatchAsync(RootStore.wallet.actions.delete(id))
        await dispatchAsync(RootStore.app.actions.syncWallets())
      }

      showMessage({
        message: i18n.t('modals.blockchainList.errorCreateWallet'),
        type: 'danger',
        duration: 5000,
      })
    }
  }, [blockchainsSelected])

  useEffect(() => {
    dispatch(RootStore.timer.actions.setTimerOff())
    return () => {
      dispatch(RootStore.timer.actions.setTimerOn())
    }
  }, [])

  return (
    <ScreenLayout>
      <AwaitActivity
        name={'createWallet'}
        size={'large'}
        loadingView={<ScreenLoader />}
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
