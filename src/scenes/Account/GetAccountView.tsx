import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useEffect} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ClaimGasLoader from '~src/components/loader/ClaimGasLoader'
import {Lang} from '~src/enums/Lang'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {NeoNode} from '~src/models/NeoNode'
import {Account} from '~src/models/redux/Account'
import {AddressRequest} from '~src/models/request/AddressRequest'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface GetAccountParams {
  walletTitle: string
  account: Account
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

const disabledSendImage = require('~/src/assets/images/button-send-small-disabled.png')
const selectedSendImage = require('~/src/assets/images/button-send-small-selected.png')
const defaultSendImage = require('~/src/assets/images/button-send-small.png')

const ReceiveButton = (props: {onPress: () => any}) => {
  const selectedReceiveImage = require('~/src/assets/images/button-receive-small-selected.png')
  const defaultReceiveImage = require('~/src/assets/images/button-receive-small.png')

  const [isPressed, setPressed] = useState(false)
  const backgroundImage = isPressed ? selectedReceiveImage : defaultReceiveImage
  return (
    <ButtonView
      onPress={props.onPress}
      activeOpacity={1}
      onHideUnderlay={() => {
        setPressed(false)
      }}
      onShowUnderlay={() => {
        setPressed(true)
      }}
    >
      <ImageView
        source={backgroundImage}
        overflow={'visible'}
        //The image has margins
        ml={'-45px'}
      />
    </ButtonView>
  )
}

const SendButton = (props: {onPress?: () => any}) => {
  const [isPressed, setPressed] = useState(false)
  let backgroundImage = isPressed ? selectedSendImage : defaultSendImage
  backgroundImage = props.onPress ? backgroundImage : disabledSendImage
  return (
    <ButtonView
      onPress={props.onPress}
      disabled={!props.onPress}
      activeOpacity={1}
      onHideUnderlay={() => {
        setPressed(false)
      }}
      onShowUnderlay={() => {
        setPressed(true)
      }}
    >
      <ImageView
        source={backgroundImage}
        overflow={'visible'}
        //The image has margins
        mr={'-45px'}
      />
    </ButtonView>
  )
}

const TitleComponent = (props: {nodesPool: NeoNode[]; language: Lang}) => {
  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
        {Facade.t('app.neoBlockHeight')}
      </TextView>

      <TextView color={'text.0'} textAlign={'center'}>
        {Facade.filter.decimal(
          NeoNode.getHighestNodeHeightFromPool(props.nodesPool),
          props.language
        )}
      </TextView>
    </LinearLayout>
  )
}

