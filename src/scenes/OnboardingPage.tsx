import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { ImageBackground, ImageResizeMode, ImageSourcePropType, Platform, SafeAreaView } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { useDispatch, useSelector } from 'react-redux'

import { ProgressBar } from '../components/ProgressBar'
import { AsteroidHelper } from '../helpers/AsteroidHelper'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { useProgress } from '../hooks/useProgress'
import { settingsReducerActions } from '../store/settings/SettingsReducer'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Storage } from '~src/app/Storage'
import { applicationConfig } from '~src/config/ApplicationConfig'
import { useBlockchainActions } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ButtonView, ImageView, LinearGradientLayout, LinearLayout, TextView } from '~src/styles/styled-components'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { selectAccounts } from '../store/account/SelectorAccount'

interface OnboardingSlideProps {
  header: string
  subtitle: string
  image: ImageSourcePropType
  resizeMode?: ImageResizeMode
  imgIsBG?: boolean
  heightBG?: string
}

interface OnboardingPageProps {
  navigation: StackNavigationProp<RootStackParamList>
}

const OnboardingSlide = (props: OnboardingSlideProps) => {
  return !props.imgIsBG ? (
    <LinearLayout orientation="verti" height="100%" width="100%">
      <LinearLayout orientation="verti" height="100%" width="100%">
        <ImageView style={{ width: '100%', height: props.heightBG ?? '85%' }} resizeMode="cover" source={props.image} />
        <LinearLayout p="4%">
          <TextView fontSize="md" color="#4CFFB3">
            {props.header}
          </TextView>
          <TextView fontSize="md" color="#fff">
            {props.subtitle}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  ) : (
    <LinearLayout>
      <ImageBackground
        imageStyle={{ width: '100%', height: props.heightBG }}
        resizeMode="cover"
        source={props.image}
        style={{ height: '100%', justifyContent: 'flex-end' }}
      >
        <LinearLayout px={Platform.OS === 'ios' ? "2%" : "5%"}>
          <TextView fontFamily="bold" fontSize="md" color="#4CFFB3">
            {props.header}
          </TextView>
          <TextView fontSize="sm" color="#fff">
            {props.subtitle}
          </TextView>
        </LinearLayout>
      </ImageBackground>
    </LinearLayout>
  )
}

const OnboardingPage = (props: OnboardingPageProps) => {
  const carousel = useRef<Carousel<any>>(null)
  const blockchainActions = useBlockchainActions()
  const { currentProgress, increment } = useProgress()
  const [progressMessage, setProgressMessage] = useState<string>(i18n.t('onboarding.progressMessageStep1'))
  const [currentPage, setCurrentPage] = useState<number>(0)
  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)
  const dispatch = useDispatch()

  const finish = async () => {
    await Storage.onboardingSeen.save(true)
    dispatch(settingsReducerActions.setIsFirstTime(true))
    props.navigation.replace(wrapper.route.SetupCompletePage.name, {})
  }

  const step1 = () => {
    return UtilsHelper.sleep(2000)
  }

  const step2 = async () => {
    await UtilsHelper.sleep(1500)
    if(wallets.length > 0) return
    const words = AsteroidHelper.generateMnemonic() ?? []
    return blockchainActions.createWallet(i18n.t('onboarding.firstWalletName'), words.join(' '), 'standard')
  }

  const step3 = async (walletId?: string) => {
    await UtilsHelper.sleep(1500)
    if(accounts.length > 0 || !walletId) return
    return blockchainActions.createAccount(
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
      increment(progressByStep)
      setProgressMessage(i18n.t('onboarding.progressMessageStep2'))
      step2().then(walletID => {
        increment(progressByStep)
        setProgressMessage(i18n.t('onboarding.progressMessageStep3'))
        step3(walletID).then(() => {
          increment(progressByStep)
          setProgressMessage(i18n.t('onboarding.progressMessageStep4'))
          step4().then(() => {
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
      isBG: true,
      heightBG: '100%',
    },
    {
      header: i18n.t('onboarding.feature2.header'),
      image: require('~src/assets/images/onboarding-2.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature2.subtitle'),
      resizeMode: 'cover' as ImageResizeMode,
      isBG: false,
      heightBG: undefined,
    },
    {
      header: i18n.t('onboarding.feature3.header'),
      image: require('~src/assets/images/onboarding-3.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature3.subtitle'),
      resizeMode: 'contain' as ImageResizeMode,
      isBG: false,
      heightBG: undefined,
    },
    {
      header: i18n.t('onboarding.feature4.header'),
      image: require('~src/assets/images/onboarding-4.png') as ImageSourcePropType,
      subtitle: i18n.t('onboarding.feature4.subtitle'),
      resizeMode: 'contain' as ImageResizeMode,
      isBG: true,
      heightBG: '100%',
    },
  ]

  useEffect(() => {
    handleInitialSetup()
  }, [])

  return (
    <LinearLayout flex={1} bg="background.14">
      <SafeAreaView>
        <LinearLayout mb={Platform.OS === 'ios' ? 0 && currentProgress >= 1 : '12%'}>
          <ImageBackground
            source={require('~src/assets/images/onboarding-background.png')}
            imageStyle={{ transform: [{ rotate: '180deg' }] }}
            style={{ height: '93%' }}
            resizeMode="stretch"
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
                  <LinearLayout p={Platform.OS === 'ios' ? "2%" : "5%"} marginY="5%" orientation="verti" width="100%">
                    <TextView fontFamily="bold" fontSize="sm" color="#4CFFB3">
                      {i18n.t('onboarding.initalSetup')}
                    </TextView>
                    <TextView ml="-2%" mt="-2%" fontSize="30px" color="#fff">
                      {i18n.t('onboarding.welcomeNW')}
                    </TextView>
                    <LinearLayout width="85%">
                      <TextView fontSize="sm" color="#fff">
                        {i18n.t('onboarding.creatingWallet')}
                      </TextView>
                    </LinearLayout>
                  </LinearLayout>

                  <Carousel
                    onSnapToItem={index => setCurrentPage(index)}
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
                        isBG: boolean
                        heightBG?: string
                      }
                      index: number
                    }) => {
                      const { item } = imageList
                      return (
                        <OnboardingSlide
                          heightBG={item.heightBG}
                          imgIsBG={item.isBG}
                          subtitle={item.subtitle}
                          header={item.header}
                          image={item.image}
                        />
                      )
                    }}
                  />
                  <Pagination
                    activeDotIndex={currentPage}
                    dotsLength={data.length}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', width: '10%', alignSelf: 'center' }}
                    dotStyle={{
                      width: 6,
                      height: 6,
                      borderRadius: 5,
                      marginHorizontal: 8,
                      backgroundColor: '#4cffb3',
                    }}
                    inactiveDotStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />
                </LinearLayout>
              </LinearGradientLayout>
            </LinearGradientLayout>
          </ImageBackground>
          <LinearLayout mt={currentProgress >= 1 ? "2%" : "6%"}>
            <ProgressBar progressBarStatus={currentProgress} show={currentProgress < 1} text={progressMessage} />
            {currentProgress >= 1 && (
              <ButtonView
                onPress={finish}
                border={1}
                borderColor="primary"
                borderRadius={7}
                width="90%"
                alignSelf="center"
              >
                <TextView fontSize="19px" py="3%" color="primary" textAlign="center">
                  Continue
                </TextView>
              </ButtonView>
            )}
          </LinearLayout>
        </LinearLayout>
      </SafeAreaView>
    </LinearLayout>
  )
}

export default OnboardingPage
