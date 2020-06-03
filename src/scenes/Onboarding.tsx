import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {LinearGradient} from 'expo-linear-gradient'
import styled from 'styled-components/native'
import {StackNavigationProp} from '@react-navigation/stack'

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
        colors={['#495158', '#293036']}
        start={[0.1, 0.1]}
        end={[1, 1]}
      >
        <Swiper
          dotColor="#767f86"
          activeDotColor="#4cffb3"
          loop={false}
          showsButtons
          buttonWrapperStyle={styles.swiperButtonWrapperStyle}
          prevButton={<View/>}
          nextButton={<SwiperButton>next</SwiperButton>}
        >
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>Feature 1</FeatureHeader>
            <View style={{
              height: '60%',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.53,
              shadowRadius: 13.97,
              elevation: 21,
            }}>
              <OnboardingImage source={require('~src/image/onboarding-placeholder.png')} />
            </View>
            <FeatureHeader marginTop={'10%'}>This is a killer feature</FeatureHeader>
            <FeatureDescription marginHorizontal={'5%'}>
              Laudem et dolore disputandum putant sed ut de utilitatibus, nihil oportere exquisitis rationibus.
            </FeatureDescription>
          </OnboardingContainer>
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>Feature 2</FeatureHeader>
            <OnboardingImageContainer>
              <OnboardingImage source={require('~src/image/onboarding-placeholder.png')} />
            </OnboardingImageContainer>
            <FeatureHeader marginTop={'10%'}>This is a killer feature</FeatureHeader>
            <FeatureDescription marginHorizontal={'5%'}>
              Laudem et dolore disputandum putant sed ut de utilitatibus, nihil oportere exquisitis rationibus.
            </FeatureDescription>
          </OnboardingContainer>
          <OnboardingContainer>
            <FeatureHeader marginTop={'12.5%'}>Time to get started!</FeatureHeader>
            <OnboardingImageContainer>
              <OnboardingImage source={require('~src/image/onboarding-placeholder.png')} />
            </OnboardingImageContainer>
            <GetStartedButton onPress={() => props.navigation.navigate('MainTab')}>
              <Text>Get started!</Text>
            </GetStartedButton>
          </OnboardingContainer>
        </Swiper>
        <SkipButton onPress={() => props.navigation.navigate('MainTab')}>skip</SkipButton>
      </LinearGradient>
    </OnboardingContainer>
  )
}

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
  box-shadow: 100px 50px 50px red;
`

const FeatureHeader = styled.Text<{marginTop: string}>`
  color: #fff;
  font-weight: 700;
  font-size: 20px;
  margin-top: ${props => props.marginTop};
`

const FeatureDescription = styled.Text<{marginHorizontal: string}>`
  color: #fff;
  font-size: 12px;
  text-align: center;
  letter-spacing: 1.28px;
  margin-top: 12px;
  margin-right: ${props => props.marginHorizontal};
  margin-left: ${props => props.marginHorizontal};
`

const GetStartedButton = styled.TouchableHighlight`
  margin-top: auto;
  margin-bottom: auto;
  width: 80%;
  height: 42px;
  border-radius: 9999px;
  background-color: #4cffb3;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SwiperButton = styled.Text`
  color: #78ffb3;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1.71px;
`

const SkipButton = styled.Text`
  color: #9ba0a1;
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
    alignItems: 'flex-end'
  }
})

export default Onboarding
