import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { TwAccountList } from '@/components/TwAccountList'
import { TwButton } from '@/components/TwButton'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

type TProps = {
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export const AddressSelectionModalAccountsContent = ({ onSelect, blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'addressSelection' })

  const [selectedAccount, setSelectedAccount] = useState<TAccount>()

  const handleSelect = () => {
    if (!selectedAccount) return
    onSelect(selectedAccount.address)
  }

  return (
    <ModalLayout.ViewContent className="justify-between">
      <TwAccountList
        onPress={setSelectedAccount}
        selectedAccount={selectedAccount}
        blockchains={blockchain ? [blockchain] : undefined}
      />

      <TwButton
        className="mt-8"
        variant="contained-light"
        label={t('buttonLabel')}
        disabled={!selectedAccount}
        onPress={handleSelect}
      />
    </ModalLayout.ViewContent>
  )
}
