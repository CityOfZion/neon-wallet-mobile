import { Route } from '~src/app/Route'
import { WrapperConfig } from '~src/config/WrapperConfig'

export declare global {
  type RouteName = WrapperConfig['routes'][number]

  type RouteWrapper = {
    [T in RouteName]: Route<T>
  }
}
