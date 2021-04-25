import { Series } from '@/types'

export const createSeries = (arr: any[]): Series => {
  const handler = {
    get: function (obj: any, prop: any, receiver: any) {
      if (prop === 'current') {
        return obj[0]
      }

      return Reflect.get(obj, prop, receiver)
    }
  }

  return new Proxy(arr, handler)
}
