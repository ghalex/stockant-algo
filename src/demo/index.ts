import { Algo, Data } from '../lib'
import { Strategy } from '../lib/types'
// import * as moment from 'moment'

const init = async () => {
  const algo = new Algo()
  const data = new Data('0ed66e52f829c1c8913cb84978451fab')
  const strategy: Strategy = {
    period: 'everyMonth',
    rolling: 0,
    rebalance: (date, getPrice, order) => {
      order('AAPL', 100)
      order('MSFT', 100)

      // console.log(moment(date).format('DD/MMM/YYYY'), getPortfolio())
    }
  }

  await data.fetch(['MSFT', 'AAPL'], '2019-08-01')

  const portfolio = algo.run(data, strategy)
  portfolio.calculate()
  console.log(portfolio.printTrades())
}

document.body.onload = async () => {
  init()
}
