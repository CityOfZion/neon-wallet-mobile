import React, {useState} from 'react'
import {FlatList, StyleSheet, View, Text, Image} from 'react-native'

import {DEFAULT_CURRENCY} from '~/constants'

//TODO Remove all hardcoded texts
const BalanceList: React.FC<object> = () => {
  //region Test
  let tokenValue1 = new TokenValue()
  tokenValue1.name = 'NEO'
  tokenValue1.symbol = 'NEO'
  tokenValue1.holding = '1235,00'
  tokenValue1.value = '6665,00'

  let tokenValue2 = new TokenValue()
  tokenValue2.name = 'GAS'
  tokenValue2.symbol = 'GAS'
  tokenValue2.holding = '12405,00'
  tokenValue2.value = '665,00'

  let tokenValue3 = new TokenValue()
  tokenValue3.name = 'MYCOIN'
  tokenValue3.symbol = 'MC'
  tokenValue3.holding = '45,00'
  tokenValue3.value = '65,00'

  let tokenValue4 = new TokenValue()
  tokenValue4.name = 'THECOIN'
  tokenValue4.symbol = 'TC'
  tokenValue4.holding = '458,00'
  tokenValue4.value = '6565,00'

  let list = []

  let imageList = [
    require('../image/ovalGreen.png'),
    require('../image/ovalBlue.png'),
    require('../image/ovalPurple.png'),
  ]

  list.push(tokenValue1)
  list.push(tokenValue2)
  list.push(tokenValue3)
  list.push(tokenValue4)

  //endregion

  const [flatList] = useState(list)

  //region functions
  function flatListItemSeparator() {
    return <View style={styles.divider} />
  }

  function renderImage(index: number) {
    let mod: number = index % imageList.length
    let uriImage: NodeRequire =
      mod == 0 && index < imageList.length ? imageList[index] : imageList[mod]

    return <Image style={styles.columnImage} source={uriImage} />
  }

  function renderElement(title: string, value: string) {
    return (
      <View style={styles.column}>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textSubTitle}>{value}</Text>
      </View>
    )
  }

  function formatValue(value: String, currency: string) {
    return `${currency}${value}`
  }

  //endregion

  return (
    <View style={styles.MainConteiner}>
      <View style={styles.ListContainer}>
        <Text style={styles.listTitle}>TOKEN VALUE</Text>
        <FlatList
          data={flatList}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={flatListItemSeparator}
          renderItem={({item, index}) => (
            <View style={styles.row}>
              {renderImage(index)}
              {renderElement(item.name, item.symbol)}
              {renderElement('Holdings', item.holding)}
              {renderElement(
                'Value',
                formatValue(item.value, item.symbolCurrency)
              )}
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ListContainer: {
    padding: 15,
  },

  MainConteiner: {
    backgroundColor: '#111',
    flex: 1,
  },

  listTitle: {
    fontSize: 14,
    color: '#8ba0a9',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  column: {
    flex: 1,
    marginTop: 17,
    flexDirection: 'column',
    marginBottom: 13,
  },

  columnImage: {
    marginRight: 13,
  },
  textTitle: {
    fontSize: 14,
    color: '#8ba0a9',
  },
  textSubTitle: {
    fontSize: 18,
    color: '#fff',
  },

  divider: {
    height: 1,
    backgroundColor: '#8ba0a9',
  },
})

export default BalanceList

//TODO Put on models
class TokenValue {
  holding: string = ''
  value: string = ''
  name: string = ''
  symbol: string = ''
  symbolCurrency: string = DEFAULT_CURRENCY
}
