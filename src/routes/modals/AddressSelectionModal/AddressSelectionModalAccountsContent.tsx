import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwAccountList } from '@/components/TwAccountList'
import { TwButton } from '@/components/TwButton'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

type TProps = {
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export const AddressSelectionModalAccountsContent = ({ onSelect, blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'addressSelectionModal' })

  const [selectedAccount, setSelectedAccount] = useState<TAccount>()

  const handleSelect = () => {
    if (!selectedAccount) return
    onSelect(selectedAccount.address)
  }

  return (
    <View className="flex-shrink flex-grow justify-between">
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
    </View>
  )
}
