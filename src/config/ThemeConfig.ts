import {Normalize} from '~src/app/Normalize'

const space = Normalize.space

/**
 * Theme Configuration
 */
export class ThemeConfig {
  readonly fontSizes = {
    min: space(10),
    xs: space(12),
    sm: space(14),
    md: space(16),
    lg: space(18),
    xl: space(20),
    '2xl': space(24),
    '3xl': space(32),
    '4xl': space(48),
    '5xl': space(64),
  }

  readonly space = [0, 2, 4, 8, 12, 16, 32, 64, 128, 256, 512].map((it) =>
    space(it)
  )
}
