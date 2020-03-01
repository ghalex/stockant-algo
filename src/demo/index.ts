import { Algo, Data } from '../lib'
import { Strategy } from '../lib/types'
import * as moment from 'moment'

const init = async () => {
  const algo = new Algo()
  const data = new Data()
  const strategy: Strategy = {
    period: 'everyMonth',
    rolling: 0,
    rebalance: (date, getPrice, order, getPortfolio) => {
      // console.log(moment(date).format('DD/MMM/YYYY'), getPrice('AAPL'))
      order('AAPL', 100)
      order('MSFT', 100)

      console.log(getPortfolio().totalProfit)
    }
  }

  await data.fetch(['MSFT', 'AAPL'], '2020-01-01')

  const portfolio = algo.run(data, strategy)
  console.log(portfolio)
}

document.body.onload = async () => {
  init()
}