import {Config, system} from 'styled-system'

const directionConfig = {
  direction: {
    property: 'display',
    defaultScale: ['horiz', 'verti'],
    transform: (val: string) => {
      return `
        flex;
        flex-direction: ${val === 'horiz' ? 'row' : 'column'}
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

export const direction = system(directionConfig)
export interface DirectionProps {
  direction?: 'horiz' | 'verti'
}

export const weight = system(weightConfig)
export interface WeightProps {
  weight?: number
}
