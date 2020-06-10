import React, {useState} from 'react'
import {FlatList} from 'react-native'
import styled from '~src/styles/styled-components'
import {
  color,
  ColorProps,
  flexbox, FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps
} from 'styled-system'
import {orientation, OrientationProps} from '~src/styles/styled-system.config'

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
    return <Container bg='text.2' height={1} />
  }

  function renderImage(index: number) {
    let mod: number = index % imageList.length
    let uriImage: NodeRequire =
      mod == 0 && index < imageList.length ? imageList[index] : imageList[mod]

    return <ItemImage mr={4} source={uriImage} />
  }

  function renderElement(title: string, value: string) {
    return (
      <Container width={100} orientation='verti' mt={5} mb={4}>
        <ItemText color='text.2' fontSize={1}>{title}</ItemText>
        <ItemText color='text.0' fontSize={3}>{value}</ItemText>
      </Container>
    )
  }

  function formatValue(value: String, currency: string) {
    return `${currency}${value}`
  }

  //endregion

  return (
    <Container bg='background' height='100%'>
      <Container p={5}>
        <ItemText color='text.2' fontSize={1}>TOKEN VALUE</ItemText>
        <FlatList
          data={flatList}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={flatListItemSeparator}
          renderItem={({item, index}) => (
            <Container orientation='horiz' alignItems='center'>
              {renderImage(index)}
              {renderElement(item.name, item.symbol)}
              {renderElement('Holdings', item.holding)}
              {renderElement(
                'Value',
                formatValue(item.value, item.symbolCurrency)
              )}
            </Container>
          )}
        />
      </Container>
    </Container>
  )
}

const ItemText = styled.Text<ColorProps & TypographyProps>`
  ${color}
  ${typography}
`

const Container = styled.View<ColorProps & OrientationProps & SpaceProps & LayoutProps & FlexboxProps>`
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
`

const ItemImage = styled.Image<SpaceProps>`
  ${space}
`

export default BalanceList

//TODO Put on models
class TokenValue {
  holding: string = ''
  value: string = ''
  name: string = ''
  symbol: string = ''
  symbolCurrency: string = DEFAULT_CURRENCY
}
