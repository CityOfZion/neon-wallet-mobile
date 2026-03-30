import { hasEncryption } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { BlockchainList } from '@/components/BlockchainList'
import { TwButton } from '@/components/TwButton'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useDoesAccountExist, useImportAccount } from '@/hooks/useAccountActions'
import { useActions } from '@/hooks/useActions'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TWallet } from '@/types/store'

type TActionsData = {
  blockchain: TBlockchainServiceKey[]
}

export const ImportEncryptedKeySelectionModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'ImportEncryptedKeySelectionModal'>) => {
  const { encryptedKey, onConfirm } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'importEncryptedKeySelectionModal' })
  const { t: tCommon } = useTranslation('common')
  const { createWallet } = useCreateWallet()
  const { importAccount } = useImportAccount()
  const { doesAccountExist } = useDoesAccountExist()
  const { actionData, setData, handleAct } = useActions<TActionsData>({
    blockchain: [],
  })

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({ blockchain: blockchains })
  }

  const handleSubmit = () => {
    const [blockchain] = actionData.blockchain
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    if (!hasEncryption(service)) throw new AppError(tCommon('errors.blockchainDoesNotSupportEncryption'))

    let wallet: TWallet

    navigation.navigate('PasswordModal', {
      title: t('title'),
      buttonProps: { label: tCommon('general.next'), rightElement: <TbArrowRight aria-hidden /> },
      inputProps: { placeholder: t('importEncryptedKeyInputPlaceholder') },
      description: t('importEncryptedConfirmPasswordLabel'),
      onConfirm: async (password: string) => {
        const { address, key } = await service.decrypt(encryptedKey, password)

        if (doesAccountExist({ address, blockchain })) {
          throw new AppError(t('accountAlreadyExists'))
        }

        wallet = await createWallet({
          name: tCommon('wallet.encryptedName'),
          backupStatus: 'successful',
          type: 'non-standard',
        })

        await importAccount({ address, blockchain, wallet, key, type: 'standard' })
      },
      onSuccess: () => {
        AnalyticsHelper.logEvent('wallet_imported')

        onConfirm()
      },
      onError: error => {
        LoggerHelper.error(error, { where: 'PasswordModal', operation: 'handlePressNext' })
        ToastHelper.error({ message: AppError.wrap(error, t('decryptError')).message })
      },
    })
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <Text className="mb-6 text-center font-sans-medium text-lg text-white">{t('description')}</Text>

      <BlockchainList onSelect={handleSelect} selectedBlockchains={actionData.blockchain} isMulti={false} />

      <TwButton
        className="mb-4 mt-auto"
        variant="contained-light"
        label={tCommon('general.next')}
        disabled={!actionData.blockchain.length}
        onPress={handleAct(handleSubmit)}
        rightElement={<TbArrowRight aria-hidden />}
      />
    </TwModalLayout>
  )
}
