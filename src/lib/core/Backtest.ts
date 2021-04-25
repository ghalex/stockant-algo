import { take } from 'ramda'
import { Order, Price, StrategyConfig } from '@/types'
import { getCol } from '@/utils'
import { createSeries } from '@/utils/series'
import Strategy from './Strategy'

class Backtest {
  public run(cfg: StrategyConfig, data: Price[]) {
    const strategy = new Strategy(cfg)

    for (let i = 0; i < data.length; i++) {
      const currentBar = data[i]
      const open = createSeries(take(i, getCol('open', data)).reverse())
      const close = createSeries(take(i, getCol('close', data)).reverse())
      const high = createSeries(take(i, getCol('high', data)).reverse())
      const low = createSeries(take(i, getCol('low', data)).reverse())

      const $ctx = {
        open,
        close,
        high,
        low,
        strategy
      }

      this.fillOrders(strategy.orders, open.current, currentBar.date)

      cfg.run($ctx)

      if (cfg.procssOnClose) {
        // fill orders with close price
      }
    }
  }

  private fillOrders(orders: Order[], price: number, date: Date) {
    for (const order of orders) {
      if (order.limit) {
        console.log('Limit orders not implemented')
      } else {
      }
    }
  }
}

export default Backtest
