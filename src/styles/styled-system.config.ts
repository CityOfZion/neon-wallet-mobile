import {system} from 'styled-system'

import {Facade} from '~src/app/Facade'

export const orientation = system({
  orientation: Facade.config.style.orientation,
})
export const weight = system({weight: Facade.config.style.weight})
