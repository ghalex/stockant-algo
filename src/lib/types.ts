import Data from './classes/Data'

export interface Price {
  date: string
  open: number
  high: number
  low: number
  close: number
}

export interface DictPrice {
  [key: string]: Price[]
}

export interface DictPriceMonth {
  [key: string]: {
    [key: string]: Price[]
  }
}

export type Period = 'everyDay' | 'everyMonth'

export interface RunCallback {
  (idx: number, date: Date, data: DictPrice): void
}

export interface RunOptions {
  data: Data
  period: Period
  startDay?: number
  callback: RunCallback
}

export interface Rebalance {
  (
    date: Date,
    getPrice: (tick: string) => Price[],
    order: (tick: string, amount: number) => number,
    getPortfolio: () => Portfolio
  ): void
}

export interface Order {
  id: number
  shares: number
  tick: string
  price: number
  amount: number
  date: Date
}
export interface Portfolio {
  orders: Order[]
  shares: { [key: string]: number }
  avgPrice: { [key: string]: number }
  invested: { [key: string]: number }
  value: { [key: string]: number }
  profit: { [key: string]: number }
  totalInvested: number
  totalValue: number
  totalProfit: number
}

export interface Strategy {
  period: Period
  rolling?: number
  rebalance: Rebalance
  log?: (date: Date, getPrice: (tick: string) => Price[]) => void
}
