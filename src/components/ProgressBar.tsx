import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Dimensions, Platform, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'
import { useSelector } from 'react-redux'

import { UtilsHelper } from '../helpers/UtilsHelper'
import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { LinearLayout, TextView } from '~src/styles/styled-components'
interface IProgressBar {
  show: boolean
  text: string
  onFinish?: () => void
  progressBarStatus: number
}

export const ProgressBar: React.FC<IProgressBar> = props => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  useEffect(() => {
    if (props.onFinish && props.progressBarStatus >= 1) {
      UtilsHelper.sleep(800).then(props.onFinish)
    }
  }, [props.progressBarStatus])

  return props.show ? (
    <LinearLayout bg="background.14" alignItems="center" width="100%" justifyContent="space-between">
      <Progress.Bar
        style={styles[Platform.OS]}
        progress={props.progressBarStatus}
        width={Dimensions.get('window').width * 0.8}
        height={8}
        color={theme.colors.primary}
        borderColor="transparent"
      />
      <TextView color="#fff" textAlign="center" fontSize="18px">
        {props.text}
      </TextView>
    </LinearLayout>
  ) : (
    <></>
  )
}

const styles = StyleSheet.create({
  ios: {
    borderTopWidth: 0.5,
    borderTopColor: '#000',
    borderLeftWidth: 0.5,
    borderRadius: 50,
    backgroundColor: '#00000099',
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    borderRightWidth: 0.5,
  },
  android: {
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#ffffffaa',
  },
  web: {},
  macos: {},
  windows: {},
})
