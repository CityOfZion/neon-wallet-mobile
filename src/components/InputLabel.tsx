import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { TextView } from '~src/styles/styled-components'

const InputLabel = (props: {
  title: string
  textAlignVertical?: string
  weight?: number
  marginBottom?: number | string
  marginTop?: number | string
  color?: string
  capitalize?: boolean
  lightText?: boolean
}) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const marginBottom = props.marginBottom ?? 0
  const marginTop = props.marginTop ?? 1

  return (
    <TextView
      fontSize={14}
      fontFamily={props.lightText ? 'medium' : 'bold'}
      color={props.color ?? theme.colors.background[3]}
      weight={props.weight ?? undefined}
      mb={marginBottom}
      mt={marginTop}
      alignItems="center"
    >
      {props.capitalize ? props.title.toUpperCase() : props.title}
    </TextView>
  )
}

export default InputLabel
