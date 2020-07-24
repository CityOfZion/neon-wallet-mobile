import PropTypes from 'prop-types'
import React from 'react'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {AssetQuoteModel} from '~src/models/AssetQuoteModel'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  assetQuote: AssetQuoteModel
}

const AssetQuoteComponent: React.FC<Props> = (props) => {
  //TODO get the real value of asset
  const quoteOfAsset = 12345
  const quoteText = `${props.assetQuote.name} 1 = ${Facade.t(
    `currencies.${Currency.USD}`
  )} ${FilterHelper.decimal(quoteOfAsset, 2)}`
  const valueText = `${Facade.t(
    `currencies.${Currency.USD}`
  )} ${FilterHelper.decimal(quoteOfAsset, 2)}`

  return (
    <LinearLayout
      orientation={'horiz'}
      width={'100%'}
      height={50}
      marginTop={15}
      alignItems="center"
    >
      <ImageView
        width={35}
        height={35}
        marginRight="10px"
        source={require('~src/assets/images/Bitmap_Copy.png')}
      />

      <LinearLayout weight={1} orientation={'verti'} height={'100%'}>
        <TextView
          fontFamily={'medium'}
          fontSize={12}
          color="text.2"
          textAlign="left"
          numberOfLines={1}
        >
          {props.assetQuote.name}
        </TextView>
        <TextView
          fontFamily={'bold'}
          fontSize={24}
          color="white"
          textAlign="left"
          numberOfLines={1}
        >
          {props.assetQuote.fullName}
        </TextView>
      </LinearLayout>

      <LinearLayout
        alignItems="flex-end"
        weight={2}
        orientation={'verti'}
        width={'100%'}
        height={'100%'}
      >
        <TextView
          fontFamily={'medium'}
          fontSize={18}
          color="text.2"
          textAlign="left"
          numberOfLines={1}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
        >
          {valueText}
        </TextView>
        <TextView
          fontFamily={'medium'}
          fontSize={18}
          color="white"
          textAlign="left"
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
  assetQuote: PropTypes.instanceOf(AssetQuoteModel).isRequired,
}

export default AssetQuoteComponent
