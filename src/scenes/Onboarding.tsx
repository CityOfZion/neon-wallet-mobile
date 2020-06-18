import {StackNavigationProp} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {useSelector} from 'react-redux'

import {TABS} from '~/constants'
import {RootState} from '~src/store/reducers/root'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

type TabStackParamList = {
  MainTab: undefined
  Onboarding: undefined
}

interface OnboardingSlideProps {
  header: string
  image: string
  bottomContent: any
}

const OnboardingSlide = (props: OnboardingSlideProps) => {
  const SlideImage = styled(LinearLayout)`
    shadow-offset: { width: 0, height: 6 };
    shadow-opacity: 0.39;
    shadow-radius: 8.3px;
    elevation: 13;
  `

  return (
    <LinearLayout height={'100%'} alignItems={'center'}>
      <TextView
        mt={'12.5%'}
        color={'text.0'}
        fontFamily={'bold'}
        fontSize={'20px'}
        style={styles.shadows}
      >
        {props.header}
      </TextView>
      <SlideImage height={'60%'} position={'relative'}>
        <ImageView
          height={'100%'}
          mt={'16px'}
          resizeMode="contain"
          source={props.image}
        />
      </SlideImage>

      {props.bottomContent}
    </LinearLayout>
  )
}

const FeatureText = (props: {title: string; subtitle: string}) => {
  const FeatureDescription = styled(TextView)`
    font-size: 12px;
    text-align: center;
    letter-spacing: 1.28px;
    line-height: 16px;
  `

  return (
    <LinearLayout orientation={'verti'} mt={'10%'}>
      <TextView
        color={'text.0'}
        fontFamily={'semibold'}
        fontSize={'20px'}
        textAlign={'center'}
      >
        {props.title}
      </TextView>
      <FeatureDescription mt={'12px'} mx={'5%'} color={'text.0'}>
        {props.subtitle}
      </FeatureDescription>
    </LinearLayout>
  )
}

const GetStartedButton = (props: {onPressFunc: () => void}) => {
  return (
    <ButtonView
      my={'auto'}
      width={'80%'}
      height={'42px'}
      bg={'primary'}
      orientation={'horiz'}
      alignItems={'center'}
      justifyContent={'center'}
      borderRadius={9999}
      onPress={props.onPressFunc}
    >
      <Text>Get started!</Text>
    </ButtonView>
  )
}

const Onboarding = (props: {
  navigation: StackNavigationProp<TabStackParamList>
}) => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const lorem =
    'Laudem et dolore disputandum putant sed ut de utilitatibus, nihil oportere exquisitis rationibus.'

  return (
    <LinearLayout height={'100%'} alignItems={'center'}>
      <LinearGradient
        style={{flex: 1}}
        colors={[theme.colors.background[0], theme.colors.background[2]]}
        end={[1, 0.75]}
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
            image={require('~src/assets/images/onboarding-placeholder.png')}
            bottomContent={
              <FeatureText
                title={'This is a killer feature'}
                subtitle={lorem}
              />
            }
          />
          <OnboardingSlide
            header={'Feature 2'}
            image={require('~src/assets/images/onboarding-placeholder.png')}
            bottomContent={
              <FeatureText
                title={'This is another killer feature'}
                subtitle={lorem}
              />
            }
          />
          <OnboardingSlide
            header={'Time to get started!'}
            image={require('~src/assets/images/onboarding-placeholder.png')}
            bottomContent={
              <GetStartedButton
                onPressFunc={() =>
                  props.navigation.navigate(TABS.MAIN_TAB.name)
                }
              />
            }
          />
        </Swiper>
        <SkipButton
          position={'absolute'}
          color={'text.0'}
          opacity={0.5}
          bottom={0}
          pb={'20px'}
          pl={'30px'}
          onPress={() => props.navigation.navigate(TABS.MAIN_TAB.name)}
        >
          skip
        </SkipButton>
      </LinearGradient>
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

export default Onboarding
