import i18n from 'i18n-js'
import { debounce } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { IURI } from '~/src/helpers/UriHelper'
import { useBlockchainServiceLib } from '~/src/hooks/useBlockchainServiceLib'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { Account } from '~/src/models/redux/Account'
import { Contact } from '~/src/models/redux/Contact'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootState } from '~/src/store/RootStore'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { ContactAddresses } from '~/src/types/reducers/contact'

type Props = {
  destinationAddress?: string
  destinationWallet?: Wallet
  destinationContact?: Contact
  destinationAccount?: Account
  destinationAddressIsValid?: boolean
  destinationAddressAlias?: string
  account: Account
  onAddressChange(address?: string): void
  onContactChange(contact?: Contact): void
  onAccountChange(account?: Account): void
  onWalletChange(wallet?: Wallet): void
  onAddressValidation(isValid: boolean): void
  onAddressAliasChange(addressAlias?: string): void
}

type HandleChange = {
  address: string
  selectedAccount?: Account
  selectedWallet?: Wallet
  selectedContact?: Contact
}

export const DestinationInput = ({
  destinationAddress,
  destinationWallet,
  destinationContact,
  destinationAccount,
  destinationAddressIsValid,
  destinationAddressAlias,
  account,
  onAddressChange,
  onContactChange,
  onAccountChange,
  onWalletChange,
  onAddressValidation,
  onAddressAliasChange,
}: Props) => {
  const { blockchainService } = useBlockchainService(account.blockchain)
  const { getBlockchainServiceLib, hasNNS } = useBlockchainServiceLib()
  const accounts = useSelector(selectAccounts)
  const wallets = useSelector(selectWallets)
  const contacts = useSelector(selectContacts)

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const [loading, setLoading] = useState(false)

  const title = useMemo(() => {
    if (destinationAddressAlias) {
      return destinationAddressAlias
    }

    if (destinationContact?.name) {
      return destinationContact.name
    }

    if (destinationWallet?.name && destinationAccount && destinationAccount.address) {
      return `${destinationWallet.name} / ${destinationAccount.name}`
    }
  }, [destinationContact, destinationWallet, destinationAccount, destinationAddressAlias])

  const validateAddressOrNSS = useCallback(
    debounce(async ({ address, selectedAccount, selectedContact, selectedWallet }: HandleChange) => {
      onAddressAliasChange(undefined)

      let isValid = false
      let resovedAddress: string | undefined
      let isNNS = false

      try {
        const serviceLib = getBlockchainServiceLib(account.blockchain)

        if (hasNNS(serviceLib) && serviceLib.validateNNSFormat(address)) {
          try {
            isNNS = true
            setLoading(true)
            resovedAddress = await serviceLib.getOwnerOfNNS(address.toLowerCase())
            onAddressAliasChange(address.toLowerCase())
            isValid = true
            onAddressChange(resovedAddress)
          } finally {
            setLoading(false)
          }
        }
      } catch {}

      if (!isNNS && blockchainService.validateAddress(address)) {
        isValid = true
        resovedAddress = address
      }

      onAddressValidation(isValid)
      const foundedAccount = selectedAccount
        ? selectedAccount
        : resovedAddress
        ? accounts.find(account => account.address === address)
        : undefined

      const foundedWallet = selectedWallet
        ? selectedWallet
        : resovedAddress && foundedAccount
        ? foundedAccount.getWallet(wallets)
        : undefined

      const foundedContact = selectedContact
        ? selectedContact
        : contacts.find(contact => contact.addresses.some(contactAddress => contactAddress.address === address))

      onAccountChange(foundedAccount)
      onWalletChange(foundedWallet)
      onContactChange(foundedContact)
    }, 1000),
    [getBlockchainServiceLib, blockchainService]
  )

  const handleSelectContactDestination = (selectedContact: Contact, { address }: ContactAddresses) => {
    onAddressChange(address)
    validateAddressOrNSS({
      address,
      selectedContact,
    })
  }

  const handleSelectAccountDestination = (selectedAccount: Account) => {
    if (!selectedAccount.address) return
    onAddressChange(selectedAccount.address)
    validateAddressOrNSS({
      address: selectedAccount.address,
      selectedAccount,
    })
  }

  const handleAddressDestinationChange = (text: string) => {
    onAddressChange(text)
    validateAddressOrNSS({
      address: text,
    })
  }

  const handleScan = (data: IURI | string) => {
    const address = typeof data === 'string' ? data : data.address
    onAddressChange(address)
    validateAddressOrNSS({ address })
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
        isValid={destinationAddressIsValid}
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
        loading={loading}
      />
    </>
  )
}
