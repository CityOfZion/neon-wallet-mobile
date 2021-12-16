import {useNavigation} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {IURI} from '~src/helpers/UriHelper'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {Exchange} from '~src/types/exchange'

interface Props extends LinearLayoutProps {
  tokenAssets: TokenAsset[]
  fromAccountView: boolean
  address?: string
  walletId?: string
  walletTitle?: string
  account?: Account
  uri?: IURI
  zeroBalance?: boolean
  hideEmptyMessage?: boolean
  notOrderByValue?: boolean
}

interface ItemProps {
  item: TokenAsset
  exchange: Exchange
  currency: Currency
  language: Lang
}

interface ListProps {
  fromAccountView: boolean
  fromListWalletView: boolean
  address?: string
  walletId?: string
  fromSendAccountSelectionModal: boolean
}

const ViewBalanceItem = (props: ItemProps & ListProps) => {
  const showBlockchain = props.fromListWalletView
  return (
    <LinearLayout
      orientation="horiz"
      alignItems="center"
      alignContent={'center'}
    >
      {props.fromListWalletView ? (
        <LinearLayout
          mr={'8px'}
          width={12}
          height={12}
          borderRadius={12 / 2}
          backgroundColor={props.item.color}
          alginSelf={'center'}
        />
      ) : (
        <ImageView
          mr={'8px'}
          width={Normalize.scale(24)}
          height={Normalize.scale(24)}
          resizeMode={'contain'}
          alginSelf={'center'}
          source={props.item.srcIcon}
        />
      )}

      <LinearLayout weight={1} orientation="verti" mt={5} mb={4}>
        <TextView
          color="text.0"
          fontSize="xl"
          fontFamily="medium"
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          mb={showBlockchain ? '-5px' : '6px'}
        >
          {props.item.symbol}
        </TextView>
        {showBlockchain && (
          <TextView
            color="text.2"
            fontSize="sm"
            fontFamily="medium"
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            mb={'6px'}
          >
            {i18n.t(`blockchainServices.${props.item.blockchain}.id`)}
          </TextView>
        )}
      </LinearLayout>

      <LinearLayout weight={1} ml={4}>
        <LinearLayout weight={1} orientation="verti" justifyContent={'center'}>
          <TextView
            mb="-6px"
            color="text.2"
            fontSize="sm"
            allowFontScaling={true}
            numberOfLines={1}
            ellipsizeMode="tail"
            mr={4}
          >
            {i18n.t('components.balanceList.holdings')}
          </TextView>
          <TextView
            mt={1}
            color="text.2"
            fontSize="sm"
            fontFamily="medium"
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {i18n.t('components.balanceList.value')}
          </TextView>
        </LinearLayout>
      </LinearLayout>
      <LinearLayout weight={1} />
      <LinearLayout weight={1} ml={4}>
        <LinearLayout
          weight={1}
          orientation="verti"
          mt={5}
          mb={4}
          alignItems={'flex-end'}
        >
          <TextView
            mb="-6px"
            color="text.0"
            fontSize="md"
            allowFontScaling={true}
            numberOfLines={1}
            ellipsizeMode="tail"
            textAlign={'right'}
          >
            {String(props.item.amount)}
          </TextView>
          <TextView
            mt={1}
            color="primary"
            fontSize="md"
            fontFamily="medium"
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {FilterHelper.currency(
              props.item.exchangeToken(props.currency, props.exchange),
              props.currency,
              props.language
            )}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const BalanceListItem = (props: ListProps & ItemProps & Props) => {
  const navigation = useNavigation()

  return (
    <LinearLayout>
      {props.fromAccountView || props.fromListWalletView ? (
        <TouchableOpacity
          onPress={() =>
            navigation?.navigate(wrapper.route.AccountAssetDetail.name, {
              token: props.item,
              address: props.address,
              walletId: props.walletId,
            })
          }
        >
          <View>
            <ViewBalanceItem {...props} />
          </View>
        </TouchableOpacity>
      ) : props.fromSendAccountSelectionModal ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(wrapper.route.SendTransactionInputModal.name, {
              walletTitle: props.walletTitle,
              account: props.account,
              uri: props.uri,
              selectedToken: props.item,
            })
          }
        >
          <View>
            <ViewBalanceItem {...props} />
          </View>
        </TouchableOpacity>
      ) : (
        <ViewBalanceItem {...props} />
      )}
    </LinearLayout>
  )
}

const BalanceList = (props: Props) => {
  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const orderByValue = (token1: TokenAsset, token2: TokenAsset) => {
    const value1 =
      token1.exchangeToken(currency, exchange[token1.blockchain]) ?? 0
    const value2 =
      token2.exchangeToken(currency, exchange[token2.blockchain]) ?? 0
    if (value1 < value2) return 1
    if (value1 > value2) return -1
    return 0
  }
  const innerProps = {...props} //@ts-ignore
  delete innerProps.tokenAssets //@ts-ignore
  delete innerProps.fromAccountView
  delete innerProps.account

  const zeroBalanceFilter = (token: TokenAsset) => {
    if (
      token.symbol === 'NEO' ||
      token.symbol === 'GAS' ||
      token.amount !== 0
    ) {
      return token
    }
  }

  const showListTokenAssets = (tokenAssets: TokenAsset[]) => {
    let show = false
    tokenAssets.forEach((token) => {
      if (token.amount > 0) {
        show = true
      }
    })
    return show
  }
  const getTokenAssets = () => {
    let tokens = props.tokenAssets
    if (!props.notOrderByValue) {
      tokens = tokens.sort(orderByValue)
    }
    if (props.zeroBalance) {
      tokens = tokens.filter(zeroBalanceFilter)
    }
    return tokens
  }
  return (
    <LinearLayout {...innerProps} width={'100%'}>
      {showListTokenAssets(props.tokenAssets) ? (
        <>
          <TextView color="text.2" fontSize="sm">
            {i18n.t('components.balanceList.title')}
          </TextView>
          <FlatList<TokenAsset>
            data={getTokenAssets()}
            keyExtractor={(item) => item.hash}
            ItemSeparatorComponent={() => (
              <LinearLayout bg="text.2" height={1} />
            )}
            renderItem={({item}) => (
              <BalanceListItem
                item={item}
                fromAccountView={props.fromAccountView}
                fromListWalletView={props.fromListWalletView}
                fromSendAccountSelectionModal={
                  props.fromSendAccountSelectionModal
                }
                address={props.address}
                walletId={props.walletId}
                currency={currency}
                exchange={exchange[item.blockchain]}
                language={language}
                walletTitle={props.walletTitle}
                account={props.account}
                uri={props.uri}
                tokenAssets={props.tokenAssets}
              />
            )}
          />
        </>
      ) : props.hideEmptyMessage ? (
        <View />
      ) : (
        <TextView my="32px" color="text.0" fontSize="18px" textAlign="center">
          {i18n.t('components.balanceList.empty')}
        </TextView>
      )}
    </LinearLayout>
  )
}

export default BalanceList
