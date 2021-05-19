import BarState from '@/core/BarState'
import { Series } from '@/types'
import { is } from 'ramda'

export const createSeries = <T>(arr: T[], barState: BarState): Series<T> => {
  const source: any = [...arr]

  const handler = {
    get: function (obj: any, prop: any) {
      if (prop === 'current') {
        return obj[barState.index]
      }

      if (prop === 'barsSince') {
        return (cb: any) => {
          for (let i = barState.index; i >= 0; i--) {
            if (cb(obj[i])) {
              return barState.index - i
            }
          }
          return -1
        }
      }

      if (!isNaN(parseInt(prop))) {
        const idx = barState.index - parseInt(prop)
        return obj[idx]
      }

      return Reflect.get(obj, prop)
    },
    set: function (obj: any, prop: any, value: any) {
      if (prop === 'current' || barState.index === parseInt(prop)) {
        obj[barState.index] = value
        return true
      }

      if (prop === 'default') {
        obj.fill(value)
        return true
      }

      return false
    }
  }

  return new Proxy(source, handler)
}
