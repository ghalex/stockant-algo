import { Order, Trade, Bar, OrderInput } from '@/types'
import BarState from './BarState'
import * as r from 'ramda'

class Activity {
  public barState: BarState

  private $orders: Order[] = []
  private $trades: Trade[] = []

  constructor(barState: BarState) {
    this.barState = barState
  }

  get notFilled() {
    return this.$orders.filter((o) => !o.filled)
  }

  get openTrades() {
    return this.$trades.filter((t) => !t.closeDate)
  }

  get trades() {
    return this.$trades
  }

  get positionSize() {
    const long = r.sum(this.openTrades.map((t) => (t.action === 'buy' ? t.qty : 0)))
    const short = r.sum(this.openTrades.map((t) => (t.action === 'sell' ? -t.qty : 0)))

    return long + short
  }

  public addOrder(order: OrderInput, type: 'open' | 'close') {
    const idx = this.notFilled.findIndex((o) => o.id === order.id && o.type === type)
    const { date } = this.barState.data

    if (idx === -1) {
      this.$orders.push({
        long: true,
        ...order,
        barIndex: this.barState.index,
        created: new Date(date),
        type
      })
    } else {
      // there is allready an order with this id & type
      console.log('order updated')
    }
  }

  public getOrder(id: string): Order | null {
    const idx = this.notFilled.findIndex((o) => o.id === id)

    if (idx === -1) {
      return null
    }

    return this.notFilled[idx]
  }

  public fill(order: Order, price: number, date: Date) {
    if (order.type === 'open') {
      const trade: Trade = {
        id: order.id,
        openDate: date,
        openPrice: price,
        openBar: this.barState.index,
        qty: order.qty,
        action: order.long ? 'buy' : 'sell'
      }

      this.$trades.push(trade)
    }

    if (order.type === 'close') {
      const trades = this.openTrades.filter((t) => t.id === order.id)

      for (const trade of trades) {
        trade.closePrice = price
        trade.closeDate = date
        trade.closeBar = this.barState.index
      }
    }

    order.filled = new Date(date)
    order.fillPrice = price

    console.log('order filled:', order.id, 'type: ', order.type)
    // console.log('orders:', this.$orders)
    // console.log('trades:', this.$trades)
  }

  public fillOrders() {
    const { open, close, low, high, date } = this.barState.data
    const orders = r.sortBy(r.prop('type'), this.notFilled)
    let nbOfFilledOrders = 0

    for (const order of orders) {
      if (order.limit) {
        if (order.limit >= low && order.limit <= high) {
          this.fill(order, order.limit, new Date(date))
          nbOfFilledOrders += 1
        }
      } else {
        this.fill(order, open, new Date(date))
        nbOfFilledOrders += 1
      }
    }

    // remove all unfilled
    // this.$orders = r.filter((o) => o.filled !== undefined, this.$orders)

    return nbOfFilledOrders
  }

  public print() {
    console.table(this.$orders)
    console.table(this.$trades)
  }
}

export default Activity
