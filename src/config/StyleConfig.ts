import { ConfigStyle } from 'styled-system'

/**
 * Style Configuration
 */
export class StyleConfig {
  readonly orientation: ConfigStyle = {
    property: 'display',
    defaultScale: ['horiz', 'verti'],
    transform: (val: string) => {
      return `
          flex;
          flex-direction: ${val === 'horiz' ? 'row' : 'column'};
          > * {
            flex-shrink: 0;
          }
        `
    },
  }

  readonly weight: ConfigStyle = {
    property: 'flexGrow',
    transform: (val?: number) => {
      if (val) {
        return `
          ${val};
          flex-basis: 0;
          flex-shrink: 1;
        `
      }
    },
  }
}

export const styleConfig = new StyleConfig()
