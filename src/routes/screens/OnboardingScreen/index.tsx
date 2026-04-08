import { useState } from 'react'

import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import { Image } from 'expo-image'
import type { ImageSourcePropType } from 'react-native'
import { Text, useWindowDimensions, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import type { CarouselRenderItem } from 'react-native-reanimated-carousel'
import Carousel from 'react-native-reanimated-carousel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TwButton } from '@/components/TwButton'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCreateAccount } from '@/hooks/useAccountActions'
import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useCreateWallet } from '@/hooks/useWalletActions'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import MdOutlineAutoAwesome from '@/assets/images/md-outline-auto-awesome.svg'

import { OnboardingScreenPagination } from './OnboardingScreenPagination'
import { OnboardingScreenProgress } from './OnboardingScreenProgress'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TWallet } from '@/types/store'

type TStep = 'wallet' | 'account' | 'finalizing'

const { t } = I18nextHelper.get()

const DATA = [
  {
    header: t('screens:onboardingScreen.feature1.header'),
    image: require('@/assets/images/onboarding-1.png') as ImageSourcePropType,
    subtitle: t('screens:onboardingScreen.feature1.subtitle'),
  },
  {
    header: t('screens:onboardingScreen.feature2.header'),
    image: require('@/assets/images/onboarding-2.png') as ImageSourcePropType,
    subtitle: t('screens:onboardingScreen.feature2.subtitle'),
  },
  {
    header: t('screens:onboardingScreen.feature3.header'),
    image: require('@/assets/images/onboarding-3.png') as ImageSourcePropType,
    subtitle: t('screens:onboardingScreen.feature3.subtitle'),
  },
  {
    header: t('screens:onboardingScreen.feature4.header'),
    image: require('@/assets/images/onboarding-4.png') as ImageSourcePropType,
    subtitle: t('screens:onboardingScreen.feature4.subtitle'),
  },
]

const PROGRESS_BY_STEP: Record<TStep, number> = {
  wallet: 0,
  account: 50,
  finalizing: 100,
}

const renderItem: CarouselRenderItem<(typeof DATA)[0]> = ({ item }) => (
  <View className="h-full w-full">
    <Image contentFit="contain" contentPosition="top" source={item.image} className="h-full w-full" />

    <View className="absolute bottom-10 w-full flex-col items-center gap-3 px-4">
      <Text className="text-center font-sans-medium text-2xl text-white">{item.header}</Text>
      <Text className="text-center font-sans-regular text-lg text-gray-100">{item.subtitle}</Text>
    </View>
  </View>
)

export const OnboardingScreen = ({ navigation }: TRootStackScreenProps<'OnboardingScreen'>) => {
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const { createWallet } = useCreateWallet()
  const { createAccount } = useCreateAccount()
  const { width } = useWindowDimensions()
  const { top, bottom } = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  const activeCarouselPage = useSharedValue<number>(0)

  const [step, setStep] = useState<TStep>()

  const handleSelectBlockchains = () => {
    navigation.navigate('BlockchainSelectionModal', {
      title: t('screens:onboardingScreen.selectBlockchainsModalTitle'),
      description: t('screens:onboardingScreen.selectBlockchainsModalDescription'),
      isMulti: true,
      onSelect: async selectedBlockchains => {
        if (accounts.length > 0) {
          setStep('finalizing')
          return
        }

        navigation.goBack()
        setStep('wallet')

        let wallet: TWallet | undefined = wallets[0]
        let mnemonic = ''

        if (!wallet) {
          mnemonic = BSKeychainHelper.generateMnemonic()

          wallet = await createWallet({
            name: t('common:wallet.firstWalletName'),
            mnemonic,
            type: 'standard',
          })
        }

        setStep('account')

        const accountPromises = selectedBlockchains.map(blockchain => createAccount({ blockchain, wallet }))

        await Promise.allSettled(accountPromises)

        setStep('finalizing')

        await UtilsHelper.sleep(500)

        dispatch(settingsReducerActions.setIsFirstTime(false))

        AnalyticsHelper.logEvent('onboarding_completed')

        navigation.replace('OnboardingCompletedScreen')
      },
    })
  }

  const handleImportWallet = () => {
    navigation.navigate('OnboardingImportModal', {
      onConfirm: () => {
        setStep('finalizing')
      },
    })
  }

  return (
    <TwScreenLayout
      withoutBackButton
      withoutHeader
      withoutBars
      className="bg-asphalt"
      contentContainerClassName="px-0 pb-0"
      style={{ paddingTop: top + 30 }}
    >
      <Carousel
        data={DATA}
        width={width}
        autoPlay
        autoPlayInterval={3000}
        containerStyle={{ flex: 1 }}
        mode="parallax"
        onProgressChange={activeCarouselPage}
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0,
        }}
        renderItem={renderItem}
      />

      <OnboardingScreenPagination activePage={activeCarouselPage} totalPages={DATA.length} />

      <View className="min-h-40 items-center gap-2 px-6 py-4" style={{ paddingBottom: Math.max(32, bottom) }}>
        {!step ? (
          <View className="w-full flex-col gap-y-4">
            <TwButton
              variant="card"
              label={t('screens:onboardingScreen.importWalletButtonLabel')}
              onPress={handleImportWallet}
            />
            <TwButton
              variant="contained-light"
              label={t('screens:onboardingScreen.createWalletButtonLabel')}
              onPress={handleSelectBlockchains}
              rightElement={<MdOutlineAutoAwesome aria-hidden />}
            />
          </View>
        ) : (
          <View className="w-full flex-col items-center justify-evenly">
            <OnboardingScreenProgress progress={PROGRESS_BY_STEP['finalizing']} />
            <Text className="mt-10 text-center font-sans-medium text-base text-gray-100">
              {t('screens:onboardingScreen.messagesByActions.finalizing')}
            </Text>
          </View>
        )}
      </View>
    </TwScreenLayout>
  )
}
