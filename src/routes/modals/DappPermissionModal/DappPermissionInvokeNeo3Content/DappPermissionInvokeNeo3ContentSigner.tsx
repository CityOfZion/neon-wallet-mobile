import type { Signer } from '@cityofzion/bs-neo3'
import { BSNeo3NeonJsSingletonHelper } from '@cityofzion/bs-neo3'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwIconButton } from '@/components/TwIconButton'

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
    <TouchableOpacity onPress={handleViewSignatureScope} activeOpacity={0.9}>
      <TwDetailsCard.Root>
        <TwDetailsCard.Header
          leftElement={<TbCube3dSphere aria-hidden />}
          rightElement={
            <View className="flex flex-row items-center gap-2">
              <Text className="font-sans-semibold text-base capitalize text-gray-100">{scope}</Text>

              <TwIconButton
                className="p-0"
                aria-label={t('viewSignatureScopeButtonLabel')}
                icon={<MdChevronRight aria-hidden />}
                onPress={handleViewSignatureScope}
              />
            </View>
          }
        >
          <Text className="font-sans-regular text-base capitalize text-white">
            {t('signatureScopeDetailsHeaderLabel')}
          </Text>
        </TwDetailsCard.Header>
      </TwDetailsCard.Root>
    </TouchableOpacity>
  )
}
