import React from 'react'

import { FormattedTransferNFT } from './AccountTransactionsScreen'

import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type TransferNFTItemProps = FormattedTransferNFT
// eslint-disable-next-line react/display-name
export const TransferNFTItem = React.memo((props: TransferNFTItemProps) => {
  return (
    <LinearLayout orientation="horiz" alignItems="flex-end">
      <LinearLayout width="22px" height="22px" borderRadius="2px" overflow="hidden">
        <ImageView width="100%" height="100%" resizeMode="cover" alignSelf="center" source={{ uri: props.image }} />
      </LinearLayout>
      <LinearLayout ml="8px">
        <TextView color="#fff" fontFamily="bold" fontSize="16px">
          {props.name}
        </TextView>
        <LinearLayout orientation="horiz">
          <TextView fontSize="10px" color="#7d929a">
            {props.collectionName}
          </TextView>
          <TextView fontSize="10px" color="#7d929a">
            {' - #'}
          </TextView>
          <TextView fontSize="10px" color="#7d929a">
            {props.tokenId}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
})
