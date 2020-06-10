import {Config, system} from 'styled-system'

const orientationConfig = {
  orientation: {
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
  },
} as Config

const weightConfig = {
  weight: {
    property: 'flexGrow',
    defaultScale: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    transform: (val: number) => {
      return `
        ${val};
        flex-basis: 0;
      `
    },
  },
} as Config

export const orientation = system(orientationConfig)
export interface OrientationProps {
  orientation?: 'horiz' | 'verti'
}

export const weight = system(weightConfig)
export interface WeightProps {
  weight?: number
}
