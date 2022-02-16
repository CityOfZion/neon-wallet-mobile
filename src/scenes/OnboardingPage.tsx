import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useEffect, useState, useRef} from 'react'
import {ImageLoadEventData, SafeAreaView, StyleSheet, View} from 'react-native'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import {useDispatch, useSelector} from 'react-redux'

import {useHeaderHeight} from '~/node_modules/@react-navigation/stack'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import {Storage} from '~src/app/Storage'
import {applicationConfig} from '~src/config/ApplicationConfig'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'
import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface OnboardingSlideProps {
  header: string
  image: ImageLoadEventData
  bottomContent: any
}

interface OnboardingPageProps {
  navigation: StackNavigationProp<RootStackParamList>
}

const OnboardingSlide = (props: OnboardingSlideProps) => {
  return (
    <LinearLayout orientation={'verti'} height={'100%'}>
      <RelativeLayout weight={3} mt={100}>
        <ImageView
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
          source={props.image}
        />
      </RelativeLayout>

      <LinearLayout justifyContent={'center'} weight={2} mb={50}>
        <LinearLayout width={'100%'} mb={20} alignItems={'center'}>
          {props.bottomContent}
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const FeatureText = (props: {title: string; subtitle: string}) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const headerHeight = useHeaderHeight()
  const unit = headerHeight * 0.015

  return (
    <LinearLayout orientation={'verti'} mx={'7%'}>
      <TextView
        color={theme.colors.text[0]}
        fontFamily={'semibold'}
        fontSize={'22px'}
        textAlign={'center'}
      >
        {props.title}
      </TextView>

      <FeatureDescription
        mt={'2%'}
        color={theme.colors.text[4]}
        style={{lineHeight: 24}}
      >
        {props.subtitle}
      </FeatureDescription>
    </LinearLayout>
  )
}

const FeatureDescription = styled(TextView)`
  font-size: 20px;
  text-align: center;
  font-family: light;
`

const OnboardingPage = (props: OnboardingPageProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const carousel = useRef<Carousel<any>>(null)
  const [isLastPage, setIsLastPage] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const {wallets} = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const finish = async () => {
    await Storage.onboardingSeen.save(true)

    props.navigation.replace(wrapper.route.Login.name)
  }

  useEffect(() => {
    dispatch(RootStore.timer.actions.setTimerOff())
    if (wallets.length === 0) {
      dispatchAsync(RootStore.app.actions.createInitialWallet())
    }
  }, [])

  useEffect(() => {
    if (carouselIndex === 3) setIsLastPage(true)
    else setIsLastPage(false)
  }, [carouselIndex])

  const data = [
    {
      header: 'onboarding.feature1.header',
      image: require('~src/assets/images/onboarding-1.png'),
      title: 'onboarding.feature1.title',
      subtitle: 'onboarding.feature1.subtitle',
    },
    {
      header: 'onboarding.feature2.header',
      image: require('~src/assets/images/onboarding-2.png'),
      title: 'onboarding.feature2.title',
      subtitle: 'onboarding.feature2.subtitle',
    },
    {
      header: 'onboarding.feature3.header',
      image: require('~src/assets/images/onboarding-3.png'),
      title: 'onboarding.feature3.title',
      subtitle: 'onboarding.feature3.subtitle',
    },
    {
      header: 'onboarding.feature4.header',
      image: require('~src/assets/images/onboarding-4.png'),
      title: 'onboarding.feature4.title',
      subtitle: 'onboarding.feature4.subtitle',
    },
  ]

  return (
    <LinearLayout flex={1} bg={'background.14'}>
      <SafeAreaView>
        <LinearLayout
          orientation={'verti'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
          bg={'background.14'}
        >
          <Carousel
            layout={'default'}
            ref={carousel}
            data={data}
            sliderWidth={applicationConfig.windowWidth}
            itemWidth={applicationConfig.windowWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0}
            inactiveSlideShift={25}
            lockScrollWhileSnapping={true}
            lockScrollTimeoutDuration={1000}
            activeSlideOffset={5}
            swipeThreshold={5}
            enableSnap={true}
            useScrollView={true}
            firstItem={0}
            onSnapToItem={(index) => setCarouselIndex(index)}
            renderItem={(imageList: {
              item: {
                header: string
                image: ImageLoadEventData
                title: string
                subtitle: string
              }
              index: number
            }) => {
              const {item, index} = imageList
              return (
                <LinearLayout
                  weight={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  py={6}
                >
                  {index < data.length - 1 ? (
                    <OnboardingSlide
                      header={item.header}
                      image={item.image}
                      bottomContent={
                        <FeatureText
                          title={i18n.t(item.title)}
                          subtitle={i18n.t(item.subtitle)}
                        />
                      }
                    />
                  ) : (
                    <OnboardingSlide
                      header={item.header}
                      image={item.image}
                      bottomContent={
                        <LinearLayout
                          width={'100%'}
                          mt={'15%'}
                          alignItems={'center'}
                        >
                          <LinearLayout mb={'8%'}>
                            <FeatureText
                              title={i18n.t(item.title)}
                              subtitle={i18n.t(item.subtitle)}
                            />
                          </LinearLayout>

                          <LinearLayout width={'100%'} px={'7%'}>
                            <ThemedButton
                              onPress={() => finish()}
                              label={i18n.t(
                                'onboarding.getStarted.buttonTitle'
                              )}
                              basic={true}
                              bgColor={'primary'}
                              textColor={'black'}
                            />
                          </LinearLayout>
                        </LinearLayout>
                      }
                    />
                  )}
                </LinearLayout>
              )
            }}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={carouselIndex}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            }}
            inactiveDotStyle={{
              backgroundColor: theme.colors.text[3],
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1}
          />
          {!isLastPage && (
            <>
              <NextButton
                mb={Normalize.scale(30)}
                color={'primary'}
                onPress={() => carousel.current?.snapToNext()}
                position={'absolute'}
                right={0}
                bottom={0}
                mr={Normalize.scale(30)}
              >
                next
              </NextButton>
              <SkipButton
                position={'absolute'}
                left={0}
                bottom={0}
                color={'text.0'}
                opacity={0.5}
                mb={Normalize.scale(30)}
                ml={Normalize.scale(30)}
                onPress={() => finish()}
                style={{textTransform: 'lowercase'}}
              >
                {i18n.t('app.skip')}
              </SkipButton>
            </>
          )}
        </LinearLayout>
      </SafeAreaView>
    </LinearLayout>
  )
}

const NextButton = styled(TextView)`
  font-size: 16px;
  font-family: 'medium';
  letter-spacing: 1.71px;
`

const SkipButton = styled(TextView)`
  font-size: 16px;
  font-family: 'medium';
  letter-spacing: 1.71px;
`

const styles = StyleSheet.create({
  swiperButtonWrapperStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: '2.5%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
})

export default OnboardingPage
