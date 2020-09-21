import React from 'react'
import {Keyboard, TouchableWithoutFeedback} from 'react-native'

export const DismissKeyboard: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
