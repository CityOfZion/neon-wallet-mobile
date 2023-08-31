import { TransactionTransferAsset, TransactionTransferNft } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { TransferAssetItem } from './TransferAssetItem'
import { TransferNFTItem } from './TransferNFTItem'

import { Account } from '~/src/store/account/Account'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import { TextView, LinearLayout } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = (TransactionTransferAsset | TransactionTransferNft) & {
  account: Account
  exchange?: MultiExchange
}

export const TransferItem = React.memo((props: Props) => {
  const contacts = useSelector(selectContacts)

  const label =
    props.to === props.account.address
      ? [i18n.t('screens.accountTransaction.receivedFromLabel')]
      : [i18n.t('screens.accountTransaction.sentToLabel')]

  const address = props.to === props.account.address ? props.from : props.to
  const contact = contacts.find(contact => contact.addresses.find(it => it.address === address))
  const identification = contact?.name ?? address

  return (
    <LinearLayout pb="8px" mb="16px" borderBottomColor="text.3" borderBottomWidth="1px">
      <TextView color="text.6" fontSize="14px" fontFamily="medium">
        {label}
      </TextView>

      <LinearLayout orientation="horiz" justifyContent="space-between" pb="6px" width="100%">
        <TextView
          ellipsizeMode="middle"
          numberOfLines={1}
          color="primary"
          fontSize="17px"
          fontFamily="medium"
          width="50%"
        >
          {identification}
        </TextView>

        <TextView color="text.6" fontSize="14px" fontFamily="bold">
          {i18n.t(`screens.accountTransaction.${props.type}`).toUpperCase()}
        </TextView>
      </LinearLayout>

      {props.type === 'token' ? <TransferAssetItem {...props} /> : <TransferNFTItem {...props} />}
    </LinearLayout>
  )
})
