import { Algo, Data } from '../lib'
import { Strategy } from '../lib/types'
import * as moment from 'moment'

const init = async () => {
  const algo = new Algo()
  const data = new Data()

  const strategy: Strategy = {
    period: 'everyMonth',
    rolling: 0,
    rebalance: (date, getPrice, order) => {
      order('AAPL', 100)
      order('MSFT', 100)

      // console.log(moment(date).format('DD/MMM/YYYY'), getPortfolio())
    }
  }

  const strategy2: Strategy = {
    period: 'everyMonth',
    rolling: 0,
    rebalance: (date, getPrice, order) => {
      order('AAPL', 100)
      order('MSFT', 100)
      // console.log(moment(date).format('DD/MMM/YYYY'), getPortfolio())
    }
  }

  await data.fetch(['MSFT', 'AAPL'], '2020-01-01')

  // const portfolio = algo.run(data, strategy)
  const portfolio2 = algo.run(data, strategy2)

  // console.log('Stats total:\r', portfolio.print().total)
  // console.log('Stats per tick:\r', portfolio.print().perTick)
  // console.log('Stats per period:\r', portfolio.print().perPeriod)

  console.log('Stats total:\r', portfolio2.print().total)
  console.log('Stats per tick:\r', portfolio2.print().perTick)
  console.log('Stats per period:\r', portfolio2.print().perPeriod)
}

document.body.onload = async () => {
  init()
}
