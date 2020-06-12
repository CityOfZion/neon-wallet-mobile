import React, {useState} from 'react'
import {FlatList} from 'react-native'

import {DEFAULT_CURRENCY} from '~/constants'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

//TODO Remove all hardcoded texts
const BalanceList: React.FC<object> = () => {
  //region Test
  const tokenValue1 = new TokenValue()
  tokenValue1.name = 'NEO'
  tokenValue1.symbol = 'NEO'
  tokenValue1.holding = '1235,00'
  tokenValue1.value = '6665,00'

  const tokenValue2 = new TokenValue()
  tokenValue2.name = 'GAS'
  tokenValue2.symbol = 'GAS'
  tokenValue2.holding = '12405,00'
  tokenValue2.value = '665,00'

  const tokenValue3 = new TokenValue()
  tokenValue3.name = 'MYCOIN'
  tokenValue3.symbol = 'MC'
  tokenValue3.holding = '45,00'
  tokenValue3.value = '65,00'

  const tokenValue4 = new TokenValue()
  tokenValue4.name = 'THECOIN'
  tokenValue4.symbol = 'TC'
  tokenValue4.holding = '458,00'
  tokenValue4.value = '6565,00'

  const list = []

  const imageList = [
    require('~src/assets/images/ovalGreen.png'),
    require('~src/assets/images/ovalBlue.png'),
    require('~src/assets/images/ovalPurple.png'),
  ]

  list.push(tokenValue1)
  list.push(tokenValue2)
  list.push(tokenValue3)
  list.push(tokenValue4)

  //endregion

  const [flatList] = useState(list)

  //region functions
  function flatListItemSeparator() {
    return <LinearLayout bg="text.2" height={1} />
  }

  function renderImage(index: number) {
    const mod: number = index % imageList.length
    const uriImage: NodeRequire =
      mod === 0 && index < imageList.length ? imageList[index] : imageList[mod]

    return <ImageView mr={4} source={uriImage} />
  }

  function renderElement(title: string, value: string) {
    return (
      <LinearLayout width={100} orientation="verti" mt={5} mb={4}>
        <TextView color="text.2" fontSize="sm">
          {title}
        </TextView>
        <TextView color="text.0" fontSize="lg">
          {value}
        </TextView>
      </LinearLayout>
    )
  }

  function formatValue(value: string, currency: string) {
    return `${currency}${value}`
  }

  //endregion

  return (
    <LinearLayout bg="background" height="100%">
      <LinearLayout p={5}>
        <TextView color="text.2" fontSize="sm">
          TOKEN VALUE
        </TextView>
        <FlatList
          data={flatList}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={flatListItemSeparator}
          renderItem={({item, index}) => (
            <LinearLayout orientation="horiz" alignItems="center">
              {renderImage(index)}
              {renderElement(item.name, item.symbol)}
              {renderElement('Holdings', item.holding)}
              {renderElement(
                'Value',
                formatValue(item.value, item.symbolCurrency)
              )}
            </LinearLayout>
          )}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

export default BalanceList

//TODO Put on models
class TokenValue {
  holding: string = ''
  value: string = ''
  name: string = ''
  symbol: string = ''
  symbolCurrency: string = DEFAULT_CURRENCY
}
