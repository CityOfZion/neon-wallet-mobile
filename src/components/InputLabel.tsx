import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { LinearLayout, TextView } from '~src/styles/styled-components'

const InputLabel = (props: {
  title: string
  description?: string
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
    <LinearLayout
      orientation="horiz"
      weight={props.weight ?? undefined}
      mb={marginBottom}
      mt={marginTop}
      alignItems="center"
    >
      <TextView
        fontSize={14}
        fontFamily={props.lightText ? 'medium' : 'bold'}
        color={props.color ?? theme.colors.background[3]}
      >
        {props.capitalize ? props.title.toUpperCase() : props.title}
      </TextView>

      {props.description && (
        <TextView fontSize={14} fontFamily="medium" color="text.10" ml="6px">
          {props.description}
        </TextView>
      )}
    </LinearLayout>
  )
}

export default InputLabel
