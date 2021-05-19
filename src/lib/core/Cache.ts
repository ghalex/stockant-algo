import { Bar, BarSeries, Series } from '@/types'
import { getCol } from '@/utils'
import { createSeries } from '@/utils/series'
import BarState from './BarState'

class Cache {
  private $barState
  private $barSeries: BarSeries
  private $data: Bar[]
  private $seriesCache = new Map<string, any>()

  public globals: any = {}

  constructor(barState: BarState, data: Bar[]) {
    this.$barState = barState
    this.$data = data
    this.$barSeries = this.createBarSeries()
  }

  get barSeries() {
    return this.$barSeries
  }

  private createBarSeries(): BarSeries {
    return {
      open: createSeries(getCol('open', this.$data), this.$barState),
      close: createSeries(getCol('close', this.$data), this.$barState),
      low: createSeries(getCol('low', this.$data), this.$barState),
      high: createSeries(getCol('high', this.$data), this.$barState),
      date: createSeries(getCol('date', this.$data), this.$barState)
    }
  }

  public get series(): { [key: string]: Series<any> } {
    const len = this.$data.length
    const bar = this.$barState

    const handler = {
      get: function (obj: any, prop: any) {
        let res = obj.get(prop)

        if (!res) {
          const arr = new Array(len)

          res = createSeries(arr, bar)
          obj.set(prop, res)
        }

        return res
      }
    }

    return new Proxy(this.$seriesCache, handler)
  }
}

export default Cache
