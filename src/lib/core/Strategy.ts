import { StrategyConfig, Order } from '@/types'

class Strategy {
  private $config: StrategyConfig
  private $orders: Order[]

  constructor(config: StrategyConfig) {
    this.$config = config
    this.$orders = [] as Order[]
  }

  public order(id: string, long: boolean, qty: number, limit?: number) {
    const order: Order = {
      id,
      long,
      qty,
      limit
    }

    this.$orders.push(order)
  }

  get orders() {
    return this.$orders.concat()
  }
}

export default Strategy
