import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { ImageBackground, ImageResizeMode, ImageSourcePropType, SafeAreaView } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useDispatch } from 'react-redux'

import { ProgressBar } from '../components/ProgressBar'
import { AsteroidHelper } from '../helpers/AsteroidHelper'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { useProgressHook } from '../hooks/useProgressHook'
import { RootStore } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Storage } from '~src/app/Storage'
import { applicationConfig } from '~src/config/ApplicationConfig'
import { useBlockchainActionsHook } from '~src/hooks/useBlockchainActionsHook'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ImageView, LinearGradientLayout, LinearLayout, TextView } from '~src/styles/styled-components'

interface OnboardingSlideProps {
  header: string
  subtitle: string
  image: ImageSourcePropType
  resizeMode?: ImageResizeMode
}

interface OnboardingPageProps {
  navigation: StackNavigationProp<RootStackParamList>
}

const OnboardingSlide = (props: OnboardingSlideProps) => {
  return (
    <LinearLayout orientation="verti" height="100%" width="100%">
      <LinearLayout orientation="verti" height="100%" width="100%">
        <ImageView style={{ width: '100%', height: '85%' }} resizeMode="stretch" source={props.image} />
        <LinearLayout pl="3%">
          <TextView fontSize="md" color="#4CFFB3">
            {props.header}
          </TextView>
          <TextView fontSize="md" color="#fff">
            {props.subtitle}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const OnboardingPage = (props: OnboardingPageProps) => {
  const carousel = useRef<Carousel<any>>(null)
  const blockchainActionsHook = useBlockchainActionsHook()
  const { currentProgress, increment } = useProgressHook()
  const [progressMessage, setProgressMessage] = useState<string>(i18n.t('onboarding.progressMessageStep1'))
  const dispatch = useDispatch()
  const finish = async () => {
    await Storage.onboardingSeen.save(true)
    dispatch(RootStore.settings.actions.setIsFirstTime(true))
    props.navigation.replace(wrapper.route.SetupCompletePage.name, {})
  }

  const step1 = () => {
    return UtilsHelper.sleep(2000)
  }

  const step2 = async () => {
    await UtilsHelper.sleep(1500)
    const words = AsteroidHelper.generateMnemonic() ?? []
    return blockchainActionsHook.createWallet(i18n.t('onboarding.firstWalletName'), words.join(' '), 'standard')
  }

  const step3 = async (walletId: string) => {
    await UtilsHelper.sleep(1500)
    return blockchainActionsHook.createAccount(
      walletId,
      i18n.t('modals.blockchainList.countAccount', {
        count: 1,
      }),
      'neo3', //by requirements create just account neo 3,
      undefined,
      true
    )
  }

  const step4 = () => {
    return UtilsHelper.sleep(2000)
  }

  const handleInitialSetup = useCallback(() => {
    const stepsToComplete = 4
    const progressByStep = 1 / stepsToComplete
    step1().then(() => {
      carousel.current?.snapToNext()
      increment(progressByStep)
      setProgressMessage(i18n.t('onboarding.progressMessageStep2'))
      step2().then(walletID => {
        carousel.current?.snapToNext()
        increment(progressByStep)
        setProgressMessage(i18n.t('onboarding.progressMessageStep3'))
        step3(walletID).then(() => {
          carousel.current?.snapToNext()
          increment(progressByStep)
          setProgressMessage(i18n.t('onboarding.progressMessageStep4'))
          step4().then(() => {
            carousel.current?.snapToNext()
            increment(progressByStep)
          })
        })
      })
    })
  }, [increment, currentProgress])

  const data = [
    {
      header: i18n.t('onboarding.feature1.header'),
      image: require('~src/assets/images/onboarding-1.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature1.subtitle'),
      resizeMode: 'contain' as ImageResizeMode,
    },
    {
      header: i18n.t('onboarding.feature2.header'),
      image: require('~src/assets/images/onboarding-2.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature2.subtitle'),
      resizeMode: 'cover' as ImageResizeMode,
    },
    {
      header: i18n.t('onboarding.feature3.header'),
      image: require('~src/assets/images/onboarding-3.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature3.subtitle'),
      resizeMode: 'contain' as ImageResizeMode,
    },
    {
      header: i18n.t('onboarding.feature4.header'),
      image: require('~src/assets/images/onboarding-4.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature4.subtitle'),
      resizeMode: 'contain' as ImageResizeMode,
    },
  ]

  useEffect(() => {
    handleInitialSetup()
  }, [])

  return (
    <LinearLayout flex={1} bg="background.14">
      <SafeAreaView>
        <ImageBackground
          source={require('~src/assets/images/onboarding-background.png')}
          imageStyle={{ transform: [{ rotate: '180deg' }] }}
          style={{ height: '92%' }}
          resizeMode="cover"
        >
          <LinearGradientLayout
            colors={['#000', 'rgba(0,0,0,0.0)']}
            height="100%"
            width="100%"
            start={[0, 0.8]}
            end={[0.2, 0.3]}
          >
            <LinearGradientLayout
              colors={['transparent', '#000000fa']}
              height="100%"
              start={[0.3, 0.7]}
              end={[0.5, 0.2]}
            >
              <LinearLayout height="100%">
                <LinearLayout pl="3%" pt="3%" orientation="verti" width="100%">
                  <TextView fontSize="sm" color="#4CFFB3">
                    {i18n.t('onboarding.initalSetup')}
                  </TextView>
                  <TextView fontSize="3xl" color="#fff">
                    {i18n.t('onboarding.welcomeNW')}
                  </TextView>
                  <LinearLayout width="85%">
                    <TextView fontSize="sm" color="#fff">
                      {i18n.t('onboarding.creatingWallet')}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>

                <Carousel
                  scrollEnabled={false}
                  layout="default"
                  ref={carousel}
                  data={data}
                  sliderWidth={applicationConfig.windowWidth}
                  itemWidth={applicationConfig.windowWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={0}
                  inactiveSlideShift={25}
                  lockScrollWhileSnapping
                  lockScrollTimeoutDuration={1000}
                  activeSlideOffset={5}
                  swipeThreshold={5}
                  enableSnap
                  useScrollView
                  firstItem={0}
                  renderItem={(imageList: {
                    item: {
                      header: string
                      image: ImageSourcePropType
                      subtitle: string
                      resizeMode: ImageResizeMode
                    }
                    index: number
                  }) => {
                    const { item, index } = imageList
                    return (
                      <LinearLayout weight={1} py="5%">
                        {index < data.length - 1 ? (
                          <OnboardingSlide subtitle={item.subtitle} header={item.header} image={item.image} />
                        ) : (
                          <OnboardingSlide subtitle={item.subtitle} header={item.header} image={item.image} />
                        )}
                      </LinearLayout>
                    )
                  }}
                />
              </LinearLayout>
            </LinearGradientLayout>
          </LinearGradientLayout>
        </ImageBackground>
        <LinearLayout mt="5%">
          <ProgressBar progressBarStatus={currentProgress} onFinish={finish} show text={progressMessage} />
        </LinearLayout>
      </SafeAreaView>
    </LinearLayout>
  )
}

export default OnboardingPage
