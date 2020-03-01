import * as z from 'zebras'
import { Trade } from '../types'
import { mapValues, keyBy, last, reduce } from 'lodash'
import * as moment from 'moment'

interface TickNumber {
  [key: string]: number
}

class Portfolio {
  trades: Trade[] = []
  shares: TickNumber = {}

  public addTrade(trade: Trade) {
    this.trades.push(trade)
  }

  public printTrades() {
    const col1 = z.deriveCol((t: Trade) => moment(t.date).format('DD/MM/YYYY'), this.trades)
    const trades = z.pipe([z.dropCol('date'), z.addCol('date', col1)])(this.trades)

    return z.print(z.dropCol('date', this.trades))
  }

  public calculate() {
    const byTick = z.groupBy((t: Trade) => t.tick, this.trades)
    const byDate = z.groupBy((t: Trade) => moment(t.date).format('DD/MM/YYYY'), this.trades)

    console.log(byDate)
  }
  // const ordersGroup = z.groupBy((x: Order) => x.tick, this.orders)
  // const shares = mapValues(keyBy(z.gbSum('shares', ordersGroup), 'group'), 'sum')
  // const invested = mapValues(keyBy(z.gbSum('amount', ordersGroup), 'group'), 'sum')
  // const avgPrice = mapValues(invested, (v, k) => v / shares[k])
  // const value = mapValues(shares, (v, k) => v * getLastPrice(k).close)
  // const profit = mapValues(value, (v, k) => (v - invested[k]) / invested[k])
  // const totalValue = reduce(value, (total, v, k) => total + v, 0)
  // const totalInvested = reduce(invested, (total, v, k) => total + v, 0)
  // const portfolio: Portfolio = {
  //   orders: ordersGroup,
  //   shares,
  //   avgPrice,
  //   invested,
  //   value,
  //   profit,
  //   totalInvested,
  //   totalValue,
  //   totalProfit: (totalValue - totalInvested) / totalInvested
  // }
  // }
}

export default Portfolio
