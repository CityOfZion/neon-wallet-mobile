import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { FormattedTransferAsset, FormattedTransferNFT } from './AccountTransactionsScreen'
import { TransferAssetItem } from './TransferAssetItem'
import { TransferNFTItem } from './TransferNFTItem'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { TransactionTransferType } from '~/src/models/TransactionAddressSummary'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import { TextView, LinearLayout } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = (FormattedTransferAsset | FormattedTransferNFT) & {
  account: Account
  exchange?: MultiExchange
}

export const TransferItem = React.memo((props: Props) => {
  const contacts = useSelector(selectContacts)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const handleSentOrReceived = () => {
    const [address, status] = props.to === props.account.address ? [props.from, 'received'] : [props.to, 'sent']

    const contact = contacts.find(
      contact => contact.address === address || contact.addresses.find(it => it.address === address)
    )

    const identification = contact?.name ? contact.name : address
    const statusLabel =
      status === 'sent'
        ? i18n.t('screens.accountTransaction.sentToLabel')
        : i18n.t('screens.accountTransaction.receivedFromLabel')

    return {
      statusLabel,
      identification,
    }
  }
  const { identification, statusLabel } = handleSentOrReceived()

  return (
    <LinearLayout pb="8px" mb="16px" borderBottomColor={theme.colors.text[3]} borderBottomWidth="1px">
      <TextView color="#899fa8" fontSize="14px" fontFamily="medium">
        {statusLabel}
      </TextView>
      <LinearLayout orientation="horiz" justifyContent="space-between" pb={3} width="100%">
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
        <TextView color={theme.colors.text[6]} fontSize="14px" fontFamily="bold">
          {i18n.t(`screens.accountTransaction.${props.type}`).toUpperCase()}
        </TextView>
      </LinearLayout>

      {props.type === TransactionTransferType.ASSET ? <TransferAssetItem {...props} /> : <TransferNFTItem {...props} />}
    </LinearLayout>
  )
})
