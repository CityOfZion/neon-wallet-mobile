import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  onClick?: (number: number) => void
  disabled?: boolean
}

export interface Key {
  number: number
  text?: string
}

const KeyComponent = (props: Props & { keyButton: Key }) => {
  return (
    <TouchableOpacity disabled={props.disabled} onPress={() => props.onClick?.(props.keyButton.number)}>
      <LinearLayout justifyContent="center" alignItems="center" mx="14px" my="8px">
        <LinearLayout
          width="75px"
          height="75px"
          bg="background.11"
          opacity={0.28}
          borderRadius="9999px"
          position="relative"
        />

        <LinearLayout position="absolute">
          <TextView color="text.0" textAlign="center" fontSize="36px">
            {props.keyButton.number}
          </TextView>
          {props.keyButton.text !== undefined ? (
            <TextView mt="-6px" mb="6px" color="text.0" textAlign="center" fontSize="10px" letterSpacing={3}>
              {props.keyButton.text}
            </TextView>
          ) : undefined}
        </LinearLayout>
      </LinearLayout>
    </TouchableOpacity>
  )
}

const KeyRowComponent = (props: Props & { row: Key[] }) => {
  return (
    <LinearLayout width="100%" justifyContent="center" orientation="horiz">
      {props.row.map((key, i) => (
        <KeyComponent {...props} key={i} keyButton={key} />
      ))}
    </LinearLayout>
  )
}

const Keypad = (props: Props) => {
  const keyArray = [
    {
      number: 1,
      text: '',
    },
    {
      number: 2,
      text: 'ABC',
    },
    {
      number: 3,
      text: 'DEF',
    },
    {
      number: 4,
      text: 'GHI',
    },
    {
      number: 5,
      text: 'JLK',
    },
    {
      number: 6,
      text: 'MNO',
    },
    {
      number: 7,
      text: 'PQRS',
    },
    {
      number: 8,
      text: 'TUV',
    },
    {
      number: 9,
      text: 'WXYZ',
    },
    {
      number: 0,
      text: undefined,
    },
  ]
  const keypad = _.chunk(keyArray, 3)

  return (
    <>
      {keypad.map((row, i) => (
        <KeyRowComponent {...props} key={i} row={row} />
      ))}
    </>
  )
}

Keypad.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default Keypad
