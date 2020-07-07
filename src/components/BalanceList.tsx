import React from 'react'
import {FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TokenValue} from '~src/models/TokenValue'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'

const TableData = (props: {header: string; content: string}) => {
  return (
    <LinearLayout width={100} orientation="verti" mt={5} mb={4}>
      <TextView mb="-8px" color="text.2" fontSize="sm">
        {props.header}
      </TextView>
      <TextView color="text.0" fontSize="lg" fontFamily="medium">
        {props.content}
      </TextView>
    </LinearLayout>
  )
}

const BalanceListItem = (props: {item: TokenValue}) => {
  const currency = useSelector((state: RootState) => state.app.currency)

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
        content={`${currency}${props.item.value}`}
      />
    </LinearLayout>
  )
}

const BalanceList = (props: {
  tokenAssets: TokenValue[]
  mx?: string
  my?: string
}) => {
  return (
    <LinearLayout height="100%" my={props.my ?? '0px'} mx={props.mx ?? '0px'}>
      <TextView color="text.2" fontSize="sm">
        {Facade.t('components.balanceList.title')}
      </TextView>
      <FlatList
        data={props.tokenAssets}
        keyExtractor={(item) => item.symbol}
        ItemSeparatorComponent={() => <LinearLayout bg="text.2" height={1} />}
        renderItem={({item}) => <BalanceListItem item={item} />}
      />
    </LinearLayout>
  )
}

export default BalanceList
