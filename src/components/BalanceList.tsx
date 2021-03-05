import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {NeoURI} from '~src/helpers/UriHelper'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {Exchange} from '~src/types/exchange'
interface Props extends LinearLayoutProps {
  tokenAssets: TokenAsset[]
  fromAccountView: boolean
  address?: string
  walletId?: string
  walletTitle?: string
  account?: Account
  uri?: NeoURI
  zeroBalance?: boolean
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
          width={Facade.scale(24)}
          height={Facade.scale(24)}
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
          mb={'6px'}
        >
          {props.item.symbol}
        </TextView>
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
            {Facade.t('components.balanceList.holdings')}
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
            {Facade.t('components.balanceList.value')}
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
            {Facade.filter.currency(
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
            navigation?.navigate(Facade.route.AccountAssetDetail.name, {
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
            navigation.navigate(Facade.route.SendTransactionInputModal.name, {
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
  const [itemSeparatorControl, setItemSeparatorControl] = useState(true)
  const innerProps = {...props}
  delete innerProps.tokenAssets
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

  return (
    <LinearLayout {...innerProps} width={'100%'}>
      {showListTokenAssets(props.tokenAssets) ? (
        <>
          <TextView color="text.2" fontSize="sm">
            {Facade.t('components.balanceList.title')}
          </TextView>
          <FlatList<TokenAsset>
            data={
              props.zeroBalance
                ? props.tokenAssets.filter(zeroBalanceFilter)
                : props.tokenAssets
            }
            keyExtractor={(item) => item.symbol}
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
                exchange={exchange}
                language={language}
                walletTitle={props.walletTitle}
                account={props.account}
                uri={props.uri}
                tokenAssets={props.tokenAssets}
              />
            )}
          />
        </>
      ) : (
        <TextView my="32px" color="text.0" fontSize="18px" textAlign="center">
          {Facade.t('components.balanceList.empty')}
        </TextView>
      )}
    </LinearLayout>
  )
}

export default BalanceList
