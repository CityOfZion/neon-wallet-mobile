import React from 'react'
import {useSelector} from 'react-redux'
import {textColor} from 'styled-system'

import i18n from '~src/i18n'
import {RootState} from '~src/store/reducers/root'
import {TextView} from '~src/styles/styled-components'

const InputLabel = (props: {
  title: string
  textAlignVertical?: string
  weight?: number
  marginBottom?: number
  marginTop?: number
}) => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const marginBottom = props.marginBottom ? props.marginBottom : 0
  const marginTop = props.marginTop ? props.marginTop : 1
  if (props.weight) {
    return (
      <TextView
        fontSize={14}
        fontFamily="medium"
        color={theme.colors.background[3]}
        weight={props.weight}
        mb={marginBottom}
        mt={marginTop}
        style={{
          textAlignVertical: props.textAlignVertical
            ? props.textAlignVertical
            : 'center',
        }}
      >
        {props.title}
      </TextView>
    )
  } else {
    return (
      <TextView
        fontSize={14}
        fontFamily="medium"
        color={theme.colors.background[3]}
        mb={marginBottom}
        mt={marginTop}
        style={{
          textAlignVertical: props.textAlignVertical
            ? props.textAlignVertical
            : 'center',
        }}
      >
        {props.title}
      </TextView>
    )
  }
}

export default InputLabel
