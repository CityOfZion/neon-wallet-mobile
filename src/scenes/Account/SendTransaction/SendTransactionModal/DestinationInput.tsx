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
  account: Account
  onAddressChange(address?: string): void
  onContactChange(contact?: Contact): void
  onAccountChange(account?: Account): void
  onWalletChange(wallet?: Wallet): void
  onAddressValidation(isValid: boolean): void
}

type HandleChange = {
  addressOrDomain: string
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
  account,
  onAddressChange,
  onContactChange,
  onAccountChange,
  onWalletChange,
  onAddressValidation,
}: Props) => {
  const { blockchainService } = useBlockchainService(account.blockchain)
  const { getBlockchainServiceLib, hasNNS } = useBlockchainServiceLib()
  const accounts = useSelector(selectAccounts)
  const wallets = useSelector(selectWallets)
  const contacts = useSelector(selectContacts)

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const [NNSAddress, setNNSAddress] = useState<string>()
  const [loading, setLoading] = useState(false)

  const title = useMemo(() => {
    if (NNSAddress) {
      return NNSAddress
    }

    if (destinationContact?.name) {
      return destinationContact.name
    }

    if (destinationWallet?.name && destinationAccount && destinationAccount.address) {
      return `${destinationWallet.name} / ${destinationAccount.name}`
    }
  }, [destinationContact, destinationWallet, destinationAccount, NNSAddress])

  const validateAddressOrNSS = useCallback(
    debounce(async ({ addressOrDomain, selectedAccount, selectedContact, selectedWallet }: HandleChange) => {
      setNNSAddress(undefined)

      let isValid = false
      let address: string | undefined

      const serviceLib = getBlockchainServiceLib(account.blockchain)
      if (hasNNS(serviceLib) && serviceLib.validateNNSFormat(addressOrDomain)) {
        try {
          setLoading(true)
          const nnsAddress = await serviceLib.getOwnerOfNNS(addressOrDomain.toLowerCase())
          setNNSAddress(addressOrDomain.toLowerCase())
          isValid = true
          address = nnsAddress
          onAddressChange(nnsAddress)
        } finally {
          setLoading(false)
        }
      } else if (blockchainService.validateAddress(addressOrDomain)) {
        isValid = true
        address = addressOrDomain
      }

      onAddressValidation(isValid)
      const foundedAccount = selectedAccount
        ? selectedAccount
        : address
        ? accounts.find(account => account.address === address)
        : undefined

      const foundedWallet = selectedWallet
        ? selectedWallet
        : address && foundedAccount
        ? foundedAccount.getWallet(wallets)
        : undefined

      const foundedContact = selectedContact
        ? selectedContact
        : contacts.find(contact => contact.addresses.some(address => address.addressOrDomain === addressOrDomain))

      onAccountChange(foundedAccount)
      onWalletChange(foundedWallet)
      onContactChange(foundedContact)
    }, 1000),
    [getBlockchainServiceLib, blockchainService]
  )

  const handleSelectContactDestination = (selectedContact: Contact, { addressOrDomain }: ContactAddresses) => {
    onAddressChange(addressOrDomain)
    validateAddressOrNSS({
      addressOrDomain,
      selectedContact,
    })
  }

  const handleSelectAccountDestination = (selectedAccount: Account) => {
    if (!selectedAccount.address) return
    onAddressChange(selectedAccount.address)
    validateAddressOrNSS({
      addressOrDomain: selectedAccount.address,
      selectedAccount,
    })
  }

  const handleAddressDestinationChange = (text: string) => {
    onAddressChange(text)
    validateAddressOrNSS({
      addressOrDomain: text,
    })
  }

  const handleScan = (data: IURI | string) => {
    const addressOrDomain = typeof data === 'string' ? data : data.address
    onAddressChange(addressOrDomain)
    validateAddressOrNSS({ addressOrDomain })
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
