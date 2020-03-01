import { values, mapValues, keys } from 'lodash'
import { RunOptions, RunCallback, DictPrice } from '../types'

class Scheduler {
  every(data: { [key: string]: any }, callback: RunCallback) {
    const ticks = keys(data)
    const first = data[ticks[0]]
    const len = first ? first.length : 0

    for (let i = 0; i < len; i++) {
      const date = new Date(first[i].date)
      callback(i, date, data)
    }
  }

  run({ data, period, startDay = 0, callback }: RunOptions): DictPrice {
    switch (period) {
      case 'everyMonth': {
        const dataByMonth = mapValues(data.byMonth, x => values(mapValues(x, y => y[startDay])))
        this.every(dataByMonth, callback)
        return dataByMonth
      }

      case 'everyDay': {
        const dataByDay = data.byDay
        this.every(dataByDay, callback)
        return dataByDay
      }
    }
  }
}

export default Scheduler
