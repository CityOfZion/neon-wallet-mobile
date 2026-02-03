import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainList } from '@/components/BlockchainList'
import { TwButton } from '@/components/TwButton'

import { useActions } from '@/hooks/useActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TMoreStackScreenProps } from '@/types/stacks'

type TActionData = {
  selectedBlockchains: TBlockchainServiceKey[]
}

export const ImportBlockchainSelectionScreen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'ImportBlockchainSelectionScreen'>) => {
  const { encryptedKey } = route.params
  const { t } = useTranslation('screens', { keyPrefix: 'importBlockchainSelectionScreen' })
  const { t: commonT } = useTranslation('common')

  const { actionData, actionState, setDataWrapper, handleAct } = useActions<TActionData>({ selectedBlockchains: [] })

  const handlePressContinue = () => {
    navigation.navigate('ImportPassphraseScreen', {
      encryptedKey,
      blockchain: actionData.selectedBlockchains[0],
    })
  }

  return (
    <TwScreenLayout title={t('title')}>
      <Text className="px-10 text-center font-sans-medium text-lg text-white">{t('subtitle')}</Text>

      <BlockchainList
        className="mt-6"
        isMulti={false}
        onSelect={setDataWrapper('selectedBlockchains')}
        selectedBlockchains={actionData.selectedBlockchains}
      />

      <View className="mt-auto py-3">
        <TwButton
          variant="contained-light"
          label={commonT('general.next')}
          disabled={actionData.selectedBlockchains.length <= 0}
          onPress={handleAct(handlePressContinue)}
          isLoading={actionState.isActing}
        />
      </View>
    </TwScreenLayout>
  )
}
