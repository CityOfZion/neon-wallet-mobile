import { BlurView } from 'expo-blur'
import React from 'react'
import { Modal } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'
import { ButtonView, LinearLayout } from '../styles/styled-components'
import { LinearLayoutProps } from '../types/styled-components'

type Props = {
  visible: boolean
  onRequestClose?: () => void
  children?: React.ReactNode
} & LinearLayoutProps

export const AlertBox = ({ onRequestClose, visible, children, ...props }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <ButtonView onPress={onRequestClose} activeOpacity={0}>
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
          <ButtonView activeOpacity={0} maxWidth="75%" {...props}>
            <LinearLayout backgroundColor={`${theme.colors.black}B3`} borderRadius="14px">
              {children}
            </LinearLayout>
          </ButtonView>
        </BlurView>
      </ButtonView>
    </Modal>
  )
}
