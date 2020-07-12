import { Algo, Data } from '../lib'
import { Strategy } from '../lib/types'
// import * as moment from 'moment'

const init = async () => {
  const algo = new Algo()
  const data = new Data('key_here')

  const sac: any = {
    VOO: 0.2, // Vanguard S&P 500
    // "QQQ": 0.20,  // NDX
    VNQ: 0.1, // Vanguard Real Estate
    LQD: 0.2, // iShare Corp Bonds
    ISTB: 0.3, // iShare 1-5 Year Bounds
    IMTB: 0.2 // iShare 5-10 Year Bounds
  }

  const strategy: Strategy = {
    period: 'everyMonth',
    rolling: 0,
    rebalance: (date, getPrice, order, portfolio) => {
      const total = 500

      for (const tick in sac) {
        order(tick, total * sac[tick])
      }
    }
  }

  await data.fetch(Object.keys(sac), '2019-01-01')

  console.log(data.byMonth)
  const portfolio = algo.run(data, strategy)

  console.log('Stats total:\r', portfolio.print().total)
  console.log('Stats per tick:\r', portfolio.print().perTick)
  console.log('Stats per period:\r', portfolio.print().perPeriod)
}

document.body.onload = async () => {
  init()
}
