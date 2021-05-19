// import { Algo, Data } from '../lib'
// import { Strategy } from '../lib/types'
import * as papa from 'papaparse'
import * as r from 'ramda'
import { Backtest } from '../lib'
import { Bar, BacktestConfig, DictSeries } from '../lib/types'

const init = async () => {
  const data = await readCSV('/data/aapl.csv')

  console.log(r.takeLast(10, data))

  const cfg: BacktestConfig = {
    name: 'Time Flow',
    timeWindow: [],
    pyramiding: 0,
    beforeRun: function ({ cache: { series } }) {
      const { long }: DictSeries = series
      long.default = false
    },
    run: function ({ strategy, close, currentBar, cache: { series } }) {
      const { long } = series
      long.current = close.current > 134 && strategy.positionSize === 0

      if (long.current) {
        strategy.order({
          id: 'order_long',
          long: true,
          qty: 10
          // limit: 135
        })
      }

      if (long[3] && strategy.positionSize > 0) {
        strategy.close({
          id: 'order_long',
          qty: 10
        })
        console.log('closing trade')
      }

      if (currentBar.isLast) {
        console.log('close all')
      }
    }
  }

  const backtest = new Backtest(cfg, r.takeLast(10, data))
  const btn = document.getElementById('btnNext')

  backtest.init()

  if (btn) {
    btn.addEventListener('click', () => {
      backtest.nextBar()
    })
  }
}

document.body.onload = async () => {
  init()
}

async function readCSV(url: string): Promise<Bar[]> {
  return new Promise((resolve, reject) => {
    papa.parse(url, {
      download: true,
      complete: ({ data, errors }) => {
        if (errors.length === 0) {
          const head: string[] = data.shift() as string[]
          const toObject = r.pipe(
            r.zipObj(head),
            r.pick(['date', 'high', 'low', 'open', 'close']),
            r.mapObjIndexed((val, key) => {
              if (key === 'date') {
                return new Date(val).valueOf()
              }
              return parseFloat(val)
            })
          )

          const result = r.pipe(
            r.map((vals: any[]) => toObject(vals)),
            r.sortBy(r.prop('date'))
          )(data as any[]) as any[]

          resolve(result)
        } else {
          reject(errors)
        }
      }
    })
  })
}
