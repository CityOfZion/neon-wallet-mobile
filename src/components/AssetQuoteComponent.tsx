import PropTypes from 'prop-types'
import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TokenAsset} from '~src/models/TokenAsset'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  token: TokenAsset
}

const AssetQuoteComponent: React.FC<Props> = (props) => {
  const {exchange} = useSelector((state: RootState) => state.app)
  const {language, currency} = useSelector((state: RootState) => state.settings)

  const ratio = props.token.getCurrencyRatio(currency, exchange)
  const amountExchanged = props.token.exchange(currency, exchange)

  const quoteText = ratio
    ? `${props.token.symbol} 1 = ${Facade.filter.currency(
        ratio,
        currency,
        language
      )}`
    : ''

  const valueText = Facade.filter.currency(amountExchanged, currency, language)

  return (
    <LinearLayout orientation={'horiz'} width={'100%'} alignItems="center">
      <ImageView
        mr={4}
        width={Facade.scale(32)}
        height={Facade.scale(32)}
        resizeMode={'contain'}
        source={props.token.srcIcon}
      />

      <LinearLayout weight={1} mr={4} orientation={'verti'}>
        <TextView
          mb={-1}
          fontFamily={'medium'}
          fontSize={12}
          color="text.2"
          textAlign="left"
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {props.token.symbol}
        </TextView>

        <TextView
          fontFamily={'bold'}
          fontSize={'2xl'}
          color="white"
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {props.token.name}
        </TextView>
      </LinearLayout>

      <LinearLayout alignItems="flex-end">
        <TextView
          mb={-1}
          fontFamily={'medium'}
          fontSize={'md'}
          color={'text.2'}
          numberOfLines={1}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
        >
          {valueText}
        </TextView>
        <TextView
          fontFamily={'medium'}
          fontSize={'lg'}
          color={'text.0'}
          numberOfLines={1}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
        >
          {quoteText}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

AssetQuoteComponent.propTypes = {
  token: PropTypes.instanceOf(TokenAsset).isRequired,
}

export default AssetQuoteComponent
