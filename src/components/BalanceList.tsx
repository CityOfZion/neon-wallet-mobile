import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {FlatList, TouchableWithoutFeedback, View} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {TokenBalance} from '~src/models/TokenBalance'
import {TokenValue} from '~src/models/TokenValue'
import {Account} from '~src/models/redux/Account'
import {LinearLayout, TextView} from '~src/styles/styled-components'

const TableData = (props: {header: string; content: string}) => {
  return (
    <LinearLayout weight={1} orientation="verti" mt={5} mb={4}>
      <TextView mb="-6px" color="text.2" fontSize="lg">
        {props.header}
      </TextView>
      <TextView color="text.0" fontSize="xl" fontFamily="medium">
        {props.content}
      </TextView>
    </LinearLayout>
  )
}

const ViewBalanceItem = (props: {item: TokenValue}) => {
  const {language} = useSelector((state: RootState) => state.settings)
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
        content={String(props.item.holding)}
      />
      <TableData
        header={Facade.t('components.balanceList.value')}
        content={Facade.filter.currency(
          props.item.value,
          Currency.USD,
          language
        )}
      />
    </LinearLayout>
  )
}

const BalanceListItem = (props: {
  item: TokenValue
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

const BalanceList = (props: {
  tokenAssets?: TokenBalance
  mx?: string
  my?: string
  fromAccountView: boolean
  account?: Account
}) => {
  return (
    <LinearLayout height="100%" my={props.my ?? '0px'} mx={props.mx ?? '0px'}>
      <TextView color="text.2" fontSize="sm">
        {Facade.t('components.balanceList.title')}
      </TextView>
      {props.tokenAssets?.totalValue ? (
        <FlatList
          data={props.tokenAssets.assets}
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
