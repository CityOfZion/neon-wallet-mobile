import {StackNavigationProp} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import styled from 'styled-components/native'

import {TABS} from '~/constants'

type TabStackParamList = {
  MainTab: undefined
  Onboarding: undefined
}

interface Props {
  navigation: StackNavigationProp<TabStackParamList>
}

const Onboarding = (props: Props) => {
  return (
    <OnboardingContainer>
      <LinearGradient
        style={{flex: 1}}
        colors={[colorTroutGray, colorOuterSpaceGray]}
        start={[0.1, 0.1]}
        end={[1, 1]}
      >
        <Swiper
          dotColor={colorRollingStoneGray}
          activeDotColor={colorAquamarineGreen}
          loop={false}
          showsButtons
          buttonWrapperStyle={styles.swiperButtonWrapperStyle}
          prevButton={<View />}
          nextButton={<SwiperButton>next</SwiperButton>}
        >
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>Feature 1</FeatureHeader>
            <OnboardingImageContainer>
              <OnboardingImage
                source={require('~src/assets/images/onboarding-placeholder.png')}
              />
            </OnboardingImageContainer>
            <FeatureHeader marginTop={'10%'}>
              This is a killer feature
            </FeatureHeader>
            <FeatureDescription marginHorizontal={'5%'}>
              Laudem et dolore disputandum putant sed ut de utilitatibus, nihil
              oportere exquisitis rationibus.
            </FeatureDescription>
          </OnboardingContainer>
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>Feature 2</FeatureHeader>
            <OnboardingImageContainer>
              <OnboardingImage
                source={require('~src/assets/images/onboarding-placeholder.png')}
              />
            </OnboardingImageContainer>
            <FeatureHeader marginTop={'10%'}>
              This is a killer feature
            </FeatureHeader>
            <FeatureDescription marginHorizontal={'5%'}>
              Laudem et dolore disputandum putant sed ut de utilitatibus, nihil
              oportere exquisitis rationibus.
            </FeatureDescription>
          </OnboardingContainer>
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>
              Time to get started!
            </FeatureHeader>
            <OnboardingImageContainer>
              <OnboardingImage
                source={require('~src/assets/images/onboarding-placeholder.png')}
              />
            </OnboardingImageContainer>
            <GetStartedButton
              onPress={() => props.navigation.navigate(TABS.MAIN_TAB.name)}
            >
              <Text>Get started!</Text>
            </GetStartedButton>
          </OnboardingContainer>
        </Swiper>
        <SkipButton
          onPress={() => props.navigation.navigate(TABS.MAIN_TAB.name)}
        >
          skip
        </SkipButton>
      </LinearGradient>
    </OnboardingContainer>
  )
}

const colorWhite = '#fff'
const colorEdwardGray = '#9ba0a1'
const colorRollingStoneGray = '#767f86'
const colorTroutGray = '#495158'
const colorOuterSpaceGray = '#293036'
const colorAquamarineGreen = '#4cffb3'
const colorAquamarineGreen2 = '#78ffb3'

const OnboardingContainer = styled.View`
  height: 100%;
  align-items: center;
`

const OnboardingImage = styled.Image`
  margin-top: 16px;
  height: 100%;
  resize-mode: contain;
`

const OnboardingImageContainer = styled.View`
  height: 60%;
`

const FeatureHeader = styled.Text<{marginTop: string}>`
  color: ${(props: any) => props.theme.colors.text};
  font-weight: 700;
  font-size: 20px;
  margin-top: ${(props) => props.marginTop};
`

const FeatureDescription = styled.Text<{marginHorizontal: string}>`
  color: ${colorWhite};
  font-size: 12px;
  text-align: center;
  letter-spacing: 1.28px;
  margin-top: 12px;
  margin-right: ${(props) => props.marginHorizontal};
  margin-left: ${(props) => props.marginHorizontal};
`

const GetStartedButton = styled.TouchableHighlight`
  margin-top: auto;
  margin-bottom: auto;
  width: 80%;
  height: 42px;
  border-radius: 9999px;
  background-color: ${colorAquamarineGreen};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SwiperButton = styled.Text`
  color: ${colorAquamarineGreen2};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1.71px;
`

const SkipButton = styled.Text`
  color: ${colorEdwardGray};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1.71px;
  position: absolute;
  bottom: 0;
  padding-bottom: 20px;
  padding-left: 30px;
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
