import {Normalize} from '~src/app/Normalize'

const scale = Normalize.scale

export abstract class ApplicationTheme {
  abstract id: string
  abstract title: string
  abstract statusBarStyle: 'default' | 'light-content' | 'dark-content'
  abstract colors: ColorTheme

  readonly fontSizes = {
    min: scale(10),
    xs: scale(12),
    sm: scale(14),
    md: scale(16),
    lg: scale(18),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(32),
    '4xl': scale(48),
    '5xl': scale(64),
  }

  readonly space = [0, 2, 4, 8, 12, 16, 32, 64, 128, 256, 512].map((it) =>
    scale(it)
  )
}
