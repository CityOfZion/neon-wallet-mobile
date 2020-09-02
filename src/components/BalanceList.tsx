import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props extends LinearLayoutProps {
  tokenAssets: TokenAsset[]
  fromAccountView: boolean
  account?: Account
}

const BalanceList = (props: Props) => {
  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const innerProps = {...props}
  delete innerProps.tokenAssets
  delete innerProps.fromAccountView
  delete innerProps.account

  const ViewBalanceItem = (props: {item: TokenAsset}) => {
    return (
      <LinearLayout
        orientation="horiz"
        alignItems="center"
        alignContent={'center'}
      >
        <ImageView
          mr={'8px'}
          width={Facade.scale(24)}
          height={Facade.scale(24)}
          resizeMode={'contain'}
          source={props.item.srcIcon}
          alginSelf={'center'}
        />

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
          <LinearLayout
            weight={1}
            orientation="verti"
            justifyContent={'center'}
          >
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
                props.item.exchange(currency, exchange),
                currency,
                language
              )}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    )
  }

  const BalanceListItem = (props: {
    item: TokenAsset
    fromAccountView: boolean
    account?: Account
  }) => {
    const account = props.account ?? new Account()
    const navigation = useNavigation()

    return (
      <LinearLayout>
        {props.fromAccountView ? (
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate(Facade.route.AccountAssetDetail.name, {
                token: props.item,
                address: account.address,
              })
            }
          >
            <View>
              <ViewBalanceItem item={props.item} />
            </View>
          </TouchableOpacity>
        ) : (
          <ViewBalanceItem item={props.item} />
        )}
      </LinearLayout>
    )
  }

  return (
    <LinearLayout {...innerProps} width={'100%'}>
      <TextView color="text.2" fontSize="sm">
        {Facade.t('components.balanceList.title')}
      </TextView>

      {props.tokenAssets.length ? (
        <FlatList<TokenAsset>
          data={props.tokenAssets}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={() => <LinearLayout bg="text.2" height={1} />}
          renderItem={({item}) => (
            <BalanceListItem
              item={item}
              fromAccountView={props.fromAccountView}
              account={props.account}
            />
          )}
        />
      ) : (
        <TextView
          my="32px"
          color="text.0"
          fontFamily="medium"
          fontSize="18px"
          textAlign="center"
        >
          {Facade.t('components.balanceList.empty')}
        </TextView>
      )}
    </LinearLayout>
  )
}

export default BalanceList
