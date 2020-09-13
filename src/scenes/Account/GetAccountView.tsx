import {RouteProp, useFocusEffect} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TabSelector from '~src/components/TabSelector'
import TransactionsList from '~src/components/TransactionsList'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Lang} from '~src/enums/Lang'
import {NeoNode} from '~src/models/NeoNode'
import {Account} from '~src/models/redux/Account'
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
  account: Account
}

interface GetAccountViewProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'GetAccount'>
}

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
        ml={'-45'}
      />
    </ButtonView>
  )
}

const disabledSendImage = require('~/src/assets/images/button-send-small-disabled.png')
const selectedSendImage = require('~/src/assets/images/button-send-small-selected.png')
const defaultSendImage = require('~/src/assets/images/button-send-small.png')

function SendButton(props: {onPress?: () => any}) {
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
        mr={'-45'}
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

  const appWallets = useSelector((state: RootState) => state.app.wallets)
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const nodesPool = useSelector((state: RootState) => state.app.nodes)
  const {language} = useSelector((state: RootState) => state.settings)
  const pendingTransactions = useSelector(
    (state: RootState) => state.app.pendingTransactions
  )

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [currentPage, setCurrentPage] = useState(1)
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)
  const isWatchAccount = Boolean(
    props.route.params.account.accountType === 'watch'
  )

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
    if (!isAssetsTabSelected) {
      setCurrentPage(1)
      Facade.await.run('populateTransaction', () => fetchTransaction(1))
    }
  }, [isAssetsTabSelected])

  const fetchTransaction = async (currentPage: number) => {
    const {pageNumber} = await account.populateTransactions(
      tokensPool,
      currentPage
    )

    setCurrentPage(pageNumber + 1)

    // Save the new cache
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
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

      <LinearLayout orientation={'horiz'} flex={1} flexWrap={'wrap'}>
        <ReceiveButton
          onPress={() =>
            props.navigation.navigate(Facade.route.Modal.name, {
              screen: Facade.route.ReceiveToAccountModal.name,
              params: {
                wallet: props.route.params.account.getWallet(appWallets),
                account: props.route.params.account,
              },
            })
          }
        />

        <ButtonView
          onPress={() => console.log('pressed')}
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
              assetAmount: '0.1 GAS',
            })}
          </TextView>
        </ButtonView>

        <SendButton
          onPress={
            isWatchAccount || !props.route.params.account.getBalanceAmount()
              ? undefined
              : () => {
                  props.navigation.navigate(Facade.route.Modal.name, {
                    screen: Facade.route.SendTransactionInputModal.name,
                    params: {
                      walletTitle:
                        props.route.params.account.getWallet(appWallets)
                          ?.name ?? '',
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
            name={'populateTransaction'}
            size={'large'}
            style={{minHeight: 100}}
          >
            <>
              {account.address && (
                <TransactionsList
                  address={account.address}
                  transactionGroups={account.transactions}
                />
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
