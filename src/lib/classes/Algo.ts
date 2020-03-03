import Scheduler from './Scheduler'
import Portfolio from './Portfolio'
import Data from './Data'
import * as moment from 'moment'
import { keys } from 'lodash'
import { DictPrice, Price, Strategy, Trade } from '../types'

class Algo {
  version = '1.0.10'
  scheduler = new Scheduler()
  portfolio = new Portfolio()

  /**
   * Get prices for tick
   * @param tick
   */
  private getPrice = (idx: number, rolling: number, data: DictPrice) => (tick: string) => {
    const start = idx - rolling >= 0 ? idx - rolling : 0
    const end = idx + 1

    return data[tick].slice(start, end).reverse()
  }

  /**
   *  Place order
   * @param tick
   * @param amount
   */
  private orderAmount = (date: Date, getPrice: (tick: string) => Price[]) => (
    tick: string,
    amount: number
  ) => {
    const price = getPrice(tick)[0].close
    const trade: Trade = {
      id: this.portfolio.nbOfTrades + 1,
      shares: amount / price,
      tick,
      price,
      amount,
      date,
      label: moment(date).format('DD/MM/YYYY')
    }

    this.portfolio.addTrade(trade)
    return trade.id
  }

  public run(allData: Data, strategy: Strategy): Portfolio {
    this.portfolio = new Portfolio()

    const res: DictPrice = this.scheduler.run({
      data: allData,
      period: strategy.period,
      callback: (idx: number, date: Date, data: DictPrice, len: number) => {
        const rolling = strategy.rolling || 0
        const getPrice = this.getPrice(idx, rolling, data)
        const order = this.orderAmount(date, getPrice)

        if (idx >= rolling) {
          strategy.rebalance(date, getPrice, order, this.portfolio)
          this.portfolio.update(date, getPrice)

          if (strategy.log) {
            strategy.log(date, getPrice, this.portfolio)
          }
        }
      }
    })

    const lastPrice: any = {}
    for (const tick of keys(allData.byDay)) {
      lastPrice[tick] = allData.byDay[tick].reverse()[0]
    }

    this.portfolio.setLastPrice(lastPrice)

    return this.portfolio
  }
}

export default Algo
