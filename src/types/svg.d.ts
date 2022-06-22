import React from 'react'

// https://medium.com/@HassanYousefi/how-to-use-svg-with-dynamic-colors-in-react-native-171a94e8a8e2

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<
    SvgProps & {
      fillSecondary?: string
    }
  >
  export default content
}
