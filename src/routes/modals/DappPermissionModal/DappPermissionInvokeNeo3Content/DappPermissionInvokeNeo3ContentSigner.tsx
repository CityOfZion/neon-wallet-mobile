import type { Signer } from '@cityofzion/bs-neo3'
import { BSNeo3NeonJsSingletonHelper } from '@cityofzion/bs-neo3'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { PressableScale } from '@/components/PressableScale'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'
import TbCube3dSphere from '@/assets/images/tb-cube-3d-sphere.svg'

import type { TDappPermissionProps } from '../index'

type TProps = {
  signer: Signer
} & TDappPermissionProps

const resolveSigner = (scope: string | number) => {
  let witnessScope: string = scope.toString()

  const { tx } = BSNeo3NeonJsSingletonHelper.getInstance()

  if (typeof scope === 'number') {
    witnessScope = tx.toString(scope)
  } else if (typeof scope === 'string') {
    witnessScope = tx.parse(scope).toString()
  }

  return witnessScope
}

export const DappPermissionInvokeNeo3ContentSigner = ({ signer, session }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionModal.customContents.invokeNeo3' })
  const navigation = useNavigation()

  const scope = resolveSigner(signer.scopes)

  const handleViewSignatureScope = () => {
    navigation.navigate('DappPermissionSignatureScopeModal', {
      session,
      scope,
      allowedList: signer.allowedContracts ?? signer.allowedGroups,
    })
  }

  return (
    <PressableScale onPress={handleViewSignatureScope}>
      <Details.Root>
        <Details.Header
          leftElement={<TbCube3dSphere aria-hidden />}
          rightElement={
            <View className="flex flex-row items-center gap-2">
              <Text className="font-sans-semibold text-base capitalize text-gray-100">{scope}</Text>
              <MdChevronRight className="size-6 text-gray-100" aria-hidden />
            </View>
          }
          labelClassName="capitalize"
        >
          {t('signatureScopeDetailsHeaderLabel')}
        </Details.Header>
      </Details.Root>
    </PressableScale>
  )
}
