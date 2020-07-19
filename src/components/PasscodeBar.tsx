import PropTypes from 'prop-types'
import React from 'react'

import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  data: number[]
  length: number
}

const PasscodeBar = (props: Props) => {
  const elements = []

  for (let i = 1; i <= props.length; i++) {
    elements.push(
      <LinearLayout
        width={14}
        height={14}
        borderRadius="9999px"
        border="2px"
        borderColor="text.0"
        bg={i <= props.data.length ? 'text.0' : undefined}
        ml={i === 1 ? 0 : 12}
        mr={i === props.length ? 0 : 12}
      />
    )
  }
  return (
    <LinearLayout orientation="horiz">
      {elements}
    </LinearLayout>
  )
}

PasscodeBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  length: PropTypes.number,
}

export default PasscodeBar
