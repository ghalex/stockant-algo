import * as z from 'zebras'
import { Trade, Price } from '../types'
import { curry, map, keys } from 'lodash'
import * as moment from 'moment'

class Portfolio {
  private _trades: Trade[] = []
  private _statsPerTick = []

  public addTrade(trade: Trade) {
    this._trades.push(trade)
  }

  get totalTrades() {
    return this._trades.length
  }

  get statsTotal() {
    const byTick = z.groupBy((s: any) => s.tick, this.statsPerTick)
    const ticks = keys(byTick)
    const last = z.tail(ticks.length, this.statsPerTick)
    const totalInvested = z.sum(z.getCol('invested', last))
    const totalValue = z.sum(z.getCol('value', last))
    const maxDrawdown = z.min(z.getCol('changePct', this.statsPerPeriod))
    const maxProfit = z.max(z.getCol('changePct', this.statsPerPeriod))

    const df = z.pipe([
      z.addCol('totalValue', [totalValue]),
      z.addCol('trades', [this._trades.length]),
      z.addCol('profit', [totalValue - totalInvested]),
      z.addCol('profitPct', [((totalValue - totalInvested) / totalInvested) * 100]),
      z.addCol('maxDrawdown', [maxDrawdown * 100]),
      z.addCol('maxProfit', [maxProfit * 100])
    ])([{ totalInvested: totalInvested }])

    return df
  }

  get statsPerTick() {
    return this._statsPerTick
  }

  get statsPerPeriod() {
    const group = z.groupBy((t: any) => t.date, this.statsPerTick)
    const dates = keys(group)
    const invested = z.getCol('sum', z.gbSum('invested', group))
    const value = z.getCol('sum', z.gbSum('value', group))

    const df = z.pipe([
      z.addCol('invested', invested),
      z.addCol('value', value),
      (arr: any) =>
        z.addCol(
          'change',
          z.deriveCol((t: any) => t.value - t.invested, arr),
          arr
        ),
      (arr: any) =>
        z.addCol(
          'changePct',
          z.deriveCol((t: any) => t.change / t.invested, arr),
          arr
        )
    ])(map(dates, v => ({ dated: v })))

    return df
  }

  public print() {
    return {
      total: this.printStatsTotal(),
      perTick: this.printStatsPerTick(),
      perPeriod: this.printStatsPerPeriod()
    }
  }

  public printStatsTotal() {
    const toFixed = (v: any) => v.toFixed(3)
    const mapCol = curry(this.mapCol)

    const df = z.pipe([
      mapCol('totalValue', toFixed),
      mapCol('profit', toFixed),
      mapCol('profitPct', toFixed),
      mapCol('maxDrawdown', toFixed),
      mapCol('maxProfit', toFixed)
    ])(this.statsTotal)

    return z.print(df)
  }

  public printStatsPerPeriod() {
    const toFixed = (v: any) => v.toFixed(3)
    const mapCol = curry(this.mapCol)

    const df = z.pipe([
      mapCol('value', toFixed),
      mapCol('change', toFixed),
      mapCol('changePct', toFixed)
    ])(this.statsPerPeriod)

    return z.print(df)
  }

  public printStatsPerTick() {
    const toFixed = (v: any) => v.toFixed(3)
    const mapCol = curry(this.mapCol)

    const df = z.pipe([
      mapCol('price', toFixed),
      mapCol('avgPrice', toFixed),
      mapCol('change', toFixed),
      mapCol('changePct', toFixed),
      mapCol('value', toFixed)
    ])(this.statsPerTick)

    return z.print(df)
  }

  public update(date: Date, getPrice: (tick: string) => Price[]) {
    const trades = z.groupBy((t: Trade) => t.tick, this._trades)
    const ticks = keys(trades)
    const prices = map(ticks, t => getPrice(t)[0].close)
    const dates = map(ticks, _ => moment(date).format('DD/MMM/YYYY'))
    const invested = z.getCol('sum', z.gbSum('amount', trades))
    const shares = z.getCol('sum', z.gbSum('shares', trades))

    const df = z.pipe([
      z.addCol('shares', shares),
      z.addCol('invested', invested),
      z.addCol('date', dates),
      z.addCol('price', prices),
      (arr: any) =>
        z.addCol(
          'avgPrice',
          z.deriveCol((t: any) => t.invested / t.shares, arr),
          arr
        ),
      (arr: any) =>
        z.addCol(
          'value',
          z.deriveCol((t: any) => t.shares * t.price, arr),
          arr
        ),
      (arr: any) =>
        z.addCol(
          'change',
          z.deriveCol((t: any) => t.price - t.avgPrice, arr),
          arr
        ),
      (arr: any) =>
        z.addCol(
          'changePct',
          z.deriveCol((t: any) => t.change / t.avgPrice, arr),
          arr
        )
    ])(map(ticks, v => ({ tick: v })))

    this._statsPerTick = this._statsPerTick.concat(df)
  }

  public mapCol(colName: string, fn: (col: any) => any, data: any) {
    const col = z.deriveCol((r: any) => fn(r[colName]), data)
    return z.pipe([z.dropCol(colName), z.addCol(colName, col)])(data)
  }
}

export default Portfolio
