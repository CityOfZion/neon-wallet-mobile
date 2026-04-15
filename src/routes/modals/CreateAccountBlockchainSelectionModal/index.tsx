import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainList } from '@/components/BlockchainList'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'

import { AppError } from '@/helpers/ErrorHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCreateAccount } from '@/hooks/useAccountActions'
import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  blockchain: TBlockchainServiceKey
}

export const CreateAccountBlockchainSelectionModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'CreateAccountBlockchainSelectionModal'>) => {
  const { wallet } = route.params

  const { t: commonT } = useTranslation('common')
  const { t } = useTranslation('modals', { keyPrefix: 'createAccountBlockchainSelection' })
  const { createAccount } = useCreateAccount()
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

  const { actionData, actionState, setData, handleAct } = useActions<TActionData>({
    blockchain: wallet.type === 'hardware' ? accountsByWalletId[0].blockchain : 'neo3',
  })

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({
      blockchain: blockchains[0],
    })
  }

  const handlePressAdd = async () => {
    await UtilsHelper.sleep(1000)

    if (wallet.type !== 'standard') throw new AppError(t('errors.walletCannotDerivate'))

    await createAccount({
      blockchain: actionData.blockchain,
      wallet,
    })

    navigation.goBack()
  }

  return (
    <TwModalLayout
      rightElement={<TwModalLayoutCloseIconButton />}
      title={t('title')}
      contentContainerClassName="justify-between gap-3"
    >
      {actionState.isActing ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <View>
            <Text className="text-center font-sans-medium text-lg text-white">{t('description')}</Text>

            <BlockchainList
              className="mt-6"
              onSelect={handleSelect}
              selectedBlockchains={[actionData.blockchain]}
              isMulti={false}
              walletAccounts={accountsByWalletId}
              blockchains={wallet.type === 'hardware' ? [accountsByWalletId[0].blockchain] : undefined}
            />
          </View>

          <TwButton
            variant="contained-light"
            label={commonT('general.add')}
            disabled={!actionData.blockchain}
            onPress={handleAct(handlePressAdd)}
          />
        </Fragment>
      )}
    </TwModalLayout>
  )
}
