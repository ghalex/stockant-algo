import { take } from 'ramda'
import { Order, Bar, BacktestConfig, RunContext } from '@/types'
import { getCol } from '@/utils'
import { createSeries } from '@/utils/series'

import Strategy from './Strategy'
import Activity from './Activity'
import BarState from './BarState'
import Cache from './Cache'

class Backtest {
  private $barState: BarState
  private $strategy: Strategy
  private $activity: Activity
  private $data: Bar[] = []
  private $cfg: BacktestConfig
  private $cache: Cache

  constructor(cfg: BacktestConfig, data: Bar[]) {
    this.$barState = new BarState(data.length)
    this.$activity = new Activity(this.$barState)
    this.$strategy = new Strategy(this.$activity)
    this.$cache = new Cache(this.$barState, data)
    this.$data = data
    this.$cfg = cfg
  }

  public nextBar() {
    const i = this.$barState.next(this.$data)

    this.$activity.fillOrders()

    const ctx: RunContext = {
      ...this.$cache.barSeries,
      cache: this.$cache,
      currentBar: {
        ...this.$barState.data,
        index: this.$barState.index,
        isLast: i === this.$data.length - 1
      },
      strategy: this.$strategy
    }

    this.$cfg.run(ctx)

    if (this.$barState.isLast) {
      console.log(this.$activity.trades)
    }

    this.print()
    this.$activity.print()
  }

  public init() {
    this.$cfg.beforeRun({ cache: this.$cache })
  }

  public run() {
    while (this.$barState.isLast === false) {
      this.nextBar()
    }
  }

  public print() {
    console.table({
      title: 'Processing bar: ' + this.$barState.index,
      index: this.$barState.index,
      ...this.$barState.data
    })
  }
}

export default Backtest
