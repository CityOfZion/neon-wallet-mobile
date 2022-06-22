import { ApplicationTheme } from '~src/themes/ApplicationTheme'

export declare global {
  type ThemeWrapper = {
    [T: string]: ApplicationTheme
  }
}