const GetAccountView = (props: GetAccountViewProps) => {
  const {account} = props.route.params

  const walletsPool = useSelector((state: RootState) => state.app.wallets)
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const {language} = useSelector((state: RootState) => state.settings)

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [currentPage, setCurrentPage] = useState(1)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  const [unclaimedGasAmount, setUnclaimedGasAmount] = useState<number>()

  const isWatchAccount = props.route.params.account.accountType === 'watch'
  const wallet = props.route.params.account.getWallet(walletsPool)

  props.navigation.setOptions({
    headerTitle: () => TitleComponent({nodesPool, language}),
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.EditAccountModal.name,
            params: {
              account,
            },
          })
        },
      }),
  })

  useEffect(() => {
    Facade.await.run('populateUnclaimed', () => populateUnclaimed())
  }, [])

  useEffect(() => {
    if (!isAssetsTabSelected) {
      setCurrentPage(1)
      Facade.await.run('fetchTransaction', () => fetchTransaction(1))
    }
  }, [isAssetsTabSelected, account.pendingTransactions])

  useEffect(() => {
    const senderTxs = account.pendingTransactions.flatMap(
      (it) => it.transactions
    )

    const exist = senderTxs.some((it) => it.receiverAddress === account.address)
    if (exist) {
      Facade.await.init(`ClaimGas@${account.address}`)
    } else {
      Facade.await.done(`ClaimGas@${account.address}`)
    }
  }, [account.pendingTransactions])

  const populateUnclaimed = async () => {
    if (!account.address) return

    const request = new AddressRequest(account.address)
    const response = await request.getUnclaimed()

    setUnclaimedGasAmount(response.unclaimed ?? undefined)
  }

  const fetchTransaction = async (currentPage: number) => {
    const {pageNumber} = await account.populateTransactions(
      tokensPool,
      currentPage
    )

    setCurrentPage(pageNumber + 1)

    // Save the new cache
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
  }

  const claimGas = async () => {
    if (Facade.await.inAction(`ClaimGas@${account.address}`)) return
    if (!account.address || !unclaimedGasAmount) return

    Facade.await.init(`ClaimGas@${account.address}`)

    try {
      const txid = await NeonHelper.claimGas(account.address)

      if (txid) {
        await account.addPendingUnclaimedGasTransaction(
          unclaimedGasAmount,
          txid
        )
        await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
      }
    } catch (e) {
      Facade.await.done(`ClaimGas@${account.address}`)
      showMessage({
        message: e.message,
      })
    }
  }

  return (
    <ScreenLayout
      onReachBottom={() => {
        if (Facade.await.inAction('loadMoreTransaction')) return
        Facade.await.run(
          'loadMoreTransaction',
          () => fetchTransaction(currentPage),
          500
        )
      }}
    >
      <LinearLayout mt={4}>
        <AccountCard account={account} isStackMode={false} />
      </LinearLayout>

      <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
        <ReceiveButton
          onPress={() =>
            props.navigation.navigate(Facade.route.Modal.name, {
              screen: Facade.route.ReceiveToAccountModal.name,
              params: {
                wallet,
                account: props.route.params.account,
              },
            })
          }
        />

        <AwaitActivity name={'populateUnclaimed'}>
          <AwaitActivity
            name={`ClaimGas@${account.address}`}
            loadingView={<ClaimGasLoader />}
          >
            <>
              {Boolean(unclaimedGasAmount && !isWatchAccount) && (
                <ButtonView
                  onPress={claimGas}
                  weight={2}
                  justifyContent={'center'}
                  overflow={'visible'}
                >
                  <ImageView
                    source={require('~src/assets/images/button-claim-background.png')}
                    alignSelf={'center'}
                    position={'absolute'}
                    maxWidth={'100%'}
                  />

                  <TextView
                    color={'primary'}
                    alignSelf={'center'}
                    fontSize={'16px'}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                  >
                    {Facade.t('screens.getAccount.claimAsset', {
                      amount: Facade.filter.decimal(
                        unclaimedGasAmount,
                        language,
                        7
                      ),
                    })}
                  </TextView>
                </ButtonView>
              )}
            </>
          </AwaitActivity>
        </AwaitActivity>

        <SendButton
          onPress={
            isWatchAccount || !props.route.params.account.getBalanceAmount()
              ? undefined
              : () => {
                  props.navigation.navigate(Facade.route.Modal.name, {
                    screen: Facade.route.SendTransactionInputModal.name,
                    params: {
                      walletTitle: wallet?.name ?? '',
                      account: props.route.params.account,
                    },
                  })
                }
          }
        />
      </LinearLayout>

      <TabSelector
        isFirstTabSelected={isAssetsTabSelected}
        setFirstTabAsSelected={setIsAssetsTabSelected}
        firstTabLabel={Facade.t('screens.getAccount.assets')}
        secondTabLabel={Facade.t('screens.getAccount.transactions')}
        mb={5}
      />

      <LinearLayout>
        {isAssetsTabSelected ? (
          <BalanceList
            my="16px"
            tokenAssets={account.tokenAssets}
            account={account}
            fromAccountView={true}
          />
        ) : (
          <AwaitActivity
            name={'fetchTransaction'}
            size={'large'}
            style={{minHeight: 100}}
          >
            <>
              {account.address && (
                <LinearLayout>
                  <TransactionsList
                    title={Facade.t('screens.getAccount.pendingTransactions')}
                    address={account.address}
                    transactionGroups={account.pendingTransactions}
                  />

                  <TransactionsList
                    title={Facade.t('screens.getAccount.completedTransactions')}
                    address={account.address}
                    transactionGroups={account.transactions}
                  />
                </LinearLayout>
              )}

              <AwaitActivity
                name={'loadMoreTransaction'}
                size={'large'}
                style={{minHeight: 100}}
              />
            </>
          </AwaitActivity>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetAccountView
