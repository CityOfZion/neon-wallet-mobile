import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {FlatList, TouchableWithoutFeedback, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {LinearLayout, TextView} from '~src/styles/styled-components'

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

  const TableData = (props: {header: string; content: string}) => {
    return (
      <LinearLayout weight={1} orientation="verti" mt={5} mb={4}>
        <TextView
          mb="-6px"
          color="text.2"
          fontSize="lg"
          allowFontScaling={true}
          numberOfLines={1}
          ellipsizeMode="tail"
          mr={4}
        >
          {props.header}
        </TextView>
        <TextView
          color="text.0"
          fontSize="xl"
          fontFamily="medium"
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {props.content}
        </TextView>
      </LinearLayout>
    )
  }

  const ViewBalanceItem = (props: {item: TokenAsset}) => {
    return (
      <LinearLayout orientation="horiz" alignItems="center">
        <LinearLayout
          height={'12px'}
          width={'12px'}
          borderRadius={9999}
          mr={'8px'}
          bg={props.item.color}
        />
        <TableData header={props.item.name} content={props.item.symbol} />
        <TableData
          header={Facade.t('components.balanceList.holdings')}
          content={String(props.item.amount)}
        />
        <TableData
          header={Facade.t('components.balanceList.value')}
          content={Facade.filter.currency(
            props.item.exchange(currency, exchange),
            currency,
            language
          )}
        />
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
          <TouchableWithoutFeedback
            onPress={() =>
              navigation?.navigate(Facade.route.AccountAssetDetail.name, {
                account,
              })
            }
          >
            <View>
              <ViewBalanceItem item={props.item} />
            </View>
          </TouchableWithoutFeedback>
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
