import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '~src/app/Normalize'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  token: TokenAsset
}

const AssetQuoteComponent: React.FC<Props> = props => {
  const { exchange } = useSelector((state: RootState) => state.app)
  const { language, currency } = useSelector((state: RootState) => state.settings)

  const ratio = props.token.getCurrencyRatio(currency, exchange[props.token.blockchain])
  const amountExchanged = props.token.exchangeToken(currency, exchange[props.token.blockchain])

  const quoteText = ratio
    ? `${props.token.symbol} 1 = ${FilterHelper.currencyExtendedMaxLimit(ratio, currency, language)}`
    : ''

  const valueText = FilterHelper.currency(amountExchanged, currency, language)

  return (
    <LinearLayout orientation="horiz" width="100%" alignItems="center">
      <ImageView
        mr={4}
        width={Normalize.scale(32)}
        height={Normalize.scale(32)}
        resizeMode="contain"
        source={props.token.srcIcon}
      />

      <LinearLayout weight={1} mr={4} orientation="verti">
        <TextView
          fontFamily="bold"
          fontSize="2xl"
          color="white"
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {props.token.name}
        </TextView>

        <TextView
          mb={-1}
          fontFamily="medium"
          fontSize={12}
          color="text.2"
          textAlign="left"
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {props.token.symbol}
        </TextView>
      </LinearLayout>

      <LinearLayout alignItems="flex-end">
        <TextView
          mb={-1}
          fontFamily="medium"
          fontSize="md"
          color="text.2"
          numberOfLines={1}
          allowFontScaling
          adjustsFontSizeToFit
        >
          {valueText}
        </TextView>
        <TextView
          fontFamily="medium"
          fontSize="lg"
          color="text.0"
          numberOfLines={1}
          allowFontScaling
          adjustsFontSizeToFit
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
