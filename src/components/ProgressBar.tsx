import {BlurView} from 'expo-blur'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useCallback} from 'react'
import {Dimensions} from 'react-native'
import * as Progress from 'react-native-progress'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {LinearLayout, TextView} from '~src/styles/styled-components'
interface IProgressBar {
  show: boolean
  timeToComplete: number
  text: string
  onFinish: () => void
}

export const ProgressBar: React.FC<IProgressBar> = (props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const [progressBarStatus, setProgressBarStatus] = useState<number>(0)
  useEffect(() => {
    if (props.show) {
      const secondsToComplete = props.timeToComplete
      const progressTime = 1 / secondsToComplete
      const timer = setInterval(() => {
        if (!(progressBarStatus >= 1)) {
          setProgressBarStatus((prevState) => {
            if (prevState + progressTime >= 1) {
              return 1
            } else {
              return prevState + progressTime
            }
          })
        }
      }, 1000)
      return () => {
        clearInterval(timer)
        setProgressBarStatus(0)
      }
    }
  }, [props.timeToComplete, props.show])

  useEffect(() => {
    if (progressBarStatus >= 1) {
      props.onFinish()
    }
  }, [progressBarStatus])

  return props.show ? (
    <BlurView
      intensity={100}
      tint="dark"
      style={{
        height: '100%',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LinearLayout
        alignItems={'center'}
        height={'90px'}
        justifyContent={'space-between'}
      >
        <TextView color={'#fff'} textAlign={'center'} fontSize={'18px'}>
          {props.text}
        </TextView>
        <Progress.Bar
          style={{
            borderRadius: 50,
            backgroundColor: '#00000099',
            borderBottomWidth: 0.5,
            borderBottomColor: '#fff',
            borderRightWidth: 0.5,
            borderRightColor: '#fff',
          }}
          progress={progressBarStatus}
          width={Dimensions.get('window').width * 0.8}
          height={10}
          color={theme.colors.primary}
          borderColor={'transparent'}
        />
      </LinearLayout>
    </BlurView>
  ) : (
    <></>
  )
}

ProgressBar.propTypes = {
  show: PropTypes.any.isRequired,
  timeToComplete: PropTypes.any.isRequired,
  onFinish: PropTypes.any.isRequired,
  text: PropTypes.any.isRequired,
}
