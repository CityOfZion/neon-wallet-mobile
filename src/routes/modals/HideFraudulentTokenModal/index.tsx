import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { Loader } from '@/components/Loader'
import { TwButton } from '@/components/TwButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TokenHelper } from '@/helpers/TokenHelper'

import { useBalance } from '@/hooks/useBalances'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbEyeOff from '@/assets/images/tb-eye-off.svg'

import { utilityReducerActions } from '@/store/reducers/utility'
import type { TRootStackScreenProps } from '@/types/stacks'

export const HideFraudulentTokenModal = ({
  navigation,
  route: {
    params: { account, hash },
  },
}: TRootStackScreenProps<'HideFraudulentTokenModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'hideFraudulentToken' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const balanceQuery = useBalance(account, { showType: 'active' })
  const dispatch = useAppDispatch()
  const [isHiding, startHide] = usePressOnce(() => {
    dispatch(utilityReducerActions.toggleHiddenToken({ hash, blockchain: account.blockchain }))
    ToastHelper.success({ message: t('hideSuccessMessage') })
    navigation.goBack()
  })

  const tokenBalance = useMemo(() => {
    if (balanceQuery.isLoading) return undefined

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

    return balanceQuery.data?.tokensBalances?.find(({ token }) => service.tokenService.predicateByHash(hash, token))
  }, [account.blockchain, balanceQuery.data?.tokensBalances, balanceQuery.isLoading, hash])

  const isNativeToken = useMemo(() => TokenHelper.isNativeToken(hash, account.blockchain), [hash, account])

  const isDisabled = isHiding || isNativeToken || !tokenBalance

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="gap-y-2 pt-2 pb-4">
        <Text className="text-center font-sans-regular text-sm text-gray-200">{t('text')}</Text>

        <Text className="mt-4 w-full text-left font-sans-bold text-sm uppercase text-gray-100">{t('details')}</Text>

        <View className="w-full items-center justify-center rounded border border-gray-600 bg-gray-900 p-3">
          {match({ isLoading: balanceQuery.isLoading, tokenBalance })
            .with({ isLoading: true }, () => <Loader containerClassName="my-4" className="size-8 text-white" />)
            .with({ tokenBalance: P.when(value => !value) }, () => (
              <Text className="w-full px-2 py-4 text-center font-sans-semibold text-lg text-white">
                {t('notFoundTokenLabel')}
              </Text>
            ))
            .otherwise(() => (
              <View className="flex w-full flex-col gap-y-2.5">
                <View className="w-full break-all border-b border-gray-600 pb-2.5">
                  <Text className="font-sans-regular text-base text-white">
                    <Text className="font-sans-semibold">{t('tokenHashLabel')}</Text> {hash}
                  </Text>
                </View>
                <View className="w-full border-b border-gray-600 pb-2.5">
                  <Text className="font-sans-regular text-base text-white">
                    <Text className="font-sans-semibold">{t('tokenNameLabel')}</Text> {tokenBalance!.token.name} (
                    {tokenBalance!.token.symbol})
                  </Text>
                </View>
                <View className="w-full border-b border-gray-600 pb-2.5">
                  <Text className="font-sans-regular text-base text-white">
                    <Text className="font-sans-semibold">{t('blockchainLabel')}</Text>{' '}
                    {tCommonBlockchain(`${account.blockchain}.label`)}
                  </Text>
                </View>
                <View className="w-full">
                  <Text className="font-sans-regular text-base text-white">
                    <Text className="font-sans-semibold">{t('amountLabel')}</Text> {tokenBalance!.amount}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <TwButton
          label={t('hideTokenButtonLabel')}
          className="mt-8 w-full"
          variant="contained-light"
          iconsOnEdge={false}
          isLoading={isHiding}
          disabled={isDisabled}
          rightElement={<TbEyeOff aria-hidden />}
          onPress={startHide}
        />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
