import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback} from 'react'
import {View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector, useDispatch} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {applicationConfig} from '../config/ApplicationConfig'
import {Wallet} from '../models/redux/Wallet'
import {ModalStackParamList} from '../navigation/ModalStackNavigation'
import {RootStore} from '../store/RootStore'
import {getRandomColor} from './CustomizeAccount'

import {BlockchainServiceKey} from '~src/blockchain'
import BlockchainList from '~src/components/BlockchainList'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {SearchBar} from '~src/components/input/SearchBar'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {LinearLayout, TextView} from '~src/styles/styled-components'
export interface BlockchainListModalParams {
  walletOrAccount: 'wallet' | 'account'
}

interface IBlockchainListModal {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'BlockchainListModal'>
}

const BlockchainListModal = (props: IBlockchainListModal) => {
  const controller = useSwiperController(true)
  const [blockchainSelected, setBlockchainSelected] = useState<
    BlockchainServiceKey
  >()

  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatch = useDispatch()
  const wallet = useSelector((state: RootState) => state.wallet)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(
    dispatchWallet(RootStore.wallet.actions.getFromSelection())
  )

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const createAccount = useCallback(async () => {
    if (!wallet.id) throw new Error('No wallet selected')
    if (!blockchainSelected) {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
        type: 'danger',
      })
      throw new Error(
        i18n.t('blockchainServices.errorMessages.blockchainNotFound')
      )
    }
    const indexAccount = selectedWallet
      .getAccounts(accountsPool)
      .filter((account) => account.blockchain === blockchainSelected).length
    dispatch(RootStore.account.actions.setIdWallet(wallet.id))
    dispatch(
      RootStore.account.actions.setName(
        `${i18n.t(`blockchainServices.${blockchainSelected}.label`)} ${i18n.t(
          'modals.blockchainList.countAccount',
          {
            count: indexAccount + 1,
          }
        )}`
      )
    )
    dispatch(RootStore.account.actions.setBlockchain(blockchainSelected))
    dispatch(
      RootStore.account.actions.setBackgroundColor(
        theme.colors.card[getRandomColor(6)]
      )
    )
    dispatch(
      RootStore.account.actions.setSrcIcon(
        applicationConfig.blockchain[blockchainSelected].icon
      )
    )
    await dispatchAsync(RootStore.account.actions.createAndSave())
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    await dispatchAsync(RootStore.app.actions.syncWallets())

    props.navigation.goBack()
  }, [accountsPool, wallet, blockchainSelected])

  useEffect(() => {
    setSelectedWallet(
      dispatchWallet(RootStore.wallet.actions.getFromSelection())
    )
  }, [wallet])

  useEffect(() => {
    dispatch(RootStore.timer.actions.setTimerOff())
    return () => {
      dispatch(RootStore.timer.actions.setTimerOn())
    }
  }, [])

  return (
    <SwiperPanel
      fullSize={true}
      paddingTop={36}
      paddingBottom={36}
      controller={controller}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      title={i18n.t(
        `modals.blockchainList.${
          props.route.params?.walletOrAccount === 'account'
            ? 'accountPage'
            : 'walletPage'
        }.title`
      )}
      onClose={props.navigation.goBack}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <AwaitActivity
        name="createAccount"
        loadingView={<ScreenLoader />}
        onLoadingEnd={() => {
          props.navigation.goBack()
        }}
      >
        <View style={{height: '100%', justifyContent: 'space-between'}}>
          <View>
            <LinearLayout width="100%">
              <TextView
                textAlign="center"
                fontFamily="medium"
                fontSize={18}
                color="text.0"
              >
                {i18n.t(
                  `modals.blockchainList.${
                    props.route.params?.walletOrAccount === 'account'
                      ? 'accountPage'
                      : 'walletPage'
                  }.subtitle`
                )}
              </TextView>
            </LinearLayout>

            <BlockchainList
              onBlockchainSelected={(blockchainList) => {
                const blockchain = blockchainList.find(
                  (it) => it.isActive === true
                )?.blockchain
                setBlockchainSelected(blockchain)
              }}
            />
          </View>

          <ThemedButton
            label={i18n.t('app.add')}
            onPress={() => {
              Await.run('createAccount', createAccount, 2000)
            }}
          />
        </View>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default BlockchainListModal
