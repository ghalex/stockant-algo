import Strategy from '@/core/Strategy'
import { createSeries } from '@/utils/series'

export interface Series extends Array<number> {
  current: number
}

export interface Price {
  date: Date
  open: number
  high: number
  low: number
  close: number
}

export interface DictPrice {
  [key: string]: Price[]
}

export interface RunContext {
  strategy: Strategy
  open: Series
  high: Series
  close: Series
  low: Series
}

export interface StrategyConfig {
  name: string
  timeWindow?: [Date, Date] | []
  pyramiding?: number
  procssOnClose?: number
  run: (ctx: RunContext) => void
}

export interface Order {
  id: string
  qty: number
  long: boolean
  limit?: number
}
