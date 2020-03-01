import * as z from 'zebras'
import Scheduler from './Scheduler'
import Data from './Data'
import { mapValues, keyBy, last, reduce } from 'lodash'
import { DictPrice, Price, Portfolio, Strategy, Order } from '../types'

class Algo {
  version = '1.0.0'
  scheduler = new Scheduler()

  private _orders: Order[] = []

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
    const order: Order = {
      id: this._orders.length + 1,
      shares: amount / price,
      tick,
      price,
      amount,
      date: date
    }

    this._orders.push(order)
    return order.id
  }

  run(data: Data, strategy: Strategy): Portfolio {
    const res: DictPrice = this.scheduler.run({
      data,
      period: strategy.period,
      callback: (idx: number, date: Date, data: DictPrice) => {
        const rolling = strategy.rolling || 0
        const getPrice = this.getPrice(idx, rolling, data)
        const order = this.orderAmount(date, getPrice)

        if (idx >= rolling) {
          const getPortfolio = () => this.portfolio(getPrice)
          strategy.rebalance(date, getPrice, order, getPortfolio)
          if (strategy.log) {
            strategy.log(date, getPrice)
          }
        }
      }
    })

    return this.portfolio((tick: string) => {
      return res[tick].reverse()
    })
  }

  /**
   * Calculate portfolio
   * @param prices
   */
  portfolio(getPrice: (tick: string) => Price[]): Portfolio {
    const ordersGroup = z.groupBy((x: Order) => x.tick, this.orders)
    const shares = mapValues(keyBy(z.gbSum('shares', ordersGroup), 'group'), 'sum')
    const invested = mapValues(keyBy(z.gbSum('amount', ordersGroup), 'group'), 'sum')
    const avgPrice = mapValues(invested, (v, k) => v / shares[k])
    const value = mapValues(shares, (v, k) => v * getPrice(k)[0].close)
    const profit = mapValues(value, (v, k) => (v - invested[k]) / invested[k])
    const totalValue = reduce(value, (total, v, k) => total + v, 0)
    const totalInvested = reduce(invested, (total, v, k) => total + v, 0)
    const portfolio: Portfolio = {
      orders: ordersGroup,
      shares,
      avgPrice,
      invested,
      value,
      profit,
      totalInvested,
      totalValue,
      totalProfit: (totalValue - totalInvested) / totalInvested
    }

    return portfolio
  }

  get orders(): Order[] {
    return this._orders
  }
}

export default Algo
