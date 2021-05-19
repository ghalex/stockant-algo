import Strategy from './core/Strategy'
import Cache from './core/Cache'

export interface Series<T> extends Array<T> {
  current: T
  default: T
  barsSince: (cond: (val: any) => boolean) => number
}

export interface Bar {
  date: number
  open: number
  high: number
  low: number
  close: number
}

export interface BarSeries {
  open: Series<number>
  high: Series<number>
  close: Series<number>
  low: Series<number>
  date: Series<number>
}

export interface DictSeries {
  [key: string]: Series<any>
}

export interface RunContext extends BarSeries {
  strategy: Strategy
  currentBar: Bar & { isLast: boolean; index: number }
  cache: Cache
}

export interface BacktestConfig {
  name: string
  timeWindow?: [Date, Date] | []
  pyramiding?: number
  procssOnClose?: number
  beforeRun: (ctx: { cache: Cache }) => void
  run: (ctx: RunContext) => void
}

export interface OrderInput {
  id: string
  qty: number
  long?: boolean
  limit?: number
}

export interface Order extends OrderInput {
  type: 'open' | 'close'
  barIndex: number
  created?: Date
  filled?: Date
  fillPrice?: number
}

export interface Trade {
  id: string
  qty: number
  openDate: Date
  openPrice: number
  openBar: number
  closeDate?: Date
  closePrice?: number
  closeBar?: number
  action: 'buy' | 'sell'
}
