import * as z from 'zebras'
import * as moment from 'moment'
import axios from 'axios'
import { mapValues, pick, keys } from 'lodash'
import { DictPrice, DictPriceMonth, Price } from '../types'

class Data {
  apiUrl = 'https://financialmodelingprep.com/api/v3/historical-price-full/'
  raw: DictPrice = {}

  constructor(raw?: DictPrice) {
    if (raw) {
      this.raw = raw
    }
  }

  async fetch(ticks: string[], date: string = '2020-01-01'): Promise<DictPrice> {
    const result: { [key: string]: Array<any> } = {}

    for (const tick of ticks) {
      const data = (await axios.get(this.apiUrl + tick + '?from=' + date)).data
      result[tick] = data.historical
    }

    this.raw = mapValues(result, v => v.map(p => pick(p, ['date', 'open', 'high', 'low', 'close'])))
    return this.raw
  }

  get byDay(): DictPrice {
    return this.raw
  }

  get byMonth(): DictPriceMonth {
    return mapValues(this.raw, arr =>
      z.groupBy((x: Price) => moment(x.date).format('MMM/YYYY'), arr)
    )
  }

  get ticks(): string[] {
    return keys(this.raw)
  }

  get first(): Price[] {
    return this.raw[this.ticks[0]]
  }
}

export default Data
