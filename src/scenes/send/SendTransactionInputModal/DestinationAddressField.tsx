import I18n from 'i18n-js'
import React, { Fragment, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey, blockchainServices } from '~/src/blockchain'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { IURI } from '~/src/helpers/UriHelper'
import { Account } from '~/src/models/redux/Account'
import { Contact } from '~/src/models/redux/Contact'

const DestinationAddressField = (props: {
  blockchain: BlockchainServiceKey
  address: string
  contact?: Contact
  onAddressChanged: (address: string) => void
  onSelected: (item: Contact | Account, addressSelected?: string) => void
  handleQrCode: (data: IURI | string) => void
  validateAddress: (val: string) => boolean
  onValidateAddress: (addressIsValid: boolean) => void
}) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const validateAddress = useCallback(() => {
    return blockchainServices[props.blockchain].validateAddress(props.address)
  }, [props.address])

  useEffect(() => {
    props.onValidateAddress(validateAddress())
  }, [props.address])

  return (
    <>
      <InputLabel
        title={I18n.t('modals.send.transactionInput.destinationAddress')}
        color="text.0"
        marginTop={30}
        marginBottom={30}
        capitalize
      />
      <InputWithValidation
        onChangeText={props.onAddressChanged}
        color={theme.colors.text[0]}
        invalidColor={theme.colors.text[10]}
        value={props.address}
        placeholder={I18n.t('modals.send.transactionInput.enterDestination')}
        validator={() => validateAddress()}
        separatorColor={theme.colors.background[13]}
        sideMargins={0}
        showContacts
        selectedContact={props.contact}
        onSelected={props.onSelected}
        onScan={props.handleQrCode}
        invalidMessageColor={theme.colors.quinary}
        addressSelected={props.address}
      />
    </>
  )
}

export default DestinationAddressField
