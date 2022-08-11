import { BlurView } from 'expo-blur'
import React from 'react'
import { Modal } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'
import { ButtonWithoutFeedbackView, LinearLayout } from '../styles/styled-components'

type Props = {
  visible: boolean
  onRequestClose?: () => void
  children?: React.ReactNode
}

export const AlertBox = ({ onRequestClose, visible, children }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <ButtonWithoutFeedbackView onPress={onRequestClose}>
        <BlurView
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          intensity={100}
          tint="dark"
        >
          <ButtonWithoutFeedbackView width="100%">
            <LinearLayout backgroundColor={`${theme.colors.black}B3`} borderRadius="14px" maxWidth="75%">
              {children}
            </LinearLayout>
          </ButtonWithoutFeedbackView>
        </BlurView>
      </ButtonWithoutFeedbackView>
    </Modal>
  )
}
