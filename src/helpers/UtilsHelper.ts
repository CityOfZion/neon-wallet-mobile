import type { NavigationAction } from '@react-navigation/native'
import * as uuid from 'uuid'

export class UtilsHelper {
  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static uuid() {
    return uuid.v4()
  }

  static validateURL(text: string) {
    const res = text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    return res !== null
  }

  static isBase64(str: string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(str)
  }

  static getLastRouteName(route: NavigationAction | any): string | null {
    if (route?.payload?.routes?.length) {
      const routes = route.payload.routes

      return UtilsHelper.getLastRouteName(routes[routes.length - 1])
    }

    if (route?.state?.routes?.length) {
      const routes = route.state.routes

      return UtilsHelper.getLastRouteName(routes[routes.length - 1])
    }

    return route?.name || null
  }

  static parseJsonSafely(value: any): any {
    if (typeof value !== 'string') return value

    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  static tryCatch<T>(
    callback: () => T
  ): T extends Promise<infer R> ? Promise<[R, undefined] | [undefined, Error]> : [T, undefined] | [undefined, Error] {
    try {
      const result = callback()

      if (result instanceof Promise) {
        return result
          .then(res => [res, undefined] as [typeof res, undefined])
          .catch(err => [undefined, err as Error] as [undefined, Error]) as any
      }

      return [result, undefined] as any
    } catch (error) {
      return [undefined, error as Error] as any
    }
  }
}
