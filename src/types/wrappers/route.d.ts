import { Route } from '~src/app/Route'
import { WrapperConfig } from '~src/config/WrapperConfig'

export type RouteName = WrapperConfig['routes'][number]

export type RouteWrapper = {
  [T in RouteName]: Route<T>
}
