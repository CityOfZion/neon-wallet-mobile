import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { IURI } from '~/src/helpers/UriHelper'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { Account } from '~/src/models/redux/Account'
import { Contact } from '~/src/models/redux/Contact'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootState } from '~/src/store/RootStore'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'

type Props = {
  destinationAddress?: string
  destinationWallet?: Wallet
  destinationContact?: Contact
  destinationAccount?: Account
  account: Account
  onAddressChange(address?: string): void
  onContactChange(contact?: Contact): void
  onAccountChange(account?: Account): void
  onWalletChange(wallet?: Wallet): void
  onAddressValidation(isValid: boolean): void
}

type HandleChange = {
  address?: string
  account?: Account
  wallet?: Wallet
  contact?: Contact
}

export const DestinationInput = ({
  destinationAddress,
  destinationWallet,
  destinationContact,
  destinationAccount,
  account,
  onAddressChange,
  onContactChange,
  onAccountChange,
  onWalletChange,
  onAddressValidation,
}: Props) => {
  const { blockchainService } = useBlockchainService(account.blockchain)
  const accounts = useSelector(selectAccounts)
  const wallets = useSelector(selectWallets)
  const contacts = useSelector(selectContacts)

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const title = useMemo(() => {
    if (destinationContact?.name) {
      return destinationContact.name
    }

    if (destinationWallet?.name && destinationAccount && destinationAccount.address) {
      return `${destinationWallet.name} / ${destinationAccount.name}`
    }
  }, [destinationContact, destinationWallet, destinationAccount])

  const handleChanges = ({ account, address, contact, wallet }: HandleChange) => {
    const foundedAccount = account
      ? account
      : address
      ? accounts.find(account => account.address === address)
      : undefined

    const foundedWallet = wallet ? wallet : address && foundedAccount ? foundedAccount.getWallet(wallets) : undefined

    const foundedContact = contact
      ? contact
      : address && foundedAccount
      ? contacts.find(contact => contact.addresses.some(address => address.address === foundedAccount.address))
      : undefined

    onAddressChange(address)
    onAccountChange(foundedAccount)
    onWalletChange(foundedWallet)
    onContactChange(foundedContact)
  }

  const handleValidateDestinationAddress = (text: string) => {
    const isValid = blockchainService.validateAddress(text)

    onAddressValidation(isValid)

    return isValid
  }

  const handleSelectContactDestination = (contact: Contact, address: string) => {
    handleChanges({
      address,
      contact,
    })
  }

  const handleSelectAccountDestination = (selectedAccount: Account) => {
    handleChanges({
      address: selectedAccount.address ?? undefined,
      account: selectedAccount,
    })
  }

  const handleAddressDestinationChange = (text: string) => {
    handleChanges({
      address: text,
    })
  }

  const handleScan = (data: IURI | string) => {
    if (typeof data === 'string') {
      handleChanges({ address: data })
      return
    }

    handleChanges({ address: data.address })
  }

  return (
    <>
      <InputLabel
        title={i18n.t('modals.sendTransactionModal.destinationAddress')}
        color="text.0"
        marginTop={30}
        marginBottom={30}
        capitalize
      />

      <InputWithValidation
        onChangeText={handleAddressDestinationChange}
        color={theme.colors.text[0]}
        invalidColor={theme.colors.text[10]}
        value={destinationAddress ?? ''}
        placeholder={i18n.t('modals.sendTransactionModal.enterDestination')}
        validator={handleValidateDestinationAddress}
        separatorColor={theme.colors.background[13]}
        sideMargins={0}
        showContacts
        title={title ?? ''}
        onSelectContact={handleSelectContactDestination}
        onSelectAccount={handleSelectAccountDestination}
        onScan={handleScan}
        invalidMessageColor={theme.colors.quinary}
        addressSelected={destinationAddress}
        filterBlockchain={account.blockchain}
      />
    </>
  )
}
