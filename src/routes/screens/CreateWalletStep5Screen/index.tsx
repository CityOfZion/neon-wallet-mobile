import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainList } from '@/components/BlockchainList'
import { TwButton } from '@/components/TwButton'

import { useCreateAccount } from '@/hooks/useAccountActions'
import { useActions } from '@/hooks/useActions'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TMoreStackScreenProps } from '@/types/stacks'

type TActionData = {
  selectedBlockchains: TBlockchainServiceKey[]
}

export const CreateWalletStep5Screen = ({ navigation, route }: TMoreStackScreenProps<'CreateWalletStep5Screen'>) => {
  const { mnemonic, name, hasBackup } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep5' })
  const { createWallet } = useCreateWallet()
  const { createAccount } = useCreateAccount()

  const { actionData, actionState, setDataWrapper, handleAct } = useActions<TActionData>({ selectedBlockchains: [] })

  const handlePressContinue = async () => {
    const wallet = await createWallet({
      name,
      mnemonic,
      type: 'standard',
      backupStatus: hasBackup ? 'successful' : 'unsuccessful',
    })

    const promises = actionData.selectedBlockchains.map(blockchain => createAccount({ blockchain, wallet }))

    await Promise.allSettled(promises)

    navigation.pop(5)
    navigation.navigate('CreateWalletStep6Screen', { wallet })
  }

  return (
    <TwScreenLayout title={t('title')} contentContainerClassName="justify-between">
      <Text className="text-center font-sans-medium text-lg text-white">{t('subtitle')}</Text>

      <BlockchainList
        className="mt-6"
        isMulti
        onSelect={setDataWrapper('selectedBlockchains')}
        selectedBlockchains={actionData.selectedBlockchains}
      />

      <View className="mt-auto py-3">
        <TwButton
          variant="contained-light"
          label={t('continueButtonLabel')}
          disabled={actionData.selectedBlockchains.length <= 0}
          onPress={handleAct(handlePressContinue)}
          isLoading={actionState.isActing}
        />
      </View>
    </TwScreenLayout>
  )
}
