// import { Algo, Data } from '../lib'
// import { Strategy } from '../lib/types'
import * as papa from 'papaparse'
import * as r from 'ramda'
import { Backtest } from '../lib'
import { Price, StrategyConfig } from '../lib/types'

const init = async () => {
  const data = await readCSV('/data/aapl.csv')

  const backtest = new Backtest()
  const strategy: StrategyConfig = {
    name: 'Time Flow',
    timeWindow: [],
    pyramiding: 0,
    run: function ({ strategy, close }) {
      if (close.current > 134) {
        strategy.order('id_long', true, 10)
      }
    }
  }

  backtest.run(strategy, r.takeLast(10, data))
}

document.body.onload = async () => {
  init()
}

async function readCSV(url: string): Promise<Price[]> {
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
                return new Date(val)
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
