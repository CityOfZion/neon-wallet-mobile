import {useAsyncStorage} from '@react-native-community/async-storage'
import {useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {ImageLoadEventData, SafeAreaView, StyleSheet, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {useSelector} from 'react-redux'

import {$} from '~/facade'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {RootState} from '~src/store/reducers/root'
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
  const headerHeight = useHeaderHeight()
  const unit = headerHeight * 0.015

  const FeatureDescription = styled(TextView)`
    font-size: 15px;
    text-align: center;
    letter-spacing: 1.28px;
    font-family: regular;
  `

  return (
    <LinearLayout orientation={'verti'} mx={'7%'}>
      <TextView
        color={'text.0'}
        fontFamily={'semibold'}
        fontSize={'20px'}
        textAlign={'center'}
      >
        {props.title}
      </TextView>

      <FeatureDescription
        mt={'2%'}
        color={'text.4'}
        style={{lineHeight: 18 * unit}}
      >
        {props.subtitle}
      </FeatureDescription>
    </LinearLayout>
  )
}

const OnboardingPage = (props: {
  seenSetter: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const {setItem} = useAsyncStorage('@onboardingSeen')

  const setAsSeen = () => {
    setItem('true')
    props.seenSetter(true)
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <SafeAreaView>
        <LinearLayout
          orientation={'verti'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
        >
          <Swiper
            dotColor={theme.colors.text[3]}
            activeDotColor={theme.colors.primary}
            loop={false}
            showsButtons
            buttonWrapperStyle={styles.swiperButtonWrapperStyle}
            prevButton={<View />}
            nextButton={<NextButton color={'primary'}>next</NextButton>}
          >
            <OnboardingSlide
              header={'Feature 1'}
              image={require('~src/assets/images/onboarding-1.png')}
              bottomContent={
                <FeatureText
                  title={$.t('onboarding.feature1.title')}
                  subtitle={$.t('onboarding.feature1.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Feature 2'}
              image={require('~src/assets/images/onboarding-2.png')}
              bottomContent={
                <FeatureText
                  title={$.t('onboarding.feature2.title')}
                  subtitle={$.t('onboarding.feature2.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Feature 3'}
              image={require('~src/assets/images/onboarding-3.png')}
              bottomContent={
                <FeatureText
                  title={$.t('onboarding.feature3.title')}
                  subtitle={$.t('onboarding.feature3.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Time to get started!'}
              image={require('~src/assets/images/onboarding-4.png')}
              bottomContent={
                <LinearLayout width={'100%'} alignItems={'center'}>
                  <LinearLayout mb={'8%'}>
                    <FeatureText
                      title={$.t('onboarding.feature4.title')}
                      subtitle={$.t('onboarding.feature4.subtitle')}
                    />
                  </LinearLayout>

                  <LinearLayout width={'100%'} px={'7%'}>
                    <ThemedButton
                      onPress={() => setAsSeen()}
                      label={$.t('onboarding.getStarted.buttonTitle')}
                      basic={true}
                      bgColor={'primary'}
                      textColor={'black'}
                    />
                  </LinearLayout>
                </LinearLayout>
              }
            />
          </Swiper>

          <SkipButton
            position={'absolute'}
            left={0}
            color={'text.0'}
            opacity={0.5}
            bottom={0}
            mb={'3.5%'}
            ml={30}
            onPress={() => setAsSeen()}
            style={{textTransform: 'lowercase'}}
          >
            {$.t('app.skip')}
          </SkipButton>
        </LinearLayout>
      </SafeAreaView>
    </LinearGradient>
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
